import {
  EDGELESS_DND_PREVIEW_ELEMENT,
  EdgelessDndPreviewElement,
} from './components/edgeless-preview/preview';
import { AFFINE_DRAG_HANDLE_WIDGET } from './consts';
import { AffineDragHandleWidget } from './drag-handle';

export function effects() {
  if (!customElements.get(AFFINE_DRAG_HANDLE_WIDGET)) {
    customElements.define(AFFINE_DRAG_HANDLE_WIDGET, AffineDragHandleWidget);
  }
  if (!customElements.get(EDGELESS_DND_PREVIEW_ELEMENT)) {
    customElements.define(
      EDGELESS_DND_PREVIEW_ELEMENT,
      EdgelessDndPreviewElement
    );
  }
}
