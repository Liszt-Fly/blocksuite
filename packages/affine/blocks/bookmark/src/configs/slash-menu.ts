import { DefaultTool } from '@blocksuite/affine-block-surface';
import { toggleEmbedCardCreateModal } from '@blocksuite/affine-components/embed-card-modal';
import { BookmarkBlockSchema } from '@blocksuite/affine-model';
import {
  type SlashMenuConfig,
  SlashMenuConfigIdentifier,
} from '@blocksuite/affine-widget-slash-menu';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import { LinkIcon } from '@blocksuite/icons/lit';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';
import type { ExtensionType } from '@blocksuite/store';

import { LinkTooltip } from './tooltips';

const bookmarkSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const group = tt('slash.group.media', 'Content & Media');

    return [
      {
        name: tt('slash.bookmark.link', 'Link'),
        description: tt(
          'slash.bookmark.link.desc',
          'Add a bookmark for reference.'
        ),
        icon: LinkIcon(),
        tooltip: {
          figure: LinkTooltip,
          caption: tt('slash.bookmark.link', 'Link'),
        },
        group: `4_${group}@2`,
        when: ({ model }) =>
          model.store.schema.flavourSchemaMap.has('affine:bookmark'),
        action: ({ std, model }) => {
          const { host } = std;
          const parentModel = host.store.getParent(model);
          if (!parentModel) {
            return;
          }
          const index = parentModel.children.indexOf(model) + 1;
          toggleEmbedCardCreateModal(
          host,
          tt('edgeless.link.modal.title', 'Links'),
          tt(
            'edgeless.link.modal.desc',
            'The added link will be displayed as a card view.'
          ),
          { mode: 'page', parentModel, index },
          ({ mode }) => {
            if (mode === 'edgeless') {
              const gfx = std.get(GfxControllerIdentifier);
              gfx.tool.setTool(DefaultTool);
            }
          }
        )
          .then(() => {
            if (model.text?.length === 0) {
              model.store.deleteBlock(model);
            }
          })
          .catch(console.error);
        },
      },
    ];
  },
};

export const BookmarkSlashMenuConfigIdentifier = SlashMenuConfigIdentifier(
  BookmarkBlockSchema.model.flavour
);

export const BookmarkSlashMenuConfigExtension: ExtensionType = {
  setup: di => {
    di.addImpl(BookmarkSlashMenuConfigIdentifier, bookmarkSlashMenuConfig);
  },
};
