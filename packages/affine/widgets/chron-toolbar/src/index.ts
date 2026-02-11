import { WidgetViewExtension } from '@blocksuite/std';
import { literal, unsafeStatic } from 'lit/static-html.js';

import { CHRON_TOOLBAR_WIDGET } from './toolbar';

export * from './toolbar';

export const chronToolbarWidget = WidgetViewExtension(
  'affine:page',
  CHRON_TOOLBAR_WIDGET,
  literal`${unsafeStatic(CHRON_TOOLBAR_WIDGET)}`
);
