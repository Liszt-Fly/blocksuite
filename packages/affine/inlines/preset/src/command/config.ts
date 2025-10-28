// Keep default icons only for fallback if needed; Phosphor webcomponents are used below
import { ItalicIcon, LinkIcon, StrikethroughIcon, UnderlineIcon } from '@blocksuite/affine-components/icons';
import { toggleLink } from '@blocksuite/affine-inline-link';
import { type EditorHost, TextSelection } from '@blocksuite/std';
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import {
  isTextAttributeActive,
  toggleBold,
  toggleCode,
  toggleItalic,
  toggleStrike,
  toggleUnderline,
} from './text-style.js';
import { t } from '@blocksuite/affine-shared/utils';

export interface TextFormatConfig {
  id: string;
  name: string;
  icon: TemplateResult<1>;
  hotkey?: string;
  activeWhen: (host: EditorHost) => boolean;
  action: (host: EditorHost) => void;
  textChecker?: (host: EditorHost) => boolean;
}

export const textFormatConfigs: TextFormatConfig[] = [
  {
    id: 'bold',
    name: t('toolbar.bold', 'Bold'),
    // Use Phosphor "text-b" icon (bold weight)
    icon: html`<ph-text-b size="16" weight="bold"></ph-text-b>`,
    hotkey: 'Mod-b',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'bold' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleBold).run();
    },
  },
  {
    id: 'italic',
    name: t('toolbar.italic', 'Italic'),
    icon: html`<ph-text-italic size="16" weight="bold"></ph-text-italic>`,
    hotkey: 'Mod-i',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'italic' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleItalic).run();
    },
  },
  {
    id: 'underline',
    name: t('toolbar.underline', 'Underline'),
    icon: html`<ph-text-underline size="16" weight="bold"></ph-text-underline>`,
    hotkey: 'Mod-u',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'underline' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleUnderline).run();
    },
  },
  {
    id: 'strike',
    name: t('toolbar.strike', 'Strikethrough'),
    icon: html`<ph-text-strikethrough size="16" weight="bold"></ph-text-strikethrough>`,
    hotkey: 'Mod-shift-s',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'strike' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleStrike).run();
    },
  },
  {
    id: 'code',
    name: t('toolbar.code', 'Code'),
    // Use Phosphor "code" icon (bold weight for thicker strokes)
    icon: html`<ph-code size="16" weight="bold"></ph-code>`,
    hotkey: 'Mod-e',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'code' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleCode).run();
    },
  },
  {
    id: 'link',
    name: t('toolbar.link', 'Link'),
    icon: html`<ph-link size="16" weight="bold"></ph-link>`,
    hotkey: 'Mod-k',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextAttributeActive, { key: 'link' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleLink).run();
    },
    // should check text length
    textChecker: host => {
      const textSelection = host.std.selection.find(TextSelection);
      if (!textSelection || textSelection.isCollapsed()) return false;

      return Boolean(
        textSelection.from.length + (textSelection.to?.length ?? 0)
      );
    },
  },
];
