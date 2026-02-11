import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@blocksuite/affine-ext-loader';

import { chronToolbarWidget } from '.';
import { effects } from './effects';

export class ToolbarViewExtension extends ViewExtensionProvider {
  override name = 'chron-toolbar-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isMobile(context.scope)) return;
    context.register(chronToolbarWidget);
  }
}
