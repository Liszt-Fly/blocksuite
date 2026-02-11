import { CHRON_TOOLBAR_WIDGET, ChronToolbarWidget } from './toolbar';

export function effects() {
  if (!customElements.get(CHRON_TOOLBAR_WIDGET)) {
    customElements.define(CHRON_TOOLBAR_WIDGET, ChronToolbarWidget);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CHRON_TOOLBAR_WIDGET]: ChronToolbarWidget;
  }
}
