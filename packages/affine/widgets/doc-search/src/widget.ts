import type { RootBlockModel } from '@blocksuite/affine-model';
import type { BlockModel } from '@blocksuite/store';
import { WidgetComponent } from '@blocksuite/std';
import { RANGE_SYNC_EXCLUDE_ATTR } from '@blocksuite/std/inline';
import { signal } from '@preact/signals-core';
import { css, html, nothing } from 'lit';
import { query } from 'lit/decorators.js';



type DocSearchMatch = {
  blockId: string;
  blockType: string;
  text: string;
};

export class AffineDocSearchWidget extends WidgetComponent<RootBlockModel> {
  static override styles = css`
    :host {
      position: fixed;
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
  `;

  // CSS Highlight API 的高亮名称
  private static readonly HIGHLIGHT_NAME = 'affine-doc-search';

  // 存储当前的 Highlight 对象
  private _highlight: Highlight | null = null;

  private readonly _query$ = signal('');

  private readonly _matches$ = signal<DocSearchMatch[]>([]);

  private readonly _currentIndex$ = signal(0);

  private readonly _caseSensitive$ = signal(false);

  private readonly _open$ = signal(false);

  @query('input')
  accessor _input!: HTMLInputElement;

  override connectedCallback() {
    super.connectedCallback();

    this.setAttribute(RANGE_SYNC_EXCLUDE_ATTR, 'true');

    // 注册 CSS Highlight API 的样式
    this._registerHighlightStyle();

    this.bindHotKey({
      'Mod-f': () => {
        this.open();
        return true;
      },
      Escape: () => {
        if (!this._open$.value) return false;
        this.close();
        return true;
      },
      'Mod-g': () => {
        if (!this._open$.value) return false;
        this.nextMatch();
        return true;
      },
      'Mod-Shift-g': () => {
        if (!this._open$.value) return false;
        this.prevMatch();
        return true;
      },
    });
  }

  override disconnectedCallback() {
    this.clearHighlight();
    this._unregisterHighlightStyle();
    super.disconnectedCallback();
  }

  private _registerHighlightStyle() {
    // 动态添加 ::highlight 伪元素样式
    const styleId = 'affine-doc-search-highlight-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      ::highlight(${AffineDocSearchWidget.HIGHLIGHT_NAME}) {
        background-color: rgba(255, 214, 51, 0.4);
        color: inherit;
      }
    `;
    document.head.appendChild(style);
  }

  private _unregisterHighlightStyle() {
    // 只有在没有其他实例时才移除样式
    // 简单起见，这里不移除，让样式一直存在
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


  private _getTextNodes(root: HTMLElement): Text[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: node => {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes: Text[] = [];
    let current = walker.nextNode();
    while (current) {
      nodes.push(current as Text);
      current = walker.nextNode();
    }
    return nodes;
  }

  private _setMatches(matches: DocSearchMatch[]) {
    this._matches$.value = matches;
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
      // Use duck typing to check for text property instead of instanceof
      // This avoids issues with multiple Text class instances in monorepo
      const textProp = current.text;
      if (textProp && typeof textProp.toString === 'function') {
        const text = textProp.toString().replace(/\s+/g, ' ').trim();
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
    this._currentIndex$.value = 0;
    if (matches.length) {
      this.highlightMatch(matches[0]);
    }
    this.requestUpdate();
  }

  nextMatch() {
    const matches = this._matches$.value;
    if (matches.length === 0) return;
    this.clearHighlight();
    this._currentIndex$.value = (this._currentIndex$.value + 1) % matches.length;
    this.highlightMatch(matches[this._currentIndex$.value]);
    this.requestUpdate();
  }

  prevMatch() {
    const matches = this._matches$.value;
    if (matches.length === 0) return;
    this.clearHighlight();
    this._currentIndex$.value = (this._currentIndex$.value - 1 + matches.length) % matches.length;
    this.highlightMatch(matches[this._currentIndex$.value]);
    this.requestUpdate();
  }


  private highlightMatch(match: DocSearchMatch) {
    const block = this.std.view.getBlock(match.blockId);
    if (!block) return;

    block.scrollIntoView({ behavior: 'instant', block: 'center' });

    // 清除之前的高亮
    this.clearHighlight();

    const query = this._query$.value.trim();
    if (!query) return;

    // 检查浏览器是否支持 CSS Highlight API
    if (!('Highlight' in window) || !CSS.highlights) {
      console.warn('[DocSearch] CSS Highlight API not supported');
      return;
    }

    const normalizedQuery = this._normalize(query);
    const textNodes = this._getTextNodes(block);
    const ranges: Range[] = [];

    for (const node of textNodes) {
      const nodeText = node.nodeValue ?? '';
      const normalizedText = this._normalize(nodeText);
      let startIndex = 0;

      // 找到当前节点中所有匹配的位置
      while (true) {
        const matchIndex = normalizedText.indexOf(normalizedQuery, startIndex);
        if (matchIndex === -1) break;

        const range = document.createRange();
        range.setStart(node, matchIndex);
        range.setEnd(node, matchIndex + query.length);
        ranges.push(range);

        startIndex = matchIndex + 1;
      }
    }

    if (ranges.length > 0) {
      // 使用 CSS Highlight API 创建高亮
      this._highlight = new Highlight(...ranges);
      CSS.highlights.set(AffineDocSearchWidget.HIGHLIGHT_NAME, this._highlight);
    }
  }

  private clearHighlight() {
    if (CSS.highlights) {
      CSS.highlights.delete(AffineDocSearchWidget.HIGHLIGHT_NAME);
    }
    this._highlight = null;
  }

  private _renderHeader() {
    if (!this._open$.value) return nothing;
    const matches = this._matches$.value;
    const total = matches.length;
    const current = total > 0 ? this._currentIndex$.value + 1 : 0;
    const metaText = `${current}/${total}`;

    return html`<div class="header">
      <input
        type="text"
        .value=${this._query$.value}
        placeholder="搜索"
        ${RANGE_SYNC_EXCLUDE_ATTR}="true"
        @keydown=${(event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.close();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          if (event.shiftKey) {
            this.prevMatch();
          } else {
            this.nextMatch();
          }
        }
      }}
        @input=${(event: InputEvent) => {
        const target = event.target as HTMLInputElement;
        this._updateQuery(target.value);
      }}
      />
      <span class="meta">${metaText}</span>
      <button
        class="nav-btn"
        title="上一个 (Shift+Enter)"
        @click=${() => this.prevMatch()}
      >
        ↑
      </button>
      <button
        class="nav-btn"
        title="下一个 (Enter)"
        @click=${() => this.nextMatch()}
      >
        ↓
      </button>
      <button class="close" @click=${() => this.close()}>
        ×
      </button>
    </div>`;
  }

  private _renderResults() {
    return nothing;
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
