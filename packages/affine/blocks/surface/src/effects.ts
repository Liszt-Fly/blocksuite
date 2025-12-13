import { SurfaceBlockComponent } from './surface-block.js';
import { SurfaceBlockVoidComponent } from './surface-block-void.js';

export function effects() {
  if (!customElements.get('affine-surface-void')) {
    customElements.define('affine-surface-void', SurfaceBlockVoidComponent);
  }
  if (!customElements.get('affine-surface')) {
    customElements.define('affine-surface', SurfaceBlockComponent);
  }
}
