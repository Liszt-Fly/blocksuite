import { effects as ParagraphHeadingIconEffects } from './heading-icon.js';
import { ParagraphBlockComponent } from './paragraph-block.js';

export function effects() {
  ParagraphHeadingIconEffects();
  if (!customElements.get('affine-paragraph')) {
    customElements.define('affine-paragraph', ParagraphBlockComponent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-paragraph': ParagraphBlockComponent;
  }
}
