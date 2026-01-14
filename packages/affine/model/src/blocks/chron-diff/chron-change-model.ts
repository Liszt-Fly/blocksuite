import { BlockModel, BlockSchemaExtension, defineBlockSchema } from '@blocksuite/store'

export const CHRON_CHANGE_FLAVOUR = 'chron:change'

export type ChronChangeOp = 'create' | 'update' | 'delete'
export type ChronActor = 'ai' | 'user' | 'system'

export type ChronBlockSnapshotLite = {
  flavour: string
  text?: string
  props?: Record<string, any>
  hash?: string
}

export type ChronChangeProps = {
  version: number
  op: ChronChangeOp
  status: 'pending' | 'accepted' | 'rejected'
  ts: number
  actor: ChronActor
  source: string
  noteUuid: string
  commitId: string
  hunkId: string

  targetBlockId: string
  parentBlockId: string
  index: number
  afterBlockId: string

  oldBlockId: string
  newBlockId: string

  // Store snapshots as JSON strings to avoid CRDT content-type issues.
  hasBefore: boolean
  hasAfter: boolean
  beforeJson: string
  afterJson: string

  revertOf: string
}

export const ChronChangeBlockSchema = defineBlockSchema({
  flavour: CHRON_CHANGE_FLAVOUR,
  props: (): ChronChangeProps => ({
    version: 1,
    op: 'update',
    status: 'pending',
    ts: 0,
    actor: 'ai',
    source: '',
    noteUuid: '',
    commitId: '',
    hunkId: '',

    targetBlockId: '',
    parentBlockId: '',
    index: -1,
    afterBlockId: '',

    oldBlockId: '',
    newBlockId: '',

    hasBefore: false,
    hasAfter: false,
    beforeJson: '',
    afterJson: '',

    revertOf: '',
  }),
  metadata: {
    version: 1,
    // Treat change wrapper as a content block so it can live under parents that accept '@content' (e.g. affine:note).
    role: 'content',
    parent: ['*'],
    children: ['*'],
  },
  toModel: () => new ChronChangeBlockModel(),
})

export const ChronChangeBlockSchemaExtension = BlockSchemaExtension(ChronChangeBlockSchema)

export class ChronChangeBlockModel extends BlockModel<ChronChangeProps> {}
