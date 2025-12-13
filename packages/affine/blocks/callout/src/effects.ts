import { CalloutBlockComponent } from './callout-block';
import { EmojiMenu } from './emoji-menu';

export function effects() {
  if (!customElements.get('affine-callout')) {
    customElements.define('affine-callout', CalloutBlockComponent);
  }
  if (!customElements.get('affine-emoji-menu')) {
    customElements.define('affine-emoji-menu', EmojiMenu);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-callout': CalloutBlockComponent;
    'affine-emoji-menu': EmojiMenu;
  }
}
