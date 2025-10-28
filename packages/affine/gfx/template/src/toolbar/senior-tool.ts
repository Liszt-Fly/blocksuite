import { SeniorToolExtension } from '@blocksuite/affine-widget-edgeless-toolbar';
import { html } from 'lit';
import { t } from '@blocksuite/affine-shared/utils';

export const templateSeniorTool = SeniorToolExtension(
  'template',
  ({ block }) => {
  return {
    name: t('edgeless.nav.template', 'Template'),
      content: html`<edgeless-template-button .edgeless=${block}>
      </edgeless-template-button>`,
    };
  }
);
