import { AttachmentBlockComponent } from './attachment-block';
import { AttachmentEdgelessBlockComponent } from './attachment-edgeless-block';

export function effects() {
  if (!customElements.get('affine-edgeless-attachment')) {
    customElements.define(
      'affine-edgeless-attachment',
      AttachmentEdgelessBlockComponent
    );
  }
  if (!customElements.get('affine-attachment')) {
    customElements.define('affine-attachment', AttachmentBlockComponent);
  }
}
