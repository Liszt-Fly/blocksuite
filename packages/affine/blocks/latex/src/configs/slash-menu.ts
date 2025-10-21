import { insertInlineLatex } from '@blocksuite/affine-inline-latex';
import {
  getSelectedModelsCommand,
  getTextSelectionCommand,
} from '@blocksuite/affine-shared/commands';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import { TeXIcon } from '@blocksuite/icons/lit';

import { insertLatexBlockCommand } from '../commands';
import { LatexTooltip } from './tooltips';

export const latexSlashMenuConfig: SlashMenuConfig = {
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const groupBasic = tt('slash.group.basic', 'Basic');
    const groupMedia = tt('slash.group.media', 'Content & Media');
    return [
    {
      name: tt('slash.latex.inline', 'Inline equation'),
      group: `0_${groupBasic}@8`,
      description: tt('slash.latex.inline.desc', 'Create a inline equation.'),
      icon: TeXIcon(),
      tooltip: {
        figure: LatexTooltip(
          'Energy. Mass. Light. In a single equation,',
          'E=mc^2',
          false
        ),
        caption: 'Inline equation',
      },
      searchAlias: ['inlineMath, inlineEquation', 'inlineLatex'],
      action: ({ std }) => {
        std.command
          .chain()
          .pipe(getTextSelectionCommand)
          .pipe(insertInlineLatex)
          .run();
      },
    },
    {
      name: tt('slash.latex.block', 'Equation'),
      description: tt('slash.latex.block.desc', 'Create a equation block.'),
      icon: TeXIcon(),
      tooltip: {
        figure: LatexTooltip(
          'Create a equation via LaTeX.',
          String.raw`\frac{a}{b} \pm \frac{c}{d} = \frac{ad \pm bc}{bd}`,
          true
        ),
        caption: 'Equation',
      },
      searchAlias: ['mathBlock, equationBlock', 'latexBlock'],
      group: `4_${groupMedia}@10`,
      action: ({ std }) => {
        std.command
          .chain()
          .pipe(getSelectedModelsCommand)
          .pipe(insertLatexBlockCommand, {
            place: 'after',
            removeEmptyLine: true,
          })
          .run();
      },
    },
  ];
  },
};
