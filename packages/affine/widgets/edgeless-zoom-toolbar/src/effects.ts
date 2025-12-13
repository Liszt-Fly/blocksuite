import {
  AFFINE_EDGELESS_ZOOM_TOOLBAR_WIDGET,
  AffineEdgelessZoomToolbarWidget,
} from '.';
import { ZoomBarToggleButton } from './zoom-bar-toggle-button';
import { EdgelessZoomToolbar } from './zoom-toolbar';

export function effects() {
  if (!customElements.get('edgeless-zoom-toolbar')) {
    customElements.define('edgeless-zoom-toolbar', EdgelessZoomToolbar);
  }
  if (!customElements.get('zoom-bar-toggle-button')) {
    customElements.define('zoom-bar-toggle-button', ZoomBarToggleButton);
  }
  if (!customElements.get(AFFINE_EDGELESS_ZOOM_TOOLBAR_WIDGET)) {
    customElements.define(
      AFFINE_EDGELESS_ZOOM_TOOLBAR_WIDGET,
      AffineEdgelessZoomToolbarWidget
    );
  }
}
