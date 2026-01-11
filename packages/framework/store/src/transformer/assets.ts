import { BlockSuiteError, ErrorCode } from '@blocksuite/global/exceptions';

import type { BlockProps } from '../model';
import type { BlobCRUD } from './type';

type AssetsManagerConfig = {
  blob: BlobCRUD;
};

function makeNewNameWhenConflict(names: Set<string>, name: string) {
  let i = 1;
  const ext = name.split('.').at(-1) ?? '';
  let newName = name.replace(new RegExp(`.${ext}$`), ` (${i}).${ext}`);
  while (names.has(newName)) {
    newName = name.replace(new RegExp(`.${ext}$`), ` (${i}).${ext}`);
    i++;
  }
  return newName;
}

export class AssetsManager {
  // `blockId` is the key.
  readonly uploadingAssetsMap = new Map<
    string,
    {
      blob: Blob;
      abortController?: AbortController;
      mapInto: (blobId: string) => Partial<BlockProps>;
    }
  >();

  private readonly _assetsMap = new Map<string, Blob>();

  private readonly _blob: BlobCRUD;

  private readonly _names = new Set<string>();

  private readonly _pathBlobIdMap = new Map<string, string>();

  constructor(options: AssetsManagerConfig) {
    this._blob = options.blob;
  }

  cleanup() {
    this._assetsMap.clear();
    this._names.clear();
  }

  getAssets() {
    return this._assetsMap;
  }

  getPathBlobIdMap() {
    return this._pathBlobIdMap;
  }

  isEmpty() {
    return this._assetsMap.size === 0;
  }

  async readFromBlob(blobId: string) {
    console.log('[AssetsManager.readFromBlob] 尝试读取 blob', {
      blobId,
      alreadyInAssetsMap: this._assetsMap.has(blobId),
    });

    if (this._assetsMap.has(blobId)) {
      console.log('[AssetsManager.readFromBlob] blob 已在 assetsMap 中，跳过读取');
      return;
    }

    console.log('[AssetsManager.readFromBlob] 从 blob storage 读取...');
    const blob = await this._blob.get(blobId);

    if (!blob) {
      console.error(`[AssetsManager.readFromBlob] Blob ${blobId} not found in blob manager`, {
        blobId,
        blobCRUD: this._blob,
      });
      return;
    }

    console.log('[AssetsManager.readFromBlob] 成功读取 blob', {
      blobId,
      blobSize: blob.size,
      blobType: blob.type,
      isFile: blob instanceof File,
    });

    if (blob instanceof File) {
      let file = blob;
      if (this._names.has(blob.name)) {
        const newName = makeNewNameWhenConflict(this._names, blob.name);
        file = new File([blob], newName, { type: blob.type });
      }
      this._assetsMap.set(blobId, file);
      this._names.add(file.name);
      return;
    }
    if (blob.type && blob.type !== 'application/octet-stream') {
      this._assetsMap.set(blobId, blob);
      return;
    }
    // Guess the file type from the buffer
    const buffer = await blob.arrayBuffer();
    const FileType = await import('file-type');
    const fileType = await FileType.fileTypeFromBuffer(buffer);
    if (fileType) {
      const file = new File([blob], '', { type: fileType.mime });
      this._assetsMap.set(blobId, file);
      return;
    }
    this._assetsMap.set(blobId, blob);
  }

  async writeToBlob(blobId: string) {
    console.log('[AssetsManager.writeToBlob] 开始写入 blob', {
      blobId,
      assetsMapSize: this._assetsMap.size,
      assetsMapKeys: Array.from(this._assetsMap.keys()),
      hasBlobInMap: this._assetsMap.has(blobId),
    });

    const blob = this._assetsMap.get(blobId);
    if (!blob) {
      console.error('[AssetsManager.writeToBlob] blob 不在 assetsMap 中', { blobId });
      throw new BlockSuiteError(
        ErrorCode.TransformerError,
        `Blob ${blobId} not found in assets manager`
      );
    }

    console.log('[AssetsManager.writeToBlob] 找到 blob，准备调用 _blob.set', {
      blobId,
      blobSize: blob.size,
      blobType: blob.type,
      blobCRUD: this._blob,
    });

    await this._blob.set(blobId, blob);

    console.log('[AssetsManager.writeToBlob] blob 写入完成', { blobId });
  }
}
