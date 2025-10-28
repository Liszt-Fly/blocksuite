import { EditorChevronDown } from '@blocksuite/affine-components/toolbar';
import { NoteDisplayMode } from '@blocksuite/affine-model';
import { t } from '@blocksuite/affine-shared/utils';
import { ShadowlessElement } from '@blocksuite/std';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

// Build the display-mode map at render time to ensure i18n is ready
const resolveDisplayModeLabel = (mode: NoteDisplayMode) => {
  const map: Record<NoteDisplayMode, string> = {
    [NoteDisplayMode.DocAndEdgeless]: t(
      'edgeless.note.displayMode.both',
      'Both'
    ),
    [NoteDisplayMode.EdgelessOnly]: t(
      'edgeless.note.displayMode.edgeless',
      'Edgeless'
    ),
    [NoteDisplayMode.DocOnly]: t('edgeless.note.displayMode.page', 'Page'),
  } as const;
  return map[mode];
};

export class EdgelessNoteDisplayModeDropdownMenu extends ShadowlessElement {
  get mode() {
    return resolveDisplayModeLabel(this.displayMode);
  }

  select(detail: NoteDisplayMode) {
    this.dispatchEvent(new CustomEvent('select', { detail }));
  }

  override render() {
    const { displayMode, mode } = this;

    return html`
      <span class="display-mode-button-label">${t('edgeless.note.displayMode.showIn', 'Show in')}</span>
      <editor-menu-button
        .contentPadding=${'8px'}
        .button=${html`
          <editor-icon-button
            aria-label="${t('edgeless.note.displayMode.mode', 'Mode')}"
            .tooltip="${t('edgeless.note.displayMode.tooltip', 'Display mode')}"
            .justify="${'space-between'}"
            .labelHeight="${'20px'}"
          >
            <span class="label">${mode}</span>
            ${EditorChevronDown}
          </editor-icon-button>
        `}
      >
        <note-display-mode-panel
          .displayMode=${displayMode}
          .onSelect=${(newMode: NoteDisplayMode) => this.select(newMode)}
        >
        </note-display-mode-panel>
      </editor-menu-button>
    `;
  }

  @property({ attribute: false })
  accessor displayMode!: NoteDisplayMode;
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-note-display-mode-dropdown-menu': EdgelessNoteDisplayModeDropdownMenu;
  }
}
