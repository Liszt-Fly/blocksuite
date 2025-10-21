import { getSelectedModelsCommand } from '@blocksuite/affine-shared/commands';
import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { EmbedIcon } from '@blocksuite/icons/lit';
import { I18nProvider } from '@blocksuite/affine-shared/services';

import { insertEmptyEmbedIframeCommand } from '../../commands/insert-empty-embed-iframe';
import { EmbedIframeTooltip } from './tooltip';

export const embedIframeSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const group = tt('slash.group.media', 'Content & Media');
    return [{
      name: tt('slash.embed.generic', 'Embed'),
      description: tt('slash.embed.generic.desc', 'For Google Drive, and more.'),
      icon: EmbedIcon(),
      tooltip: {
        figure: EmbedIframeTooltip,
        caption: 'Embed',
      },
      group: `4_${group}@5`,
      when: ({ model }) => {
        return model.store.schema.flavourSchemaMap.has('affine:embed-iframe');
      },
      action: ({ std }) => {
        std.command
          .chain()
          .pipe(getSelectedModelsCommand)
          .pipe(insertEmptyEmbedIframeCommand, {
            place: 'after',
            removeEmptyLine: true,
            linkInputPopupOptions: {
              telemetrySegment: 'slash menu',
            },
          })
          .run();
      },
    }];
  },
};
