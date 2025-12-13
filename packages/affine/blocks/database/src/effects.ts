import { CenterPeek } from './components/layout';
import { DatabaseTitle } from './components/title';
import { DatabaseBlockComponent } from './database-block';
import { DatabaseDndPreviewBlockComponent } from './database-dnd-preview-block';
import { BlockRenderer } from './detail-panel/block-renderer';
import { NoteRenderer } from './detail-panel/note-renderer';
import { CreatedTimeCell } from './properties/created-time/cell-renderer';
import { LinkCell } from './properties/link/cell-renderer';
import { RichTextCell } from './properties/rich-text/cell-renderer';
import { IconCell } from './properties/title/icon';
import { HeaderAreaTextCell } from './properties/title/text';

export function effects() {
  if (!customElements.get('affine-database-title')) {
    customElements.define('affine-database-title', DatabaseTitle);
  }
  if (!customElements.get('data-view-header-area-icon')) {
    customElements.define('data-view-header-area-icon', IconCell);
  }
  if (!customElements.get('affine-database-link-cell')) {
    customElements.define('affine-database-link-cell', LinkCell);
  }
  if (!customElements.get('data-view-header-area-text')) {
    customElements.define('data-view-header-area-text', HeaderAreaTextCell);
  }
  if (!customElements.get('affine-database-rich-text-cell')) {
    customElements.define('affine-database-rich-text-cell', RichTextCell);
  }
  if (!customElements.get('affine-database-created-time-cell')) {
    customElements.define(
      'affine-database-created-time-cell',
      CreatedTimeCell
    );
  }
  if (!customElements.get('center-peek')) {
    customElements.define('center-peek', CenterPeek);
  }
  if (!customElements.get('database-datasource-note-renderer')) {
    customElements.define('database-datasource-note-renderer', NoteRenderer);
  }
  if (!customElements.get('database-datasource-block-renderer')) {
    customElements.define('database-datasource-block-renderer', BlockRenderer);
  }
  if (!customElements.get('affine-database')) {
    customElements.define('affine-database', DatabaseBlockComponent);
  }

  if (!customElements.get('affine-dnd-preview-database')) {
    customElements.define(
      'affine-dnd-preview-database',
      DatabaseDndPreviewBlockComponent
    );
  }
}
