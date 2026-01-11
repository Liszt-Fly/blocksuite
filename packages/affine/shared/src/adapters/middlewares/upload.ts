import { sha } from '@blocksuite/global/utils';
import type { BlockStdScope } from '@blocksuite/std';
import type {
  BlockModel,
  BlockProps,
  TransformerMiddleware,
} from '@blocksuite/store';
import { filter, from, map, mergeMap } from 'rxjs';

const ALLOWED_FLAVOURS = new Set(['affine:attachment', 'affine:image']);

export const uploadMiddleware = (
  std: BlockStdScope,
  concurrent = 5
): TransformerMiddleware => {
  console.log('[uploadMiddleware] 初始化 uploadMiddleware');

  const blockView$ = std.view.viewUpdated.pipe(
    filter(payload => payload.type === 'block'),
    filter(payload => ALLOWED_FLAVOURS.has(payload.view.model.flavour))
  );

  return ({ assetsManager }) => {
    console.log('[uploadMiddleware] middleware 被调用，assetsManager:', {
      uploadingAssetsMapSize: assetsManager.uploadingAssetsMap.size,
      uploadingAssetsMapKeys: Array.from(assetsManager.uploadingAssetsMap.keys()),
    });

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
      console.log('[uploadMiddleware.upload] 开始上传', {
        modelId: model.id,
        modelFlavour: model.flavour,
        blobSize: blob.size,
        blobType: blob.type,
        hasAbortController: !!abortController,
      });

      if (!abortController) {
        console.log('[uploadMiddleware.upload] 没有 abortController，返回 null');
        return null;
      }

      const signal = abortController.signal;
      if (signal.aborted) {
        console.log('[uploadMiddleware.upload] signal 已 aborted，返回 null');
        return null;
      }

      // Double check
      if (!model.store.hasBlock(model.id)) {
        console.log('[uploadMiddleware.upload] block 不存在，返回 null', { modelId: model.id });
        return null;
      }

      try {
        signal.throwIfAborted();

        const blobId = await Promise.race([
          (async function processUpload() {
            console.log('[uploadMiddleware.upload] 开始计算 SHA...');
            const blobId = await sha(await blob.arrayBuffer());
            console.log('[uploadMiddleware.upload] SHA 计算完成', { blobId });

            assetsManager.getAssets().set(blobId, blob);
            console.log('[uploadMiddleware.upload] 已添加到 assetsManager.getAssets()', {
              blobId,
              assetsSize: assetsManager.getAssets().size,
            });

            console.log('[uploadMiddleware.upload] 开始写入 blob storage...');
            await assetsManager.writeToBlob(blobId);
            console.log('[uploadMiddleware.upload] blob storage 写入完成', { blobId });

            return await new Promise<string | null>(resolve => {
              model.store.withoutTransact(() => {
                if (signal.aborted) {
                  console.log('[uploadMiddleware.upload] signal aborted，不更新 block');
                  return resolve(null);
                }

                console.log('[uploadMiddleware.upload] 更新 block sourceId', {
                  modelId: model.id,
                  blobId,
                  mapIntoResult: mapInto(blobId),
                });
                model.store.updateBlock(model, mapInto(blobId));

                resolve(blobId);
              });
            });
          })(),
          // If the signal is not aborted, it will be in the pending state.
          new Promise<null>(resolve => {
            signal.addEventListener('abort', () => resolve(null), {
              once: true,
            });
            if (signal.aborted) {
              resolve(null);
            }
          }),
        ]);

        console.log('[uploadMiddleware.upload] 上传完成', { blobId });
        return blobId;
      } catch (err) {
        console.error('[uploadMiddleware.upload] 上传失败', err);
        return null;
      }
    }

    // 添加对 viewUpdated 的直接订阅来调试
    const debugSubscription = std.view.viewUpdated.subscribe(payload => {
      console.log('[uploadMiddleware] viewUpdated 事件', {
        type: payload.type,
        method: payload.method,
        id: payload.id,
        viewFlavour: payload.type === 'block' ? payload.view?.model?.flavour : 'N/A',
        isAllowedFlavour: payload.type === 'block' ? ALLOWED_FLAVOURS.has(payload.view?.model?.flavour) : false,
        uploadingAssetsMapSize: assetsManager.uploadingAssetsMap.size,
        uploadingAssetsMapKeys: Array.from(assetsManager.uploadingAssetsMap.keys()),
      });
    });

    const blockViewSubscription = blockView$
      .pipe(
        map(payload => {
          console.log('[uploadMiddleware] blockView$ 收到事件', {
            method: payload.method,
            modelId: payload.view.model.id,
            modelFlavour: payload.view.model.flavour,
            uploadingAssetsMapSize: assetsManager.uploadingAssetsMap.size,
            uploadingAssetsMapKeys: Array.from(assetsManager.uploadingAssetsMap.keys()),
            hasInMap: assetsManager.uploadingAssetsMap.has(payload.view.model.id),
          });

          if (assetsManager.uploadingAssetsMap.size === 0) {
            console.log('[uploadMiddleware] uploadingAssetsMap 为空，跳过');
            return null;
          }

          const model = payload.view.model;
          if (!assetsManager.uploadingAssetsMap.has(model.id)) {
            console.log('[uploadMiddleware] model.id 不在 uploadingAssetsMap 中，跳过', {
              modelId: model.id,
              uploadingAssetsMapKeys: Array.from(assetsManager.uploadingAssetsMap.keys()),
            });
            return null;
          }

          const state = assetsManager.uploadingAssetsMap.get(model.id)!;

          if (payload.method === 'add') {
            console.log('[uploadMiddleware] method=add，准备上传', { modelId: model.id });
            state.abortController = new AbortController();
            return { model, state };
          } else {
            console.log('[uploadMiddleware] method 不是 add，abort 并删除', {
              method: payload.method,
              modelId: model.id,
            });
            state.abortController?.abort();
            assetsManager.uploadingAssetsMap.delete(model.id);
            return null;
          }
        }),
        filter(Boolean),
        mergeMap(
          ({ model, state }) =>
            from(
              upload(model, state).then(() => {
                console.log('[uploadMiddleware] 上传完成，从 uploadingAssetsMap 删除', {
                  modelId: model.id,
                });
                assetsManager.uploadingAssetsMap.delete(model.id);
              })
            ),
          concurrent
        )
      )
      .subscribe();

    return () => {
      console.log('[uploadMiddleware] 清理订阅');
      debugSubscription.unsubscribe();
      blockViewSubscription.unsubscribe();
    };
  };
};
