import type { ChronChangeBlockModel, ChronChangeOp } from '@blocksuite/affine-model';
import { BlockComponent } from '@blocksuite/std';
import { css, html, nothing } from 'lit';

function findIndexById(children: readonly any[], id: string): number {
  return children.findIndex(c => String(c?.id) === String(id));
}

export class ChronChangeBlockComponent extends BlockComponent<ChronChangeBlockModel> {
  static override styles = css`
    :host {
      display: block;
      margin: 6px 0;
    }

    .chron-change {
      position: relative;
      border-radius: 0;
      border: none;
      overflow: visible;
      background: transparent;
    }

    .chron-change[data-op='create'] {
      --chron-change-bg: var(--chron-change-add-bg, rgba(46, 160, 67, 0.10));
    }
    .chron-change[data-op='delete'] {
      --chron-change-bg: var(--chron-change-del-bg, rgba(248, 81, 73, 0.10));
    }
    .chron-change[data-op='update'] {
      --chron-change-before-bg: var(--chron-change-del-bg, rgba(248, 81, 73, 0.10));
      --chron-change-after-bg: var(--chron-change-add-bg, rgba(46, 160, 67, 0.10));
    }

    :host-context([data-theme='dark']) .chron-change {
      --chron-change-border: rgba(255, 255, 255, 0.14);
    }

    :host-context([data-theme='dark']) .chron-change[data-op='create'] {
      --chron-change-add-bg: rgba(46, 160, 67, 0.22);
    }
    :host-context([data-theme='dark']) .chron-change[data-op='delete'] {
      --chron-change-del-bg: rgba(248, 81, 73, 0.20);
    }

    .chron-change__actions {
      position: absolute;
      right: 12px;
      bottom: 10px;
      display: flex;
      gap: 4px;
      align-items: center;
      background: transparent;
      border: none;
      box-shadow: none;
      z-index: 10;
      pointer-events: auto;
    }

    button.chron-change__btn {
      appearance: none;
      -webkit-appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 28px;
      padding: 0;
      border-radius: 8px;
      box-sizing: border-box;
      border: none;
      background: rgba(0, 0, 0, 0.06);
      font-size: 12px;
      line-height: 1;
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.78);
      outline: none;
    }

    button.chron-change__btn:hover {
      background: rgba(0, 0, 0, 0.10);
    }

    :host-context([data-theme='dark']) button.chron-change__btn {
      background: rgba(255, 255, 255, 0.10);
      color: rgba(255, 255, 255, 0.92);
    }
    :host-context([data-theme='dark']) button.chron-change__btn:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    button.chron-change__btn.keep {
      border: none;
      background: rgba(46, 160, 67, 0.86);
      color: rgba(255, 255, 255, 0.96);
    }
    button.chron-change__btn.keep:hover {
      background: rgba(46, 160, 67, 0.94);
    }

    :host-context([data-theme='dark']) button.chron-change__btn.keep {
      border: none;
      background: rgba(46, 160, 67, 0.72);
      color: rgba(255, 255, 255, 0.96);
    }
    :host-context([data-theme='dark']) button.chron-change__btn.keep:hover {
      background: rgba(46, 160, 67, 0.82);
    }

    .chron-change__body {
      padding: 0;
    }

    .chron-change__deleted {
      opacity: 0.78;
      text-decoration: line-through;
    }

    .chron-change__stack {
      display: grid;
      gap: 0px;
    }

    .chron-change__pane {
      padding: 10px 12px;
    }

    .chron-change__pane.before {
      background: var(--chron-change-before-bg, var(--chron-change-del-bg, rgba(248, 81, 73, 0.10)));
      border-radius: 0;
    }

    .chron-change__pane.after {
      background: var(--chron-change-after-bg, var(--chron-change-add-bg, rgba(46, 160, 67, 0.10)));
      border-radius: 0;
    }

    :host-context([data-theme='dark']) .chron-change__pane.before {
      background: rgba(248, 81, 73, 0.10);
    }
    :host-context([data-theme='dark']) .chron-change__pane.after {
      background: rgba(46, 160, 67, 0.12);
    }
  `;

  private _op(): ChronChangeOp {
    return (this.model.props.op$.value ?? 'update') as ChronChangeOp;
  }

  private _status(): 'pending' | 'accepted' | 'rejected' {
    return (this.model.props.status$.value ?? 'pending') as any;
  }

  private _resolveOldId(): string {
    const explicit = String(this.model.props.oldBlockId$.value ?? '').trim();
    if (explicit) return explicit;
    const first = this.model.children?.[0];
    return first?.id ? String(first.id) : '';
  }

  private _resolveNewId(): string {
    const explicit = String(this.model.props.newBlockId$.value ?? '').trim();
    if (explicit) return explicit;
    const second = this.model.children?.[1] ?? this.model.children?.[0];
    return second?.id ? String(second.id) : '';
  }

  private _getAfterChildren(oldId: string): any[] {
    const children = this.model.children ?? [];
    if (!children.length) return [];
    if (!oldId) return children.slice();
    return children.filter(c => String(c?.id) !== String(oldId));
  }

  private _accept = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (this.store.readonly$.value) return;

    const op = this._op();
    const parent = this.store.getParent(this.model);
    if (!parent) return;

    const oldId = this._resolveOldId();
    const newId = this._resolveNewId();

    if (op === 'delete') {
      // Accept deletion: remove wrapper (and its deleted child).
      this.store.deleteBlock(this.model, { deleteChildren: true });
      return;
    }

    if (op === 'create') {
      const afterModels = this._getAfterChildren('').map(c => this.store.getModelById?.(String(c.id))).filter(Boolean);
      if (afterModels.length) this.store.moveBlocks(afterModels as any, parent, this.model, true);
      this.store.deleteBlock(this.model, { deleteChildren: true });
      return;
    }

    // update
    const afterModels = this._getAfterChildren(oldId).map(c => this.store.getModelById?.(String(c.id))).filter(Boolean);
    if (afterModels.length) this.store.moveBlocks(afterModels as any, parent, this.model, true);
    this.store.deleteBlock(this.model, { deleteChildren: true });
  };

  private _reject = (e?: Event) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (this.store.readonly$.value) return;

    const op = this._op();
    const parent = this.store.getParent(this.model);
    if (!parent) return;

    const oldId = this._resolveOldId();
    const newId = this._resolveNewId();

    if (op === 'create') {
      // Reject creation: remove wrapper (and its added child).
      this.store.deleteBlock(this.model, { deleteChildren: true });
      return;
    }

    if (op === 'delete') {
      // Reject deletion: restore old child at wrapper position.
      const oldModel = oldId ? this.store.getModelById?.(oldId) : null;
      if (oldModel) {
        this.store.moveBlocks([oldModel], parent, this.model, true);
      }
      this.store.deleteBlock(this.model, { deleteChildren: true });
      return;
    }

    // Reject update: keep old, discard new.
    const oldModel = oldId ? this.store.getModelById?.(oldId) : null;
    if (oldModel) {
      this.store.moveBlocks([oldModel], parent, this.model, true);
    }
    this.store.deleteBlock(this.model, { deleteChildren: true });
  };

  override renderBlock() {
    const op = this._op();
    const status = this._status();
    const isPending = status === 'pending';

    const oldId = this._resolveOldId();
    const actionsVisible = isPending && !this.store.readonly$.value;

    const actions = html`
      <div
        class="chron-change__actions"
        contenteditable="false"
        @pointerdown=${(e: PointerEvent) => e.stopPropagation()}
        @mousedown=${(e: MouseEvent) => e.stopPropagation()}
      >
        <button type="button" class="chron-change__btn" @click=${this._reject}>拒绝</button>
        <button type="button" class="chron-change__btn keep" @click=${this._accept}>接受</button>
      </div>
    `;

    if (op === 'delete') {
      return html`
        <div class="chron-change" data-op=${op} data-status=${status}>
          <div class="chron-change__body chron-change__deleted" style=${`background:${'var(--chron-change-bg)'}`}>
            ${this.renderChildren(this.model, child => {
              if (!oldId) return true;
              return String(child.id) === String(oldId);
            })}
          </div>
          ${actionsVisible ? actions : nothing}
        </div>
      `;
    }

    if (op === 'create') {
      return html`
        <div class="chron-change" data-op=${op} data-status=${status}>
          <div class="chron-change__body" style=${`background:${'var(--chron-change-bg)'}`}>
            ${this.renderChildren(this.model)}
          </div>
          ${actionsVisible ? actions : nothing}
        </div>
      `;
    }

    // update
    const children = this.model.children ?? [];
    const oldIndex = oldId ? findIndexById(children, oldId) : 0;
    const hasOld = oldIndex >= 0;
    const afterChildren = this._getAfterChildren(oldId);
    const hasNew = afterChildren.length > 0;

    return html`
      <div class="chron-change" data-op=${op} data-status=${status}>
        <div class="chron-change__body chron-change__stack">
          ${hasOld
            ? html`
                <div class="chron-change__pane before chron-change__deleted">
                  ${this.renderChildren(this.model, child => String(child.id) === String(oldId))}
                </div>
              `
            : nothing}
          ${hasNew
            ? html`
                <div class="chron-change__pane after">
                  ${this.renderChildren(this.model, child => {
                    if (!oldId) return true;
                    return String(child.id) !== String(oldId);
                  })}
                </div>
              `
            : nothing}
        </div>
        ${actionsVisible ? actions : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chron-change-block': ChronChangeBlockComponent;
  }
}
