import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const embedFigmaSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    void std;
    // NOTE: Hide Figma from slash menu. Original item kept as comments below.
    // return [{
    //   name: tt('slash.embed.figma', 'Figma'),
    //   description: tt('slash.embed.figma.desc', 'Embed a Figma document.'),
    //   icon: FigmaDuotoneIcon(),
    //   tooltip: {
    //     figure: FigmaTooltip,
    //     caption: 'Figma',
    //   },
    //   group: `4_${group}@8`,
    //   when: ({ model }) =>
    //     model.store.schema.flavourSchemaMap.has('affine:embed-figma'),
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
    //         'Figma',
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
