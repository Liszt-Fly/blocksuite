import {
  EdgelessRootBlockComponent,
  EdgelessRootPreviewBlockComponent,
  PageRootBlockComponent,
  PreviewRootBlockComponent,
} from './index.js';

export function effects() {
  // Register components by category
  registerRootComponents();
}

function registerRootComponents() {
  const define = (name: string, ctor: CustomElementConstructor) => {
    if (!customElements.get(name)) {
      customElements.define(name, ctor);
    }
  };

  define('affine-page-root', PageRootBlockComponent);
  define('affine-preview-root', PreviewRootBlockComponent);
  define('affine-edgeless-root', EdgelessRootBlockComponent);
  define('affine-edgeless-root-preview', EdgelessRootPreviewBlockComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-edgeless-root': EdgelessRootBlockComponent;
    'affine-page-root': PageRootBlockComponent;
  }
}
