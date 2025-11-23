import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const attachmentSlashMenuConfig: SlashMenuConfig = {
  items: ({ std, model }) => {
    // Disabled in Chronnote: Attachment / PDF slash menu items.
    return [];
  },
};
