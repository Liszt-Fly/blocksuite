import {
  EDGELESS_DRAGGING_AREA_WIDGET,
  EdgelessDraggingAreaRectWidget,
} from './edgeless-dragging-area-rect';

export function effects() {
  if (!customElements.get(EDGELESS_DRAGGING_AREA_WIDGET)) {
    customElements.define(
      EDGELESS_DRAGGING_AREA_WIDGET,
      EdgelessDraggingAreaRectWidget
    );
  }
}
