import { SeniorToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
import { t } from '@blocksuite/affine-shared/utils';

export const mindMapSeniorTool = SeniorToolExtension(
  'mindMap',
  ({ block, toolbarContainer }) => {
  return {
    name: t('edgeless.nav.mindmap', 'Mind Map'),
      content: html`<edgeless-mindmap-tool-button
        .edgeless=${block}
        .toolbarContainer=${toolbarContainer}
      ></edgeless-mindmap-tool-button>`,
    };
  }
);
