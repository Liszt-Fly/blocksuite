import type { SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';

export const embedGithubSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    void std;
    // NOTE: Hide GitHub from slash menu. Original item kept as comments below.
    // return [{
    //   name: tt('slash.embed.github', 'GitHub'),
    //   description: tt('slash.embed.github.desc', 'Link to a GitHub repository.'),
    //   icon: GithubDuotoneIcon(),
    //   tooltip: {
    //     figure: GithubRepoTooltip,
    //     caption: 'GitHub Repo',
    //   },
    //   group: `4_${group}@7`,
    //   when: ({ model }) =>
    //     model.store.schema.flavourSchemaMap.has('affine:embed-github'),
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
    //         'GitHub',
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
