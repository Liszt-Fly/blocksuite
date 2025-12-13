import { EdgelessTextBlockComponent } from './edgeless-text-block';

export function effects() {
  if (!customElements.get('affine-edgeless-text')) {
    customElements.define('affine-edgeless-text', EdgelessTextBlockComponent);
  }
}
