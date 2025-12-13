import {
  AFFINE_PAGE_DRAGGING_AREA_WIDGET,
  AffinePageDraggingAreaWidget,
} from './index';

export function effects() {
  if (!customElements.get(AFFINE_PAGE_DRAGGING_AREA_WIDGET)) {
    customElements.define(
      AFFINE_PAGE_DRAGGING_AREA_WIDGET,
      AffinePageDraggingAreaWidget
    );
  }
}
