import {
  BulletedListIcon,
  CheckBoxIcon,
  CodeBlockIcon,
  DividerIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  NumberedListIcon,
  QuoteIcon,
  TextIcon,
} from '@blocksuite/affine-components/icons';
import type { NoteChildrenFlavour } from '@blocksuite/affine-shared/types';
import type { TemplateResult } from 'lit';
import { t } from '@blocksuite/affine-shared/utils';

export const BUTTON_GROUP_LENGTH = 10;

export type NoteMenuItem = {
  icon: TemplateResult<1>;
  tooltip: string;
  childFlavour: NoteChildrenFlavour;
  childType: string | null;
};

const LIST_ITEMS = [
  {
    flavour: 'affine:list',
    type: 'bulleted',
    name: t('edgeless.note.name.bulletedList', 'Bulleted List'),
    description: t('edgeless.note.desc.bulletedList', 'A simple bulleted list.'),
    icon: BulletedListIcon,
    tooltip: t('edgeless.note.tooltip.bulletedList', 'Bulleted List'),
  },
  {
    flavour: 'affine:list',
    type: 'numbered',
    name: t('edgeless.note.name.numberedList', 'Numbered List'),
    description: t('edgeless.note.desc.numberedList', 'A list with numbering.'),
    icon: NumberedListIcon,
    tooltip: t('edgeless.note.tooltip.numberedList', 'Numbered List'),
  },
  {
    flavour: 'affine:list',
    type: 'todo',
    name: t('edgeless.note.name.todoList', 'To-do List'),
    description: t('edgeless.note.desc.todoList', 'Track tasks with a to-do list.'),
    icon: CheckBoxIcon,
    tooltip: t('edgeless.note.tooltip.todoList', 'To-do List'),
  },
];

const TEXT_ITEMS = [
  {
    flavour: 'affine:paragraph',
    type: 'text',
    name: t('edgeless.note.name.text', 'Text'),
    description: t('edgeless.note.desc.text', 'Start typing with plain text.'),
    icon: TextIcon,
    tooltip: t('edgeless.note.tooltip.text', 'Text'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h1',
    name: t('edgeless.note.name.heading1', 'Heading 1'),
    description: t('edgeless.note.desc.heading1', 'Headings in the largest font.'),
    icon: Heading1Icon,
    tooltip: t('edgeless.note.tooltip.heading1', 'Heading 1'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h2',
    name: t('edgeless.note.name.heading2', 'Heading 2'),
    description: t('edgeless.note.desc.heading2', 'Headings in the 2nd font size.'),
    icon: Heading2Icon,
    tooltip: t('edgeless.note.tooltip.heading2', 'Heading 2'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h3',
    name: t('edgeless.note.name.heading3', 'Heading 3'),
    description: t('edgeless.note.desc.heading3', 'Headings in the 3rd font size.'),
    icon: Heading3Icon,
    tooltip: t('edgeless.note.tooltip.heading3', 'Heading 3'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h4',
    name: t('edgeless.note.name.heading4', 'Heading 4'),
    description: t('edgeless.note.desc.heading4', 'Heading in the 4th font size.'),
    icon: Heading4Icon,
    tooltip: t('edgeless.note.tooltip.heading4', 'Heading 4'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h5',
    name: t('edgeless.note.name.heading5', 'Heading 5'),
    description: t('edgeless.note.desc.heading5', 'Heading in the 5th font size.'),
    icon: Heading5Icon,
    tooltip: t('edgeless.note.tooltip.heading5', 'Heading 5'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'h6',
    name: t('edgeless.note.name.heading6', 'Heading 6'),
    description: t('edgeless.note.desc.heading6', 'Heading in the 6th font size.'),
    icon: Heading6Icon,
    tooltip: t('edgeless.note.tooltip.heading6', 'Heading 6'),
  },
  {
    flavour: 'affine:code',
    type: 'code',
    name: t('edgeless.note.name.codeBlock', 'Code Block'),
    description: t('edgeless.note.desc.codeBlock', 'Capture a code snippet.'),
    icon: CodeBlockIcon,
    tooltip: t('edgeless.note.tooltip.codeBlock', 'Code Block'),
  },
  {
    flavour: 'affine:paragraph',
    type: 'quote',
    name: t('edgeless.note.name.quote', 'Quote'),
    description: t('edgeless.note.desc.quote', 'Capture a quote.'),
    icon: QuoteIcon,
    tooltip: t('edgeless.note.tooltip.quote', 'Quote'),
  },
  {
    flavour: 'affine:divider',
    type: null,
    name: t('edgeless.note.name.divider', 'Divider'),
    description: t('edgeless.note.desc.divider', 'A visual divider.'),
    icon: DividerIcon,
    tooltip: t('edgeless.note.tooltip.divider', 'Divider'),
  },
];

// TODO: add image, bookmark, database blocks
export const NOTE_MENU_ITEMS = TEXT_ITEMS.concat(LIST_ITEMS)
  .filter(item => item.name !== 'Divider')
  .map(item => {
    return {
      icon: item.icon,
      // keep i18n text; only strip legacy prefix if present
      tooltip: item.tooltip.replace('Drag/Click to insert ', ''),
      childFlavour: item.flavour as NoteChildrenFlavour,
      childType: item.type,
    } as NoteMenuItem;
  });
