import { createIdentifier } from '@blocksuite/global/di';
import type { ExtensionType } from '@blocksuite/store';

export type KVContextType = {
  get<T = unknown>(key: string): T | undefined;
  set: (key: string, value: unknown) => void;
  all: () => Record<string, unknown>;
};

// DI identifier: retrieve/override via std.provider
export const KVContextProvider = createIdentifier<KVContextType>(
  'AffineKVContextProvider'
);

// Extension: inject a simple in-memory KV store (per editor instance)
export function KVContextExtension(
  init: Record<string, unknown> = {}
): ExtensionType {
  const data = new Map<string, unknown>(Object.entries(init));
  const impl: KVContextType = {
    get: key => data.get(key) as any,
    set: (key, value) => {
      data.set(key, value);
    },
    all: () => Object.fromEntries(data.entries()),
  };

  return {
    setup: di => {
      di.addImpl(KVContextProvider, () => impl);
    },
  };
}

