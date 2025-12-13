import {
  AFFINE_VIEWPORT_OVERLAY_WIDGET,
  AffineViewportOverlayWidget,
} from './index';

export function effects() {
  if (!customElements.get(AFFINE_VIEWPORT_OVERLAY_WIDGET)) {
    customElements.define(
      AFFINE_VIEWPORT_OVERLAY_WIDGET,
      AffineViewportOverlayWidget
    );
  }
}
