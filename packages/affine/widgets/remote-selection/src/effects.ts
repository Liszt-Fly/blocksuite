import { AFFINE_DOC_REMOTE_SELECTION_WIDGET } from './doc';
import { AffineDocRemoteSelectionWidget } from './doc/doc-remote-selection';
import {
  AFFINE_EDGELESS_REMOTE_SELECTION_WIDGET,
  EdgelessRemoteSelectionWidget,
} from './edgeless';

export function effects() {
  if (!customElements.get(AFFINE_DOC_REMOTE_SELECTION_WIDGET)) {
    customElements.define(
      AFFINE_DOC_REMOTE_SELECTION_WIDGET,
      AffineDocRemoteSelectionWidget
    );
  }
  if (!customElements.get(AFFINE_EDGELESS_REMOTE_SELECTION_WIDGET)) {
    customElements.define(
      AFFINE_EDGELESS_REMOTE_SELECTION_WIDGET,
      EdgelessRemoteSelectionWidget
    );
  }
}
