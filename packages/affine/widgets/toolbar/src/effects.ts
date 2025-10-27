import { AFFINE_TOOLBAR_WIDGET, AffineToolbarWidget } from './toolbar';

export function effects() {
  if (!customElements.get(AFFINE_TOOLBAR_WIDGET)) {
    customElements.define(AFFINE_TOOLBAR_WIDGET, AffineToolbarWidget);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AFFINE_TOOLBAR_WIDGET]: AffineToolbarWidget;
  }
}
