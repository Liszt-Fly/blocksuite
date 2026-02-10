import type { ChronChangeBlockModel, ChronChangeOp } from '@blocksuite/affine-model';
import { WidgetComponent, WidgetViewExtension } from '@blocksuite/std';
import { css, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { literal, unsafeStatic } from 'lit/static-html.js';

export const CHRON_DIFF_NAVIGATOR_WIDGET = 'chron-diff-navigator-widget';

function findNoteRoot(root: any): any | null {
  if (!root) return null;
  const stack: any[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (node.flavour === 'affine:note') return node;
    // avoid descending into surface subtree
    if (node.flavour === 'affine:surface') continue;
    const children = Array.isArray(node.children) ? node.children : [];
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
  return null;
}

function collectPendingChangeModels(noteRoot: any): ChronChangeBlockModel[] {
  const result: ChronChangeBlockModel[] = [];
  const stack: any[] = [noteRoot];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    const children = Array.isArray(node.children) ? node.children : [];
    if (node.flavour === 'chron:change') {
      const status = String((node as any).props?.status ?? '').trim();
      if (status === 'pending') result.push(node as ChronChangeBlockModel);
    }
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
  return result;
}

function findIndexById(children: readonly any[], id: string): number {
  return children.findIndex(c => String(c?.id) === String(id));
}

function resolveOldId(model: any): string {
  const explicit = String(model?.props?.oldBlockId ?? '').trim();
  if (explicit) return explicit;
  const first = model?.children?.[0];
  return first?.id ? String(first.id) : '';
}

function resolveNewId(model: any): string {
  const explicit = String(model?.props?.newBlockId ?? '').trim();
  if (explicit) return explicit;
  const second = model?.children?.[1] ?? model?.children?.[0];
  return second?.id ? String(second.id) : '';
}

function getAfterChildren(model: any, oldId: string): any[] {
  const children = Array.isArray(model?.children) ? model.children : [];
  if (!children.length) return [];
  if (!oldId) return children.slice();
  return children.filter(c => String(c?.id) !== String(oldId));
}

function acceptChange(store: any, model: ChronChangeBlockModel) {
  const op = String((model as any).props?.op ?? 'update') as ChronChangeOp;
  const parent = store.getParent(model);
  if (!parent) return;

  const oldId = resolveOldId(model);

  if (op === 'delete') {
    store.deleteBlock(model, { deleteChildren: true });
    return;
  }

  if (op === 'create') {
    const afterModels = getAfterChildren(model, '').map((c: any) => store.getModelById?.(String(c.id))).filter(Boolean);
    if (afterModels.length) store.moveBlocks(afterModels as any, parent, model, true);
    store.deleteBlock(model, { deleteChildren: true });
    return;
  }

  const afterModels = getAfterChildren(model, oldId).map((c: any) => store.getModelById?.(String(c.id))).filter(Boolean);
  if (afterModels.length) store.moveBlocks(afterModels as any, parent, model, true);
  store.deleteBlock(model, { deleteChildren: true });
}

function rejectChange(store: any, model: ChronChangeBlockModel) {
  const op = String((model as any).props?.op ?? 'update') as ChronChangeOp;
  const parent = store.getParent(model);
  if (!parent) return;

  const oldId = resolveOldId(model);

  if (op === 'create') {
    store.deleteBlock(model, { deleteChildren: true });
    return;
  }

  if (op === 'delete') {
    const oldModel = oldId ? store.getModelById?.(oldId) : null;
    if (oldModel) store.moveBlocks([oldModel], parent, model, true);
    store.deleteBlock(model, { deleteChildren: true });
    return;
  }

  // update: keep old, discard new
  const oldModel = oldId ? store.getModelById?.(oldId) : null;
  if (oldModel) store.moveBlocks([oldModel], parent, model, true);
  store.deleteBlock(model, { deleteChildren: true });
}

export class ChronDiffNavigatorWidget extends WidgetComponent {
  static override styles = css`
    .chron-diff-nav {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: var(--affine-z-index-popover);
      pointer-events: auto;
    }

    .chron-diff-nav__pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(0, 0, 0, 0.10);
      border-radius: 10px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
    }

    :host-context([data-theme='dark']) .chron-diff-nav__pill {
      background: rgba(20, 20, 20, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.40);
    }

    .chron-diff-nav__count {
      font-size: 12px;
      line-height: 1;
      padding: 0 6px;
      color: rgba(0, 0, 0, 0.62);
      user-select: none;
      min-width: 44px;
      text-align: center;
    }

    :host-context([data-theme='dark']) .chron-diff-nav__count {
      color: rgba(255, 255, 255, 0.72);
    }

    button.chron-diff-nav__btn {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      background: rgba(0, 0, 0, 0.06);
      color: rgba(0, 0, 0, 0.78);
      width: 60px;
      height: 28px;
      border-radius: 8px;
      padding: 0;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      user-select: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    button.chron-diff-nav__btn:hover {
      background: rgba(0, 0, 0, 0.10);
    }

    :host-context([data-theme='dark']) button.chron-diff-nav__btn {
      background: rgba(255, 255, 255, 0.10);
      color: rgba(255, 255, 255, 0.92);
    }

    :host-context([data-theme='dark']) button.chron-diff-nav__btn:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    button.chron-diff-nav__btn.keep {
      background: rgba(46, 160, 67, 0.86);
      color: rgba(255, 255, 255, 0.96);
    }

    button.chron-diff-nav__btn.keep:hover {
      background: rgba(46, 160, 67, 0.94);
    }

    :host-context([data-theme='dark']) button.chron-diff-nav__btn.keep {
      background: rgba(46, 160, 67, 0.72);
      color: rgba(255, 255, 255, 0.96);
    }

    :host-context([data-theme='dark']) button.chron-diff-nav__btn.keep:hover {
      background: rgba(46, 160, 67, 0.82);
    }
  `;

  @state()
  private accessor _pendingIds: string[] = [];

  @state()
  private accessor _activeIndex = 0;

  private _activeId: string | null = null;

  private _refreshFrame: number | null = null;

  private _scheduleRefresh() {
    if (this._refreshFrame !== null) return;
    this._refreshFrame = requestAnimationFrame(() => {
      this._refreshFrame = null;
      if (!this.isConnected) return;
      this._refresh();
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    this._disposables.add(
      this.store.slots.blockUpdated.subscribe(payload => {
        if (payload.flavour !== 'chron:change') return;
        this._scheduleRefresh();
      })
    );

    this._refresh();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    if (this._refreshFrame !== null) {
      cancelAnimationFrame(this._refreshFrame);
      this._refreshFrame = null;
    }
  }

  private _refresh() {
    const root = this.store.root;
    const noteRoot = findNoteRoot(root);
    if (!noteRoot) {
      this._pendingIds = [];
      this._activeIndex = 0;
      this._setActiveHighlight(null);
      return;
    }

    const pending = collectPendingChangeModels(noteRoot).map(m => String(m.id));
    const prevActiveId = this._pendingIds[this._activeIndex] ?? null;
    this._pendingIds = pending;

    if (!pending.length) {
      this._activeIndex = 0;
      this._setActiveHighlight(null);
      return;
    }

    if (prevActiveId && pending.includes(prevActiveId)) {
      this._activeIndex = pending.indexOf(prevActiveId);
    } else {
      this._activeIndex = Math.min(this._activeIndex, pending.length - 1);
    }

    const nextActiveId = pending[this._activeIndex] ?? null;
    this._setActiveHighlight(nextActiveId);
  }

  private _setActiveHighlight(id: string | null) {
    const prev = this._activeId;
    if (prev && prev !== id) {
      const prevEl = this.host.querySelector<HTMLElement>(`[data-block-id="${prev}"]`);
      prevEl?.removeAttribute('data-chron-diff-active');
    }
    this._activeId = id;
    if (id) {
      const el = this.host.querySelector<HTMLElement>(`[data-block-id="${id}"]`);
      el?.setAttribute('data-chron-diff-active', 'true');
    }
  }

  private _scrollToActive(behavior: ScrollBehavior = 'smooth') {
    const id = this._pendingIds[this._activeIndex];
    if (!id) return;
    const el = this.host.querySelector<HTMLElement>(`[data-block-id="${id}"]`);
    el?.scrollIntoView({ block: 'center', behavior });
  }

  private _prev = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!this._pendingIds.length) return;
    this._activeIndex = (this._activeIndex - 1 + this._pendingIds.length) % this._pendingIds.length;
    this._setActiveHighlight(this._pendingIds[this._activeIndex] ?? null);
    this._scrollToActive();
  };

  private _next = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!this._pendingIds.length) return;
    this._activeIndex = (this._activeIndex + 1) % this._pendingIds.length;
    this._setActiveHighlight(this._pendingIds[this._activeIndex] ?? null);
    this._scrollToActive();
  };

  private _reject = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (this.store.readonly$.value) return;
    const id = this._pendingIds[this._activeIndex];
    if (!id) return;
    const model = this.store.getModelById?.(id) as ChronChangeBlockModel | null;
    if (!model || String((model as any).flavour) !== 'chron:change') return;
    rejectChange(this.store, model);
    this._refresh();
    this._scrollToActive();
  };

  private _accept = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (this.store.readonly$.value) return;
    const id = this._pendingIds[this._activeIndex];
    if (!id) return;
    const model = this.store.getModelById?.(id) as ChronChangeBlockModel | null;
    if (!model || String((model as any).flavour) !== 'chron:change') return;
    acceptChange(this.store, model);
    this._refresh();
    this._scrollToActive();
  };

  override render() {
    if (this.store.readonly$.value) return nothing;
    const total = this._pendingIds.length;
    if (!total) return nothing;

    const current = Math.min(this._activeIndex + 1, total);
    return html`
      <div
        class="chron-diff-nav"
        contenteditable="false"
        @pointerdown=${(e: PointerEvent) => e.stopPropagation()}
        @mousedown=${(e: MouseEvent) => e.stopPropagation()}
      >
        <div class="chron-diff-nav__pill">
          <button type="button" class="chron-diff-nav__btn" @click=${this._prev}>上一处</button>
          <div class="chron-diff-nav__count">${current} / ${total}</div>
          <button type="button" class="chron-diff-nav__btn" @click=${this._next}>下一处</button>
          <button type="button" class="chron-diff-nav__btn" @click=${this._reject}>拒绝</button>
          <button type="button" class="chron-diff-nav__btn keep" @click=${this._accept}>接受</button>
        </div>
      </div>
    `;
  }
}

export const chronDiffNavigatorWidget = WidgetViewExtension(
  'affine:page',
  CHRON_DIFF_NAVIGATOR_WIDGET,
  literal`${unsafeStatic(CHRON_DIFF_NAVIGATOR_WIDGET)}`
);

declare global {
  interface HTMLElementTagNameMap {
    [CHRON_DIFF_NAVIGATOR_WIDGET]: ChronDiffNavigatorWidget;
  }
}
