import { SeniorToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
import { t } from '@blocksuite/affine-shared/utils';

export const noteSeniorTool = SeniorToolExtension('note', ({ block }) => {
  return {
    name: t('edgeless.nav.note', 'Note'),
    content: html`<edgeless-note-senior-button
      .edgeless=${block}
    ></edgeless-note-senior-button>`,
  };
});
