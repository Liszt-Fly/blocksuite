import { BookmarkBlockComponent } from './bookmark-block';
import { BookmarkEdgelessBlockComponent } from './bookmark-edgeless-block';
import { BookmarkCard } from './components/bookmark-card';

export function effects() {
  if (!customElements.get('affine-edgeless-bookmark')) {
    customElements.define(
      'affine-edgeless-bookmark',
      BookmarkEdgelessBlockComponent
    );
  }
  if (!customElements.get('affine-bookmark')) {
    customElements.define('affine-bookmark', BookmarkBlockComponent);
  }
  if (!customElements.get('bookmark-card')) {
    customElements.define('bookmark-card', BookmarkCard);
  }
}
