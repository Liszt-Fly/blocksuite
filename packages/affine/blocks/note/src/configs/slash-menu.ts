// import { formatBlockCommand, type TextFormatConfig, textFormatConfigs } from '@blocksuite/affine-inline-preset';
import {
  type TextConversionConfig,
  textConversionConfigs,
} from '@blocksuite/affine-rich-text';
import { isInsideBlockByFlavour } from '@blocksuite/affine-shared/utils';
import {
  type SlashMenuActionItem,
  type SlashMenuConfig,
  SlashMenuConfigExtension,
  type SlashMenuItem,
} from '@blocksuite/affine-widget-slash-menu';
import { HeadingsIcon } from '@blocksuite/icons/lit';
import { I18nProvider } from '@blocksuite/affine-shared/services';

import { updateBlockType } from '../commands';
import { tooltips } from './tooltips';
const noteSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fallback: string) => {
      const v = t(key);
      return v === key ? fallback : v;
    };

    let basicIndex = 0;
    const groupBasic = tt('slash.group.basic', 'Basic');
    const groupList = tt('slash.group.list', 'List');
    const groupStyle = tt('slash.group.style', 'Style');

    const createGroup = (i: number, name: string) => `${i}_${name}@${basicIndex++}` as const;

    const items: SlashMenuItem[] = [
      ...textConversionConfigs
        .filter(i => i.type && ['h1', 'h2', 'h3', 'text'].includes(i.type))
        .map(config => createConversionItem(config, createGroup(0, groupBasic), t, tt)),
      {
        name: tt('slash.note.otherHeadings', 'Other Headings'),
        icon: HeadingsIcon(),
        group: createGroup(0, groupBasic),
        subMenu: textConversionConfigs
          .filter(i => i.type && ['h4', 'h5', 'h6'].includes(i.type))
          .map(config => createConversionItem(config, undefined, t, tt)),
      },
      ...textConversionConfigs
        .filter(i => i.flavour === 'affine:code')
        .map(config => createConversionItem(config, createGroup(0, groupBasic), t, tt)),

      ...textConversionConfigs
        .filter(i => i.type && ['divider', 'quote'].includes(i.type))
        .map(
          config =>
            ({
              ...createConversionItem(config, createGroup(0, groupBasic), t, tt),
              when: ({ model }) =>
                model.store.schema.flavourSchemaMap.has(config.flavour) &&
                !isInsideBlockByFlavour(
                  model.store,
                  model,
                  'affine:edgeless-text'
                ),
            }) satisfies SlashMenuActionItem
        ),

      ...textConversionConfigs
        .filter(i => i.flavour === 'affine:list')
        .map((config, index) =>
          createConversionItem(config, (`1_${groupList}@${index++}`) as any, t, tt)
        ),

      // NOTE: Remove "Style" group items (Bold / Italic / Underline / Strikethrough)
      // from the slash menu as requested. The original code below adds text
      // formatting actions to the slash menu. We comment it out to hide the
      // entire group from the menu.
      // ...textFormatConfigs
      //   .filter(i => !['Code', 'Link'].includes(i.name))
      //   .map((config, index) =>
      //     createTextFormatItem(
      //       config,
      //       (`2_${groupStyle}@${index++}`) as any,
      //       t,
      //       tt
      //     )
      //   ),
    ];

    return items;
  },
};

function createConversionItem(
  config: TextConversionConfig,
  group: SlashMenuItem['group'] | undefined,
  t: (key: string) => string,
  tt: (key: string, fb: string) => string
): SlashMenuActionItem {
  const { name: originalName, description: originalDesc, icon, flavour, type } = config;

  const nameKey = (() => {
    switch (config.type) {
      case 'text':
        return 'slash.note.text';
      case 'h1':
        return 'slash.note.h1';
      case 'h2':
        return 'slash.note.h2';
      case 'h3':
        return 'slash.note.h3';
      case 'h4':
        return 'slash.note.h4';
      case 'h5':
        return 'slash.note.h5';
      case 'h6':
        return 'slash.note.h6';
      case 'quote':
        return 'slash.note.quote';
      case 'divider':
        return 'slash.note.divider';
      default:
        // Provide i18n keys for list types as well
        if (config.flavour === 'affine:list') {
          switch (config.type) {
            case 'bulleted':
              return 'slash.note.bulletedList';
            case 'numbered':
              return 'slash.note.numberedList';
            case 'todo':
              return 'slash.note.todoList';
          }
        }
        return config.flavour === 'affine:code' ? 'slash.note.codeBlock' : originalName;
    }
  })();

  const descKey = `${nameKey}.desc`;
  const name = typeof nameKey === 'string' ? tt(nameKey, originalName) : originalName;
  const description = originalDesc ? tt(descKey, originalDesc) : undefined;

  return {
    name,
    group,
    description,
    shortcut: config.hotkey ?? undefined,
    icon,
    // tooltip 保持使用原始英文 key
    tooltip: tooltips[originalName],
    when: ({ model }) => model.store.schema.flavourSchemaMap.has(flavour),
    action: ({ std }) => {
      std.command.exec(updateBlockType, {
        flavour,
        props: { type },
      });
    },
  };
}

export const NoteSlashMenuConfigExtension = SlashMenuConfigExtension(
  'affine:note',
  noteSlashMenuConfig
);
