import { ImageBlockFallbackCard } from './components/image-block-fallback.js';
import { ImageBlockPageComponent } from './components/page-image-block.js';
import { ImageBlockComponent } from './image-block.js';
import { ImageEdgelessBlockComponent } from './image-edgeless-block.js';
import { ImageEdgelessPlaceholderBlockComponent } from './preview-image/edgeless.js';
import { ImagePlaceholderBlockComponent } from './preview-image/page.js';

export function effects() {
  if (!customElements.get('affine-image')) {
    customElements.define('affine-image', ImageBlockComponent);
  }
  if (!customElements.get('affine-edgeless-image')) {
    customElements.define('affine-edgeless-image', ImageEdgelessBlockComponent);
  }
  if (!customElements.get('affine-page-image')) {
    customElements.define('affine-page-image', ImageBlockPageComponent);
  }
  if (!customElements.get('affine-image-fallback-card')) {
    customElements.define('affine-image-fallback-card', ImageBlockFallbackCard);
  }
  if (!customElements.get('affine-placeholder-preview-image')) {
    customElements.define(
      'affine-placeholder-preview-image',
      ImagePlaceholderBlockComponent
    );
  }
  if (!customElements.get('affine-edgeless-placeholder-preview-image')) {
    customElements.define(
      'affine-edgeless-placeholder-preview-image',
      ImageEdgelessPlaceholderBlockComponent
    );
  }
}
