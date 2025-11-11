import { ColorScheme } from '@blocksuite/affine-model';
import { ThemeProvider } from '@blocksuite/affine-shared/services';
import { LifeCycleWatcher } from '@blocksuite/std';
import { type Signal, signal } from '@preact/signals-core';
import {
  createHighlighterCore,
  createOnigurumaEngine,
  type HighlighterCore,
  type MaybeGetter,
} from 'shiki';
import getWasm from 'shiki/wasm';

import { CodeBlockConfigExtension } from './code-block-config.js';
import {
  CODE_BLOCK_DEFAULT_DARK_THEME,
  CODE_BLOCK_DEFAULT_LIGHT_THEME,
} from './highlight/const.js';

export class CodeBlockHighlighter extends LifeCycleWatcher {
  static override key = 'code-block-highlighter';

  private _darkThemeKey: string | undefined;

  private _lightThemeKey: string | undefined;

  highlighter$: Signal<HighlighterCore | null> = signal(null);

  get themeKey() {
    const theme = this.std.get(ThemeProvider).theme$.value;
    return theme === ColorScheme.Dark
      ? this._darkThemeKey
      : this._lightThemeKey;
  }

  private readonly _loadTheme = async (
    highlighter: HighlighterCore
  ): Promise<void> => {
    const config = this.std.getOptional(CodeBlockConfigExtension.identifier);
    const darkTheme = config?.theme?.dark ?? CODE_BLOCK_DEFAULT_DARK_THEME;
    const lightTheme = config?.theme?.light ?? CODE_BLOCK_DEFAULT_LIGHT_THEME;
    this._darkThemeKey = (await normalizeGetter(darkTheme)).name;
    this._lightThemeKey = (await normalizeGetter(lightTheme)).name;
    // Always ensure themes are loaded on the shared highlighter. Duplicate
    // loads are ignored by Shiki and cheap compared to spawning instances.
    await highlighter.loadTheme(darkTheme, lightTheme);
    this.highlighter$.value = highlighter;
  };

  override mounted(): void {
    super.mounted();

    // Use a shared singleton highlighter across all CodeBlockHighlighter
    // instances to avoid spawning multiple Shiki cores during development
    // (which triggers "Shiki is supposed to be used as a singleton").
    sharedRefCount++;
    getSharedHighlighter()
      .then(this._loadTheme)
      .catch(console.error);
  }

  override unmounted(): void {
    // Release reference; dispose the shared instance only when the last
    // consumer is gone.
    this.highlighter$.value = null;
    sharedRefCount = Math.max(0, sharedRefCount - 1);
    if (sharedRefCount === 0) {
      sharedHighlighter?.dispose?.();
      sharedHighlighter = null;
      sharedInitPromise = null;
    }
  }
}

/**
 * https://github.com/shikijs/shiki/blob/933415cdc154fe74ccfb6bbb3eb6a7b7bf183e60/packages/core/src/internal.ts#L31
 */
export async function normalizeGetter<T>(p: MaybeGetter<T>): Promise<T> {
  return Promise.resolve(typeof p === 'function' ? (p as any)() : p).then(
    r => r.default || r
  );
}

// -----------------------------
// Shared Shiki Highlighter Core
// -----------------------------
let sharedHighlighter: HighlighterCore | null = null;
let sharedInitPromise: Promise<HighlighterCore> | null = null;
let sharedRefCount = 0;

function getSharedHighlighter(): Promise<HighlighterCore> {
  if (sharedHighlighter) return Promise.resolve(sharedHighlighter);
  if (sharedInitPromise) return sharedInitPromise;

  sharedInitPromise = createHighlighterCore({
    engine: createOnigurumaEngine(() => getWasm),
  })
    .then(h => {
      sharedHighlighter = h;
      return h;
    })
    .finally(() => {
      // Do not clear promise here to keep a single inflight initializer.
    });

  return sharedInitPromise;
}
