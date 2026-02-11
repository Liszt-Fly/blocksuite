import { toast } from '@blocksuite/affine-components/toast';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import type {
  ListBlockModel,
  ParagraphBlockModel,
} from '@blocksuite/affine-model';
import { insertContent } from '@blocksuite/affine-rich-text';
import {
  ArrowDownBigIcon,
  ArrowUpBigIcon,
  CopyIcon,
  DeleteIcon,
  DualLinkIcon,
  NowIcon,
  TodayIcon,
  TomorrowIcon,
  YesterdayIcon,
} from '@blocksuite/icons/lit';
import { type DeltaInsert, Slice, Text } from '@blocksuite/store';

import { slashMenuToolTips } from './tooltips';
import type { SlashMenuConfig } from './types';
import { formatDate, formatTime } from './utils';

export const defaultSlashMenuConfig: SlashMenuConfig = {
  items: ({ std, model }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => {
      const v = t(key);
      return v === key ? fb : v;
    };
    const tips = slashMenuToolTips;

    const now = new Date();
    const tomorrow = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const groupDate = tt('slash.group.date', 'Date');
    const groupActions = tt('slash.group.actions', 'Actions');

    return [
      {
        name: tt('slash.today', 'Today'),
        icon: TodayIcon(),
        tooltip: tips['Today'],
        description: formatDate(now),
        group: `6_${groupDate}@0`,
        action: ({ std, model }) => {
          insertContent(std, model, formatDate(now));
        },
      },
      {
        name: tt('slash.tomorrow', 'Tomorrow'),
        icon: TomorrowIcon(),
        tooltip: tips['Tomorrow'],
        description: formatDate(tomorrow),
        group: `6_${groupDate}@1`,
        action: ({ std, model }) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          insertContent(std, model, formatDate(tomorrow));
        },
      },
      {
        name: tt('slash.yesterday', 'Yesterday'),
        icon: YesterdayIcon(),
        tooltip: tips['Yesterday'],
        description: formatDate(yesterday),
        group: `6_${groupDate}@2`,
        action: ({ std, model }) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          insertContent(std, model, formatDate(yesterday));
        },
      },
      {
        name: tt('slash.now', 'Now'),
        icon: NowIcon(),
        tooltip: tips['Now'],
        description: formatTime(now),
        group: `6_${groupDate}@3`,
        action: ({ std, model }) => {
          insertContent(std, model, formatTime(now));
        },
      },
      {
        name: tt('slash.moveUp', 'Move Up'),
        description: tt('slash.moveUp.desc', 'Shift this line up.'),
        shortcut: ['Mod-Alt-ArrowUp', 'Mod-Shift-ArrowUp'],
        icon: ArrowUpBigIcon(),
        tooltip: tips['Move Up'],
        group: `8_${groupActions}@0`,
        action: ({ std, model }) => {
          const { host } = std;
          const previousSiblingModel = host.store.getPrev(model);
          if (!previousSiblingModel) return;

          const parentModel = host.store.getParent(previousSiblingModel);
          if (!parentModel) return;

          host.store.moveBlocks(
            [model],
            parentModel,
            previousSiblingModel,
            true
          );
        },
      },
      {
        name: tt('slash.moveDown', 'Move Down'),
        description: tt('slash.moveDown.desc', 'Shift this line down.'),
        shortcut: ['Mod-Alt-ArrowDown', 'Mod-Shift-ArrowDown'],
        icon: ArrowDownBigIcon(),
        tooltip: tips['Move Down'],
        group: `8_${groupActions}@1`,
        action: ({ std, model }) => {
          const { host } = std;
          const nextSiblingModel = host.store.getNext(model);
          if (!nextSiblingModel) return;

          const parentModel = host.store.getParent(nextSiblingModel);
          if (!parentModel) return;

          host.store.moveBlocks([model], parentModel, nextSiblingModel, false);
        },
      },
      {
        name: tt('slash.copy', 'Copy'),
        description: tt('slash.copy.desc', 'Copy this line to clipboard.'),
        icon: CopyIcon(),
        tooltip: tips['Copy'],
        group: `8_${groupActions}@2`,
        searchAlias: ['copy', 'duplicate'],
        action: ({ std, model }) => {
          const slice = Slice.fromModels(std.store, [model]);

          std.clipboard
            .copy(slice)
            .then(() => {
              toast(std.host, tt('common.copiedToClipboard', 'Copied to clipboard'));
            })
            .catch(e => {
              console.error(e);
            });
        },
      },
      {
        name: tt('slash.duplicate', 'Duplicate'),
        description: tt('slash.duplicate.desc', 'Create a duplicate of this line.'),
        icon: DualLinkIcon(),
        tooltip: tips['Copy'],
        group: `8_${groupActions}@3`,
        searchAlias: ['duplicate', 'copy'],
        action: ({ std, model }) => {
          if (!model.text || !(model.text instanceof Text)) {
            console.error("Can't duplicate a block without text");
            return;
          }
          const { host } = std;
          const parent = host.store.getParent(model);
          if (!parent) {
            console.error(
              'Failed to duplicate block! Parent not found: ' +
                model.id +
                '|' +
                model.flavour
            );
            return;
          }
          const index = parent.children.indexOf(model);

          // FIXME: this clone is not correct
          host.store.addBlock(
            model.flavour,
            {
              type: (model as ParagraphBlockModel).props.type,
              text: new Text(
                (
                  model as ParagraphBlockModel
                ).props.text.toDelta() as DeltaInsert[]
              ),
              checked: (model as ListBlockModel).props.checked,
            },
            host.store.getParent(model),
            index
          );
        },
      },
      {
        name: tt('slash.delete', 'Delete'),
        description: tt('slash.delete.desc', 'Remove this line permanently.'),
        searchAlias: ['remove', 'delete'],
        icon: DeleteIcon(),
        tooltip: tips['Delete'],
        group: `8_${groupActions}@4`,
        action: ({ std, model }) => {
          std.host.store.deleteBlock(model);
        },
      },
    ];
  },
};
