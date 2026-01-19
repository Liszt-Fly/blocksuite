import {
  type ViewExtensionContext,
  ViewExtensionProvider,
} from '@blocksuite/affine-ext-loader';

import { docSearchWidget } from './spec';
import { effects } from './effects';

export class DocSearchViewExtension extends ViewExtensionProvider {
  override name = 'affine-doc-search-widget';

  override effect() {
    super.effect();
    effects();
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context);
    if (this.isEdgeless(context.scope)) {
      return;
    }
    context.register(docSearchWidget);
  }
}
