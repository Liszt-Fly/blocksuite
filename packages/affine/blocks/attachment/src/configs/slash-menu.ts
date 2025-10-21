import { openSingleFileWith } from '@blocksuite/affine-shared/utils';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { ExportToPdfIcon, FileIcon } from '@blocksuite/icons/lit';

import { addSiblingAttachmentBlocks } from '../utils';
import { AttachmentTooltip, PDFTooltip } from './tooltips';

export const attachmentSlashMenuConfig: SlashMenuConfig = {
  items: ({ std, model }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const group = tt('slash.group.media', 'Content & Media');

    return [
      {
        name: tt('slash.attachment.attachment', 'Attachment'),
        description: tt('slash.attachment.attachment.desc', 'Attach a file to document.'),
        icon: FileIcon(),
        tooltip: {
          figure: AttachmentTooltip,
          caption: 'Attachment',
        },
        searchAlias: ['file'],
        group: `4_${group}@3`,
        when: ({ model }) =>
          model.store.schema.flavourSchemaMap.has('affine:attachment'),
        action: ({ std, model }) => {
          (async () => {
            const file = await openSingleFileWith();
            if (!file) return;

            await addSiblingAttachmentBlocks(std, [file], model);
            if (model.text?.length === 0) {
              std.store.deleteBlock(model);
            }
          })().catch(console.error);
        },
      },
      {
        name: tt('slash.attachment.pdf', 'PDF'),
        description: tt('slash.attachment.pdf.desc', 'Upload a PDF to document.'),
        icon: ExportToPdfIcon(),
        tooltip: {
          figure: PDFTooltip,
          caption: 'PDF',
        },
        group: `4_${group}@4`,
        when: ({ model }) =>
          model.store.schema.flavourSchemaMap.has('affine:attachment'),
        action: ({ std, model }) => {
          (async () => {
            const file = await openSingleFileWith();
            if (!file) return;

            await addSiblingAttachmentBlocks(std, [file], model);
            if (model.text?.length === 0) {
              std.store.deleteBlock(model);
            }
          })().catch(console.error);
        },
      },
    ];
  },
};
