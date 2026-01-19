import { AFFINE_DOC_SEARCH_WIDGET } from './consts';
import { AffineDocSearchWidget } from './widget';

export function effects() {
  if (!customElements.get(AFFINE_DOC_SEARCH_WIDGET)) {
    customElements.define(AFFINE_DOC_SEARCH_WIDGET, AffineDocSearchWidget);
  }
}
