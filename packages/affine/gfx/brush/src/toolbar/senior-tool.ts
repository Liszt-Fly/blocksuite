import { SeniorToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
import { t } from '@blocksuite/affine-shared/utils';

export const penSeniorTool = SeniorToolExtension('pen', ({ block }) => {
  return {
    name: t('edgeless.nav.pen', 'Pen'),
    content: html`<div class="pen-and-eraser">
      <edgeless-pen-tool-button .edgeless=${block}></edgeless-pen-tool-button>

      <edgeless-eraser-tool-button
        .edgeless=${block}
      ></edgeless-eraser-tool-button>
    </div> `,
  };
});
