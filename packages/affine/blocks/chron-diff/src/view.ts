import { ViewExtensionProvider, type ViewExtensionContext } from '@blocksuite/affine-ext-loader'

import { ChronDiffBlockSpec } from './chron-spec'
import { effects } from './effects'
import { chronDiffNavigatorWidget } from './chron-diff-navigator-widget'

export class ChronDiffViewExtension extends ViewExtensionProvider {
  override name = 'chron-diff'

  override effect() {
    super.effect()
    effects()
  }

  override setup(context: ViewExtensionContext) {
    super.setup(context)
    context.register(ChronDiffBlockSpec)
    context.register(chronDiffNavigatorWidget)
  }
}
