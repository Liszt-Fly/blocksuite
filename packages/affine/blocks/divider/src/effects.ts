import { DividerBlockComponent } from './divider-block';

export function effects() {
  if (!customElements.get('affine-divider')) {
    customElements.define('affine-divider', DividerBlockComponent);
  }
}
