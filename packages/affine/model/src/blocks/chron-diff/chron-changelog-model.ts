import { BlockModel, BlockSchemaExtension, defineBlockSchema } from '@blocksuite/store'

import { CHRON_CHANGE_FLAVOUR } from './chron-change-model'

export const CHRON_CHANGELOG_FLAVOUR = 'chron:changelog'

export type ChronChangelogProps = {
  version: number
  noteUuid: string
  createdAt: number
}

export const ChronChangelogBlockSchema = defineBlockSchema({
  flavour: CHRON_CHANGELOG_FLAVOUR,
  props: (): ChronChangelogProps => ({
    version: 1,
    noteUuid: '',
    createdAt: 0,
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: ['affine:page'],
    children: [CHRON_CHANGE_FLAVOUR],
  },
  toModel: () => new ChronChangelogBlockModel(),
})

export const ChronChangelogBlockSchemaExtension = BlockSchemaExtension(ChronChangelogBlockSchema)

export class ChronChangelogBlockModel extends BlockModel<ChronChangelogProps> {}

