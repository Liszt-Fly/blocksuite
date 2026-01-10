import type { AffineTextStyleAttributes } from '@blocksuite/affine-shared/types';
import { PropTypes, requiredProperties } from '@blocksuite/std';
import { css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';

import { EditorChevronDown } from '../toolbar';
import { t } from '@blocksuite/affine-shared/utils';

const colors = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'grey',
] as const;

const colorFallbackLabel: Record<Exclude<(typeof colors)[number], 'default'>, string> = {
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  teal: 'Teal',
  blue: 'Blue',
  purple: 'Purple',
  grey: 'Grey',
};

export type HighlightType = Pick<
  AffineTextStyleAttributes,
  'color' | 'background'
>;

// TODO(@fundon): these recent settings should be added to the dropdown menu
// tests/blocksutie/e2e/format-bar.spec.ts#253
//
// let latestHighlightColor: string | null = null;
// let latestHighlightType: HighlightType = 'background';

@requiredProperties({
  updateHighlight: PropTypes.instanceOf(Function),
})
export class HighlightDropdownMenu extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      user-select: none;
      --affine-highlight-menu-width: 200px;
    }
    .root {
      display: flex;
      flex-direction: column;
      width: var(--affine-highlight-menu-width);
      padding: 16px 12px 12px 12px;
      gap: 16px;
    }
    .tabs {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding-bottom: 8px;
    }
    .tab {
      position: relative;
      font-size: 13px;
      font-weight: 500;
      color: var(--affine-text-secondary-color);
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.15s ease-out;
      letter-spacing: 0.02em;
    }
    .tab:hover {
      color: var(--affine-text-primary-color);
    }
    .tab.active {
      color: var(--affine-text-primary-color);
      font-weight: 600;
    }
    .tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 2px;
      background-color: var(--affine-text-primary-color);
      border-radius: 1px;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      row-gap: 12px;
      column-gap: 12px;
      justify-items: center;
    }
    .color-item {
      position: relative;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .color-item::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid transparent;
      transition: border-color 0.2s ease;
    }
    .color-item:hover::before {
      border-color: var(--affine-border-color);
    }
    .color-item:active {
      transform: scale(0.92);
    }
    .color-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
    }
    /* Selected state indicator could be added if needed, e.g. a checkmark or ring */
    
    .remove-color {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 6px 0;
      cursor: pointer;
      color: var(--affine-text-secondary-color);
      font-size: 12px;
      gap: 6px;
      opacity: 0.8;
      transition: opacity 0.2s;
      margin-top: 4px;
    }
    .remove-color:hover {
      opacity: 1;
      color: var(--affine-text-primary-color);
    }
    .remove-icon {
        width: 14px;
        height: 14px;
        border: 1px solid currentColor;
        border-radius: 50%;
        position: relative;
    }
    .remove-icon::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        border-top: 1px solid currentColor;
        transform: translate(-50%, -50%) rotate(-45deg);
    } 
  `;

  @property({ attribute: false })
  accessor updateHighlight!: (styles: HighlightType) => void;

  @state()
  accessor activeTab: 'text' | 'background' = 'text';

  private readonly _update = (style: HighlightType) => {
    this.updateHighlight(style);
  };

  override render() {
    const prefix = '--affine-text-highlight';
    const isTextTab = this.activeTab === 'text';

    return html`
      <editor-menu-button
        .contentPadding="${'0'}"
        .button=${html`
          <editor-icon-button aria-label="${t('toolbar.highlight', 'Highlight')}" .tooltip="${t('toolbar.highlight', 'Highlight')}">
            <ph-palette size="16" weight="bold"></ph-palette>
            ${EditorChevronDown}
          </editor-icon-button>
        `}
      >
        <div class="root custom">
          <div class="tabs">
            <div 
              class="tab ${isTextTab ? 'active' : ''}" 
              @click=${(e: MouseEvent) => {
        e.stopPropagation();
        this.activeTab = 'text';
      }}
            >
              ${t('editor.textColor', 'Text')}
            </div>
            <div 
              class="tab ${!isTextTab ? 'active' : ''}" 
              @click=${(e: MouseEvent) => {
        e.stopPropagation();
        this.activeTab = 'background';
      }}
            >
              ${t('editor.backgroundColor', 'Background')}
            </div>
          </div>

          <div class="color-grid">
            ${repeat(colors, color => {
        if (color === 'default') return null; // Handle default/remove separately or differently if desired

        const value = isTextTab
          ? `var(${prefix}-foreground-${color})`
          : `var(${prefix}-${color})`;

        const displayColor = isTextTab
          ? value
          : value;

        return html`
                <div 
                  class="color-item"
                  data-testid="${isTextTab ? 'foreground' : 'background'}-${color}"
                  @click=${() => this._update(isTextTab ? { color: value } : { background: value })}
                  title="${t(`colors.${color}`, colorFallbackLabel[color])}"
                >
                  <div 
                    class="color-circle" 
                    style=${styleMap({
          background: displayColor ?? 'transparent',
        })}
                  ></div>
                </div>
              `;
      })}
          </div>

          <div 
            class="remove-color"
            @click=${() => this._update(isTextTab ? { color: null } : { background: null })}
          >
            <div class="remove-icon"></div>
            <span>${t('toolbar.defaultColor', 'Reset')}</span>
          </div>

        </div>
      </editor-menu-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-highlight-dropdown-menu': HighlightDropdownMenu;
  }
}
