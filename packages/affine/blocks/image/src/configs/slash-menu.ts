import { getSelectedModelsCommand } from '@blocksuite/affine-shared/commands';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { ImageIcon } from '@blocksuite/icons/lit';

import { insertImagesCommand } from '../commands';
import { PhotoTooltip } from './tooltips';

export const imageSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const group = tt('slash.group.media', 'Content & Media');

    return [
      {
        name: tt('slash.image.image', 'Image'),
        description: tt('slash.image.image.desc', 'Insert an image.'),
        icon: ImageIcon(),
        tooltip: {
          figure: PhotoTooltip,
          caption: 'Photo',
        },
        group: `4_${group}@1`,
        when: ({ model }) =>
          model.store.schema.flavourSchemaMap.has('affine:image'),
        action: ({ std }) => {
          const [success, ctx] = std.command
            .chain()
            .pipe(getSelectedModelsCommand)
            .pipe(insertImagesCommand, { removeEmptyLine: true })
            .run();

          if (success) ctx.insertedImageIds.catch(console.error);
        },
      },
    ];
  },
};
