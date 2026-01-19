import { WidgetViewExtension } from '@blocksuite/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { AFFINE_DOC_SEARCH_WIDGET } from './consts';

export * from './consts';
export * from './widget';

export const docSearchWidget = WidgetViewExtension(
  'affine:page',
  AFFINE_DOC_SEARCH_WIDGET,
  literal`${unsafeStatic(AFFINE_DOC_SEARCH_WIDGET)}`
);
