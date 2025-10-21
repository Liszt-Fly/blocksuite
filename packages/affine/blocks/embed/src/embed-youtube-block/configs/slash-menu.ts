import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const embedYoutubeSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    void std;
    // NOTE: Hide YouTube from slash menu. Original item kept as comments below.
    // return [{
    //   name: tt('slash.embed.youtube', 'YouTube'),
    //   description: tt('slash.embed.youtube.desc', 'Embed a YouTube video.'),
    //   icon: YoutubeDuotoneIcon(),
    //   tooltip: {
    //     figure: YoutubeVideoTooltip,
    //     caption: 'YouTube Video',
    //   },
    //   group: `4_${group}@6`,
    //   when: ({ model }) =>
    //     model.store.schema.flavourSchemaMap.has('affine:embed-youtube'),
    //   action: ({ std, model }) => {
    //     (async () => {
    //       const { host } = std;
    //       const parentModel = host.store.getParent(model);
    //       if (!parentModel) {
    //         return;
    //       }
    //       const index = parentModel.children.indexOf(model) + 1;
    //       await toggleEmbedCardCreateModal(
    //         host,
    //         'YouTube',
    //         tt('slash.embed.common.desc', 'The added link will be displayed as an embed view.'),
    //         { mode: 'page', parentModel, index },
    //         ({ mode }) => {
    //           if (mode === 'edgeless') {
    //             const gfx = std.get(GfxControllerIdentifier);
    //             gfx.tool.setTool(DefaultTool);
    //           }
    //         }
    //       );
    //       if (model.text?.length === 0) std.store.deleteBlock(model);
    //     })().catch(console.error);
    //   },
    // }];
    return [];
  },
};
