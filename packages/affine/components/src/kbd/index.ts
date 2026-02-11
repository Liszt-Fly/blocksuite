import { css, html, LitElement } from 'lit';

export class ChronKbd extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      pointer-events: none;
    }

    .kbd {
      box-sizing: border-box;
      pointer-events: none;
      user-select: none;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: fit-content;
      min-width: 24px;
      height: 24px;

      padding: 0 6px;
      border-radius: 6px;
      border: 1px solid var(--base-border, rgba(0, 0, 0, 0.08));
      background: var(--base-50, rgba(0, 0, 0, 0.04));
      color: var(--base-600, rgba(0, 0, 0, 0.6));
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);

      font-family:
        var(--chronnote-ui-font),
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }

    ::slotted(svg) {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }
  `;

  override render() {
    return html`<kbd class="kbd"><slot></slot></kbd>`;
  }
}

export class ChronKbdGroup extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

export function effects() {
  if (!customElements.get('chron-kbd')) {
    customElements.define('chron-kbd', ChronKbd);
  }
  if (!customElements.get('chron-kbd-group')) {
    customElements.define('chron-kbd-group', ChronKbdGroup);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chron-kbd': ChronKbd;
    'chron-kbd-group': ChronKbdGroup;
  }
}
