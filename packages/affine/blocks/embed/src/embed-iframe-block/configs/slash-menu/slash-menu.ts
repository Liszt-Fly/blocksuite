import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const embedIframeSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    // Disabled in Chronnote: generic Embed slash menu item.
    return [];
  },
};
