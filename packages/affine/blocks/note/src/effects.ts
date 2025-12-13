import { EdgelessNoteBackground } from './components/edgeless-note-background';
import { EdgelessNoteBorderDropdownMenu } from './components/edgeless-note-border-dropdown-menu';
import { EdgelessNoteDisplayModeDropdownMenu } from './components/edgeless-note-display-mode-dropdown-menu';
import { EdgelessNoteMask } from './components/edgeless-note-mask';
import { EdgelessNoteShadowMenu } from './components/edgeless-note-shadow-menu';
import { EdgelessNoteStylePanel } from './components/edgeless-note-style-panel';
import { EdgelessPageBlockTitle } from './components/edgeless-page-block-title';
import { NoteBlockComponent } from './note-block';
import {
  AFFINE_EDGELESS_NOTE,
  EdgelessNoteBlockComponent,
} from './note-edgeless-block';
export function effects() {
  if (!customElements.get('affine-note')) {
    customElements.define('affine-note', NoteBlockComponent);
  }
  if (!customElements.get(AFFINE_EDGELESS_NOTE)) {
    customElements.define(AFFINE_EDGELESS_NOTE, EdgelessNoteBlockComponent);
  }
  if (!customElements.get('edgeless-note-mask')) {
    customElements.define('edgeless-note-mask', EdgelessNoteMask);
  }
  if (!customElements.get('edgeless-note-background')) {
    customElements.define('edgeless-note-background', EdgelessNoteBackground);
  }
  if (!customElements.get('edgeless-page-block-title')) {
    customElements.define('edgeless-page-block-title', EdgelessPageBlockTitle);
  }
  if (!customElements.get('edgeless-note-shadow-menu')) {
    customElements.define('edgeless-note-shadow-menu', EdgelessNoteShadowMenu);
  }
  if (!customElements.get('edgeless-note-border-dropdown-menu')) {
    customElements.define(
      'edgeless-note-border-dropdown-menu',
      EdgelessNoteBorderDropdownMenu
    );
  }
  if (!customElements.get('edgeless-note-display-mode-dropdown-menu')) {
    customElements.define(
      'edgeless-note-display-mode-dropdown-menu',
      EdgelessNoteDisplayModeDropdownMenu
    );
  }
  if (!customElements.get('edgeless-note-style-panel')) {
    customElements.define('edgeless-note-style-panel', EdgelessNoteStylePanel);
  }
}
