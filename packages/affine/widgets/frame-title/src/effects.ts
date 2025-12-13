import {
  AFFINE_FRAME_TITLE_WIDGET,
  AffineFrameTitleWidget,
} from './affine-frame-title-widget.js';
import { EdgelessFrameTitleEditor } from './edgeless-frame-title-editor.js';
import { AFFINE_FRAME_TITLE, AffineFrameTitle } from './frame-title.js';

export function effects() {
  if (!customElements.get(AFFINE_FRAME_TITLE_WIDGET)) {
    customElements.define(AFFINE_FRAME_TITLE_WIDGET, AffineFrameTitleWidget);
  }
  if (!customElements.get(AFFINE_FRAME_TITLE)) {
    customElements.define(AFFINE_FRAME_TITLE, AffineFrameTitle);
  }
  if (!customElements.get('edgeless-frame-title-editor')) {
    customElements.define(
      'edgeless-frame-title-editor',
      EdgelessFrameTitleEditor
    );
  }
}
