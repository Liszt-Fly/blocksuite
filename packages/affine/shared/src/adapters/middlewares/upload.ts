import { sha } from '@blocksuite/global/utils';
import type { BlockStdScope } from '@blocksuite/std';
import type {
  AfterImportBlockPayload,
  BlockModel,
  BlockProps,
  TransformerMiddleware,
} from '@blocksuite/store';
import { filter, from, mergeMap } from 'rxjs';

const ALLOWED_FLAVOURS = new Set(['affine:attachment', 'affine:image']);

// 全局的 uploadingAssetsMap，跨 Transformer 实例共享
// 因为每次粘贴都会创建新的 Transformer 和 AssetsManager，
// 需要一个全局 map 来跨实例共享上传状态
const globalUploadingAssetsMap = new Map<string, {
  blob: Blob;
  mapInto: (blobId: string) => Partial<BlockProps>;
  abortController?: AbortController;
}>();

export const uploadMiddleware = (
  std: BlockStdScope,
  concurrent = 5
): TransformerMiddleware => {
  return ({ slots, assetsManager }) => {
    // 将当前 assetsManager 的 uploadingAssetsMap 同步到全局 map
    const syncToGlobalMap = () => {
      assetsManager.uploadingAssetsMap.forEach((value, key) => {
        if (!globalUploadingAssetsMap.has(key)) {
          globalUploadingAssetsMap.set(key, value);
        }
      });
    };

    syncToGlobalMap();

    async function upload(
      model: BlockModel,
      {
        blob,
        mapInto,
        abortController,
      }: {
        blob: Blob;
        mapInto: (blobId: string) => Partial<BlockProps>;
        abortController?: AbortController;
      }
    ) {
      if (!abortController) return null;

      const signal = abortController.signal;
      if (signal.aborted) return null;

      if (!model.store.hasBlock(model.id)) return null;

      try {
        signal.throwIfAborted();

        const blobId = await Promise.race([
          (async function processUpload() {
            const blobId = await sha(await blob.arrayBuffer());

            assetsManager.getAssets().set(blobId, blob);
            await assetsManager.writeToBlob(blobId);

            return await new Promise<string | null>(resolve => {
              model.store.withoutTransact(() => {
                if (signal.aborted) return resolve(null);
                model.store.updateBlock(model, mapInto(blobId));
                resolve(blobId);
              });
            });
          })(),
          new Promise<null>(resolve => {
            signal.addEventListener('abort', () => resolve(null), {
              once: true,
            });
            if (signal.aborted) {
              resolve(null);
            }
          }),
        ]);

        return blobId;
      } catch (err) {
        console.error(err);
        assetsManager.uploadingAssetsMap.delete(model.id);
        globalUploadingAssetsMap.delete(model.id);
        return null;
      }
    }

    // 使用 slots.afterImport 来触发上传
    // 不依赖 std.view.viewUpdated，避免了 Editor 切换时的问题
    const afterImportSubscription = slots.afterImport
      .pipe(
        filter((payload): payload is AfterImportBlockPayload => payload.type === 'block'),
        filter(payload => ALLOWED_FLAVOURS.has(payload.model.flavour)),
        mergeMap(
          payload => {
            syncToGlobalMap();
            const model = payload.model;

            let state = globalUploadingAssetsMap.get(model.id);
            if (!state) {
              state = assetsManager.uploadingAssetsMap.get(model.id);
            }

            if (!state) {
              return from(Promise.resolve());
            }

            state.abortController = new AbortController();

            return from(
              upload(model, state).then(() => {
                assetsManager.uploadingAssetsMap.delete(model.id);
                globalUploadingAssetsMap.delete(model.id);
              })
            );
          },
          concurrent
        )
      )
      .subscribe();

    // 保留 viewUpdated 订阅处理 block 删除（取消上传）
    const blockViewSubscription = std.view.viewUpdated
      .pipe(
        filter(payload => payload.type === 'block'),
        filter(payload => ALLOWED_FLAVOURS.has(payload.view.model.flavour)),
        filter(payload => payload.method === 'delete')
      )
      .subscribe(payload => {
        const model = payload.view.model;
        const state = globalUploadingAssetsMap.get(model.id) ||
          assetsManager.uploadingAssetsMap.get(model.id);
        if (state) {
          state.abortController?.abort();
          assetsManager.uploadingAssetsMap.delete(model.id);
          globalUploadingAssetsMap.delete(model.id);
        }
      });

    return () => {
      afterImportSubscription.unsubscribe();
      blockViewSubscription.unsubscribe();
    };
  };
};
