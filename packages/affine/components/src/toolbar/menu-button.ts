import { scrollbarStyle } from '@blocksuite/affine-shared/styles';
import {
  type ButtonPopperOptions,
  createButtonPopper,
} from '@blocksuite/affine-shared/utils';
import { WithDisposable } from '@blocksuite/global/lit';
import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property, query } from 'lit/decorators.js';

import type { EditorIconButton } from './icon-button.js';

export class EditorMenuButton extends WithDisposable(LitElement) {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  `;

  private _popper: ReturnType<typeof createButtonPopper> | null = null;
  private _triggerClickHandler: ((e: MouseEvent) => void) | null = null;

  private _bindTriggerClick() {
    if (!this._trigger || this._triggerClickHandler) return;
    
    this._triggerClickHandler = (e: MouseEvent) => {
      e.stopPropagation();
      this._popper?.toggle();
    };
    
    this._trigger.addEventListener('click', this._triggerClickHandler);
  }
  
  private _unbindTriggerClick() {
    if (this._trigger && this._triggerClickHandler) {
      this._trigger.removeEventListener('click', this._triggerClickHandler);
    }
    this._triggerClickHandler = null;
  }

  private _updatePopper() {
    this._popper?.dispose();
    
    // 确保 trigger 和 content 元素存在
    if (!this._trigger || !this._content) {
      return;
    }
    
    this._popper = createButtonPopper({
      reference: this._trigger,
      popperElement: this._content,
      hostElement: this,  // 传递宿主元素，用于检查监听器是否仍然有效
      stateUpdated: ({ display }) => {
        const opened = display === 'show';
        if (this._trigger) {
          this._trigger.showTooltip = !opened;
        }
        this.dispatchEvent(
          new CustomEvent('toggle', {
            detail: opened,
            bubbles: false,
            cancelable: false,
            composed: true,
          })
        );

        if (opened) {
          this.dataset.open = 'true';
        } else {
          delete this.dataset.open;
        }
      },
      mainAxis: 0,
      offsetHeight: 6 * 4,
      ...this.popperOptions,
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    // 当组件重新连接到 DOM 时，确保 popper 状态正确
    // 这处理了组件被复用但 popper 状态过时的情况
    if (this.hasUpdated && !this._popper) {
      this.updateComplete.then(() => {
        this._updatePopper();
        this._bindTriggerClick();
      });
    }
  }

  override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('contentPadding')) {
      this.style.setProperty('--content-padding', this.contentPadding ?? '');
    }

    if (this.hasUpdated && changedProperties.has('popperOptions')) {
      this._updatePopper();
    }
  }

  override firstUpdated() {
    this._updatePopper();
    this._disposables.addFromEvent(this, 'keydown', (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        this._popper?.hide();
      }
    });
    
    // 绑定点击事件
    this._bindTriggerClick();
    
    this._disposables.add(() => {
      this._popper?.dispose();
      this._unbindTriggerClick();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // 确保 popper 及其事件监听器被正确清理，避免文档切换后监听器泄漏
    this._unbindTriggerClick();
    this._popper?.dispose();
    this._popper = null;
  }

  hide() {
    this._popper?.hide();
  }

  override render() {
    return html`
      ${this.button}
      <editor-menu-content role="menu" tabindex="-1">
        <slot></slot>
      </editor-menu-content>
    `;
  }

  show(force = false) {
    this._popper?.show(force);
  }

  @query('editor-menu-content')
  private accessor _content!: EditorMenuContent;

  @query('editor-icon-button')
  private accessor _trigger!: EditorIconButton;

  @property({ attribute: false })
  accessor button!: TemplateResult;

  @property({ attribute: false })
  accessor contentPadding: string | undefined = undefined;

  @property({ attribute: false })
  accessor popperOptions: Partial<ButtonPopperOptions> = {};
}

export class EditorMenuContent extends LitElement {
  static override styles = css`
    :host {
      display: none;
      outline: none;
      z-index: 50;
    }

    :host([data-show]) {
      display: block;
      transform-origin: top center;
      animation: dropdown-menu-in 120ms ease-out;
    }

    @keyframes dropdown-menu-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    ${scrollbarStyle('.content-wrapper')}
    .content-wrapper {
      width: max-content;
      min-width: 0;
      scrollbar-gutter: auto;
      overscroll-behavior: contain;
      overflow: hidden;
      overflow-y: auto;
      padding: var(--content-padding, 4px);
      border-radius: 6px;
      border: 0.5px solid var(--affine-border-color);
      background: var(--affine-background-overlay-panel-color);
      color: var(--affine-text-primary-color);
      box-shadow: var(--affine-overlay-shadow);
      font-size: 12px;
    }

    ::slotted(:not(.custom)) {
      display: flex;
      align-items: center;
      min-height: fit-content;
    }

    ::slotted([data-orientation='vertical']) {
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      gap: unset;
      min-height: fit-content;
    }

    ::slotted(editor-toolbar-separator[data-orientation='horizontal']) {
      align-self: stretch;
      width: 100%;
    }
  `;

  override render() {
    return html`<div class="content-wrapper"><slot></slot></div>`;
  }
}

export class EditorMenuAction extends LitElement {
  static override styles = css`
    :host {
      position: relative;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;
      box-sizing: border-box;
      padding: 6px 8px;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      gap: 8px;
      color: var(--affine-text-primary-color);
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      min-height: 28px;
      user-select: none;
      outline: none;
      transition: background-color 120ms ease, color 120ms ease;
    }

    :host(:hover),
    :host(:focus-visible),
    :host([data-selected]) {
      background-color: var(--affine-background-tertiary-color);
      color: var(--affine-text-primary-color);
    }

    :host([data-selected]) {
      pointer-events: none;
    }

    :host(:hover.delete),
    :host(:focus-visible.delete),
    :host(:hover.delete) ::slotted(svg),
    :host(:hover.delete) ::slotted(iconify-icon),
    :host(:focus-visible.delete) ::slotted(svg),
    :host(:focus-visible.delete) ::slotted(iconify-icon) {
      background-color: var(--affine-background-error-color);
      color: var(--affine-error-color);
    }

    :host([disabled]) {
      pointer-events: none;
      cursor: not-allowed;
      color: var(--affine-text-disable-color);
    }

    ::slotted(svg) {
      color: currentColor;
      font-size: var(--editor-menu-action-icon-size, 16px);
    }

    ::slotted(iconify-icon) {
      color: currentColor;
      font-size: var(--editor-menu-action-icon-size, 16px);
      width: 1em;
      height: 1em;
    }

    ::slotted(.label) {
      color: inherit !important;
    }
    ::slotted(.label.capitalize) {
      text-transform: capitalize !important;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.role = 'button';
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editor-menu-button': EditorMenuButton;
    'editor-menu-content': EditorMenuContent;
    'editor-menu-action': EditorMenuAction;
  }
}
