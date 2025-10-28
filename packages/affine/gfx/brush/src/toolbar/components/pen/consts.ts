import {
  EdgelessBrushDarkIcon,
  EdgelessBrushLightIcon,
  EdgelessHighlighterDarkIcon,
  EdgelessHighlighterLightIcon,
} from './icons';
import type { Pen } from './types';
import { t } from '@blocksuite/affine-shared/utils';

export const penIconMap = {
  dark: {
    brush: EdgelessBrushDarkIcon,
    highlighter: EdgelessHighlighterDarkIcon,
  },
  light: {
    brush: EdgelessBrushLightIcon,
    highlighter: EdgelessHighlighterLightIcon,
  },
};

export const penInfoMap: { [k in Pen]: { tip: string; shortcut: string } } = {
  brush: {
    tip: t('edgeless.pen.pen', 'Pen'),
    shortcut: 'P',
  },
  highlighter: {
    tip: t('edgeless.pen.highlighter', 'Highlighter'),
    shortcut: '⇧ P',
  },
};
