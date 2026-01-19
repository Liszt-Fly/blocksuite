import type { RootBlockModel } from '@blocksuite/affine-model';
import type { BlockModel } from '@blocksuite/store';
import { Text } from '@blocksuite/store';
import { WidgetComponent } from '@blocksuite/std';
import { RANGE_SYNC_EXCLUDE_ATTR } from '@blocksuite/std/inline';
import { computed, signal } from '@preact/signals-core';
import { css, html, nothing } from 'lit';
import { query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

type DocSearchMatch = {
  blockId: string;
  blockType: string;
  text: string;
};

export class AffineDocSearchWidget extends WidgetComponent<RootBlockModel> {
  static override styles = css`
    :host {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: var(--affine-z-index-popover);
      display: block;
      pointer-events: auto;
      font-family: var(--affine-font-family);
      color: var(--affine-text-primary-color);
    }

    :host * {
      box-sizing: border-box;
    }

    .affine-doc-search {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      pointer-events: auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 10px;
      background: var(--affine-background-overlay-panel-color);
      border: 1px solid var(--affine-border-color);
      box-shadow: var(--affine-menu-shadow);
      backdrop-filter: blur(6px);
    }

    .header input {
      width: 180px;
      min-width: 140px;
      height: 26px;
      padding: 2px 4px;
      border: none;
      background: transparent;
      color: var(--affine-text-primary-color);
      font-size: var(--affine-font-sm);
      outline: none;
    }

    .header input::placeholder {
      color: var(--affine-placeholder-color);
    }

    .meta {
      font-size: var(--affine-font-xs);
      color: var(--affine-text-secondary-color);
      letter-spacing: 0.02em;
      min-width: 32px;
      text-align: center;
    }

    .header button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--affine-text-secondary-color);
      cursor: pointer;
      padding: 0;
    }

    .header button:hover {
      background: var(--affine-hover-color);
      color: var(--affine-text-primary-color);
    }

    .header button:active {
      background: color-mix(in srgb, var(--affine-hover-color), #000000 10%);
    }

    .results {
      width: 280px;
      max-height: 240px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px;
      border-radius: 12px;
      background: var(--affine-background-overlay-panel-color);
      border: 1px solid var(--affine-border-color);
      box-shadow: var(--affine-menu-shadow);
    }

    .result {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px 8px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--affine-text-primary-color);
      cursor: pointer;
    }

    .result:hover {
      background: var(--affine-hover-color);
    }

    .result.active {
      background: color-mix(in srgb, var(--affine-hover-color), #000000 12%);
    }

    .result .type {
      font-size: var(--affine-font-xs);
      color: var(--affine-text-secondary-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .result .text {
      font-size: var(--affine-font-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  private readonly _query$ = signal('');

  private readonly _matches$ = signal<DocSearchMatch[]>([]);

  private readonly _activeIndex$ = signal(0);

  private readonly _caseSensitive$ = signal(false);

  private readonly _open$ = signal(false);

  private readonly _hasResults$ = computed(() => this._matches$.value.length > 0);

  @query('input')
  accessor _input!: HTMLInputElement;

  override connectedCallback() {
    super.connectedCallback();

    this.setAttribute(RANGE_SYNC_EXCLUDE_ATTR, 'true');

    this.bindHotKey({
      'Mod-f': () => {
        this.open();
        return true;
      },
      Enter: () => {
        if (!this._open$.value) return false;
        this.gotoNext();
        return true;
      },
      'Shift-Enter': () => {
        if (!this._open$.value) return false;
        this.gotoPrev();
        return true;
      },
      Escape: () => {
        if (!this._open$.value) return false;
        this.close();
        return true;
      },
    });
  }

  override disconnectedCallback() {
    this.clearHighlight();
    super.disconnectedCallback();
  }

  open() {
    this._open$.value = true;
    this.requestUpdate();
    queueMicrotask(() => {
      this._input?.focus();
      this._input?.select();
    });
  }

  close() {
    this._open$.value = false;
    this.clearHighlight();
    this.requestUpdate();
  }


  toggleCaseSensitive() {
    this._caseSensitive$.value = !this._caseSensitive$.value;
    this.runSearch();
  }

  private _updateQuery(value: string) {
    this._query$.value = value;
    this.runSearch();
  }

  private _stopPropagation(event: Event) {
    event.stopPropagation();
    if ('stopImmediatePropagation' in event) {
      (event as Event & { stopImmediatePropagation: () => void })
        .stopImmediatePropagation();
    }
  }

  private _preventFocusLoss(event: Event) {
    event.preventDefault();
    this._stopPropagation(event);
  }

  private _refocusInput() {
    if (!this._open$.value) return;
    queueMicrotask(() => {
      if (!this._open$.value) return;
      this._input?.focus({ preventScroll: true });
    });
  }

  private _resetActiveIndex() {
    this._activeIndex$.value = 0;
  }

  private _setMatches(matches: DocSearchMatch[]) {
    this._matches$.value = matches;
    this._resetActiveIndex();
  }

  private _normalize(text: string) {
    return this._caseSensitive$.value ? text : text.toLowerCase();
  }

  private _collectMatches(): DocSearchMatch[] {
    const query = this._query$.value.trim();
    if (!query) return [];

    const root = this.store.root as BlockModel | null;
    if (!root) return [];

    const normalizedQuery = this._normalize(query);
    const matches: DocSearchMatch[] = [];

    const stack: BlockModel[] = [root];
    while (stack.length) {
      const current = stack.pop()!;
      if (current.text instanceof Text) {
        const text = current.text.toString().trim().replace(/\s+/g, ' ');
        if (text) {
          const normalizedText = this._normalize(text);
          if (normalizedText.includes(normalizedQuery)) {
            matches.push({
              blockId: current.id,
              blockType: current.flavour,
              text,
            });
          }
        }
      }

      const children = current.children;
      for (let i = children.length - 1; i >= 0; i -= 1) {
        stack.push(children[i]);
      }
    }

    return matches;
  }

  runSearch() {
    this.clearHighlight();
    const matches = this._collectMatches();
    this._setMatches(matches);
    if (matches.length) {
      this.gotoMatch(0);
    }
  }

  gotoMatch(index: number) {
    const matches = this._matches$.value;
    if (!matches.length) return;
    const nextIndex = ((index % matches.length) + matches.length) % matches.length;
    this._activeIndex$.value = nextIndex;
    const active = matches[nextIndex];
    this.highlightMatch(active.blockId);
  }

  gotoNext() {
    if (!this._hasResults$.value) return;
    this.gotoMatch(this._activeIndex$.value + 1);
  }

  gotoPrev() {
    if (!this._hasResults$.value) return;
    this.gotoMatch(this._activeIndex$.value - 1);
  }

  private highlightMatch(blockId: string) {
    const block = this.std.view.getBlock(blockId);
    block?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }

  private clearHighlight() {
    this.std.selection.setGroup('note', []);
  }

  private _renderHeader() {
    if (!this._open$.value) return nothing;
    const total = this._matches$.value.length;
    const index = total ? this._activeIndex$.value + 1 : 0;
    return html`<div class="header" @pointerdown=${this._preventFocusLoss} @mousedown=${this._preventFocusLoss}>
      <input
        type="text"
        .value=${this._query$.value}
        placeholder="搜索"
        ${RANGE_SYNC_EXCLUDE_ATTR}="true"
        @pointerdown=${this._preventFocusLoss}
        @mousedown=${this._preventFocusLoss}
        @click=${this._stopPropagation}
        @keydown=${this._stopPropagation}
        @focus=${this._stopPropagation}
        @focusout=${this._refocusInput}
        @input=${(event: InputEvent) => {
          const target = event.target as HTMLInputElement;
          this._updateQuery(target.value);
        }}
      />
      <div class="meta">${index}/${total}</div>
      <button class="toggle" @click=${() => this.toggleCaseSensitive()}>
        Aa
      </button>
      <button class="nav" @click=${() => this.gotoPrev()}>
        ↑
      </button>
      <button class="nav" @click=${() => this.gotoNext()}>
        ↓
      </button>
      <button class="close" @click=${() => this.close()}>
        ×
      </button>
    </div>`;
  }

  private _renderResults() {
    if (!this._open$.value || !this._matches$.value.length) return nothing;
    return html`<div class="results">
      ${repeat(
        this._matches$.value,
        match => match.blockId,
        (match, index) => {
          const active = index === this._activeIndex$.value;
          return html`<button
            class=${active ? 'result active' : 'result'}
            @click=${() => this.gotoMatch(index)}
          >
            <span class="type">${match.blockType}</span>
            <span class="text">${match.text}</span>
          </button>`;
        }
      )}
    </div>`;
  }

  override render() {
    return html`<div
      class="affine-doc-search"
      data-open=${this._open$.value ? 'true' : 'false'}
    >
      ${this._renderHeader()} ${this._renderResults()}
    </div>`;
  }
}
