import { DataViewBlockComponent } from './data-view-block';

export function effects() {
  // In some bundling/host setups, the same extension can be initialized more than once.
  // Guard against redefining the same custom element.
  if (!customElements.get('affine-data-view')) {
    customElements.define('affine-data-view', DataViewBlockComponent);
  }
}
