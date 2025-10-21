import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const embedLoomSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    void std;
    // NOTE: Hide Loom from slash menu. Original item kept as comments below.
    // return [{
    //   name: tt('slash.embed.loom', 'Loom'),
    //   icon: LoomLogoDuotoneIcon(),
    //   description: tt('slash.embed.loom.desc', 'Embed a Loom video.'),
    //   tooltip: {
    //     figure: LoomTooltip,
    //     caption: 'loom',
    //   },
    //   group: `4_${group}@9`,
    //   when: ({ model }) =>
    //     model.store.schema.flavourSchemaMap.has('affine:embed-loom'),
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
    //         'Loom',
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
