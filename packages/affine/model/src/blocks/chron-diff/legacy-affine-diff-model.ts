import { BlockModel, BlockSchemaExtension, defineBlockSchema } from '@blocksuite/store'

export const AFFINE_LEGACY_DIFF_FLAVOUR = 'affine:diff'

export type AffineLegacyDiffProps = {
  version: number
}

export const AffineLegacyDiffBlockSchema = defineBlockSchema({
  flavour: AFFINE_LEGACY_DIFF_FLAVOUR,
  props: (): AffineLegacyDiffProps => ({
    version: 1,
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: ['*'],
    children: ['*'],
  },
  toModel: () => new AffineLegacyDiffBlockModel(),
})

export const AffineLegacyDiffBlockSchemaExtension = BlockSchemaExtension(AffineLegacyDiffBlockSchema)

export class AffineLegacyDiffBlockModel extends BlockModel<AffineLegacyDiffProps> {}

