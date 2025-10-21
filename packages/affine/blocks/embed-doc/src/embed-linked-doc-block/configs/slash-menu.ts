import { EmbedLinkedDocBlockSchema } from '@blocksuite/affine-model';
import {
  type SlashMenuConfig,
  SlashMenuConfigIdentifier,
} from '@blocksuite/affine-widget-slash-menu';
import { type ExtensionType } from '@blocksuite/store';

// NOTE: Hide the "Page" group (New Doc / Linked Doc) from the slash menu.
// The original items are commented out below to keep for future reference.
const linkedDocSlashMenuConfig: SlashMenuConfig = {
  items: [
    // {
    //   name: 'New Doc',
    //   description: 'Start a new document.',
    //   icon: PlusIcon(),
    //   tooltip: {
    //     figure: NewDocTooltip,
    //     caption: 'New Doc',
    //   },
    //   group: '3_Page@0',
    //   when: ({ model }) =>
    //     model.store.schema.flavourSchemaMap.has('affine:embed-linked-doc'),
    //   action: ({ std, model }) => {
    //     const newDoc = createDefaultDoc(std.host.store.workspace);
    //     insertContent(std, model, REFERENCE_NODE, {
    //       reference: {
    //         type: 'LinkedPage',
    //         pageId: newDoc.id,
    //       },
    //     });
    //   },
    // },
    // {
    //   name: 'Linked Doc',
    //   description: 'Link to another document.',
    //   icon: LinkedPageIcon(),
    //   tooltip: {
    //     figure: LinkDocTooltip,
    //     caption: 'Link Doc',
    //   },
    //   searchAlias: ['dual link'],
    //   group: '3_Page@1',
    //   when: ({ std, model }) => {
    //     const root = model.store.root;
    //     if (!root) return false;
    //     const linkedDocWidget = std.view.getWidget(
    //       'affine-linked-doc-widget',
    //       root.id
    //     );
    //     if (!linkedDocWidget) return false;
    //
    //     return model.store.schema.flavourSchemaMap.has(
    //       'affine:embed-linked-doc'
    //     );
    //   },
    //   action: ({ model, std }) => {
    //     const root = model.store.root;
    //     if (!root) return;
    //     const linkedDocWidget = std.view.getWidget(
    //       'affine-linked-doc-widget',
    //       root.id
    //     );
    //     if (!linkedDocWidget) return;
    //     // TODO(@L-Sun): make linked-doc-widget as extension
    //     // @ts-expect-error same as above
    //     linkedDocWidget.show({ addTriggerKey: true });
    //   },
    // },
  ],
};

export const LinkedDocSlashMenuConfigIdentifier = SlashMenuConfigIdentifier(
  EmbedLinkedDocBlockSchema.model.flavour
);

export const LinkedDocSlashMenuConfigExtension: ExtensionType = {
  setup: di => {
    di.addImpl(LinkedDocSlashMenuConfigIdentifier, linkedDocSlashMenuConfig);
  },
};
