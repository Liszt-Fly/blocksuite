import { EmbedLinkedDocBlockComponent } from './embed-linked-doc-block';
import { EmbedEdgelessLinkedDocBlockComponent } from './embed-linked-doc-block/embed-edgeless-linked-doc-block';
import { EmbedSyncedDocBlockComponent } from './embed-synced-doc-block';
import { EmbedSyncedDocCard } from './embed-synced-doc-block/components/embed-synced-doc-card';
import { EmbedEdgelessSyncedDocBlockComponent } from './embed-synced-doc-block/embed-edgeless-synced-doc-block';

export function effects() {
  if (!customElements.get('affine-embed-synced-doc-card')) {
    customElements.define('affine-embed-synced-doc-card', EmbedSyncedDocCard);
  }

  if (!customElements.get('affine-embed-edgeless-linked-doc-block')) {
    customElements.define(
      'affine-embed-edgeless-linked-doc-block',
      EmbedEdgelessLinkedDocBlockComponent
    );
  }
  if (!customElements.get('affine-embed-linked-doc-block')) {
    customElements.define(
      'affine-embed-linked-doc-block',
      EmbedLinkedDocBlockComponent
    );
  }

  if (!customElements.get('affine-embed-edgeless-synced-doc-block')) {
    customElements.define(
      'affine-embed-edgeless-synced-doc-block',
      EmbedEdgelessSyncedDocBlockComponent
    );
  }
  if (!customElements.get('affine-embed-synced-doc-block')) {
    customElements.define(
      'affine-embed-synced-doc-block',
      EmbedSyncedDocBlockComponent
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-embed-synced-doc-card': EmbedSyncedDocCard;
    'affine-embed-synced-doc-block': EmbedSyncedDocBlockComponent;
    'affine-embed-edgeless-synced-doc-block': EmbedEdgelessSyncedDocBlockComponent;
    'affine-embed-linked-doc-block': EmbedLinkedDocBlockComponent;
    'affine-embed-edgeless-linked-doc-block': EmbedEdgelessLinkedDocBlockComponent;
  }
}
