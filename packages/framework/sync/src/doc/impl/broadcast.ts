import { diffUpdate, encodeStateVectorFromUpdate, mergeUpdates } from 'yjs';

import { MANUALLY_STOP } from '../../utils/throw-if-aborted.js';
import type { DocSource } from '../source.js';

type ChannelMessage =
  | {
    type: 'init';
  }
  | {
    type: 'update';
    docId: string;
    data: Uint8Array;
  };

export class BroadcastChannelDocSource implements DocSource {
  private _disposed = false;

  private readonly _onMessage = (event: MessageEvent<ChannelMessage>) => {
    if (this._disposed) return;

    if (event.data.type === 'init') {
      for (const [docId, data] of this.docMap) {
        this.channel.postMessage({
          type: 'update',
          docId,
          data,
        } satisfies ChannelMessage);
      }
      return;
    }

    const { docId, data } = event.data;
    const update = this.docMap.get(docId);
    if (update) {
      this.docMap.set(docId, mergeUpdates([update, data]));
    } else {
      this.docMap.set(docId, data);
    }
  };

  channel = new BroadcastChannel(this.channelName);

  docMap = new Map<string, Uint8Array>();

  name = 'broadcast-channel';

  constructor(readonly channelName: string = 'blocksuite:doc') {
    this.channel.addEventListener('message', this._onMessage);

    this.channel.postMessage({
      type: 'init',
    });
  }

  get disposed(): boolean {
    return this._disposed;
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;

    // 移除 message 事件监听器
    this.channel.removeEventListener('message', this._onMessage);

    // 清空文档缓存
    this.docMap.clear();

    // 关闭 BroadcastChannel
    this.channel.close();
  }

  pull(docId: string, state: Uint8Array) {
    if (this._disposed) return null;

    const update = this.docMap.get(docId);
    if (!update) return null;

    const diff = state.length ? diffUpdate(update, state) : update;
    return { data: diff, state: encodeStateVectorFromUpdate(update) };
  }

  push(docId: string, data: Uint8Array) {
    if (this._disposed) return;

    const update = this.docMap.get(docId);
    if (update) {
      this.docMap.set(docId, mergeUpdates([update, data]));
    } else {
      this.docMap.set(docId, data);
    }

    const doc = this.docMap.get(docId);
    if (!doc) {
      console.error('data is not found when syncing broadcast channel');
      return;
    }

    this.channel.postMessage({
      type: 'update',
      docId,
      data: this.docMap.get(docId)!,
    } satisfies ChannelMessage);
  }

  subscribe(cb: (docId: string, data: Uint8Array) => void) {
    if (this._disposed) {
      return () => { };
    }

    const abortController = new AbortController();
    this.channel.addEventListener(
      'message',
      (event: MessageEvent<ChannelMessage>) => {
        if (event.data.type !== 'update') return;
        const { docId, data } = event.data;
        cb(docId, data);
      },
      { signal: abortController.signal }
    );
    return () => {
      abortController.abort(MANUALLY_STOP);
    };
  }
}
