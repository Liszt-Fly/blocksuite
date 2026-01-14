import { StoreExtensionProvider, type StoreExtensionContext } from '@blocksuite/affine-ext-loader'
import {
  AffineLegacyDiffBlockSchemaExtension,
  ChronChangeBlockSchemaExtension,
  ChronChangelogBlockSchemaExtension
} from '@blocksuite/affine-model'

export class ChronDiffStoreExtension extends StoreExtensionProvider {
  override name = 'chron-diff'

  override setup(context: StoreExtensionContext) {
    super.setup(context)
    context.register(AffineLegacyDiffBlockSchemaExtension)
    context.register(ChronChangelogBlockSchemaExtension)
    context.register(ChronChangeBlockSchemaExtension)
  }
}
