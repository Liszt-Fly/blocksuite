import {
  AFFINE_SCROLL_ANCHORING_WIDGET,
  AffineScrollAnchoringWidget,
} from './scroll-anchoring.js';

export function effects() {
  if (!customElements.get(AFFINE_SCROLL_ANCHORING_WIDGET)) {
    customElements.define(
      AFFINE_SCROLL_ANCHORING_WIDGET,
      AffineScrollAnchoringWidget
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AFFINE_SCROLL_ANCHORING_WIDGET]: AffineScrollAnchoringWidget;
  }
}
