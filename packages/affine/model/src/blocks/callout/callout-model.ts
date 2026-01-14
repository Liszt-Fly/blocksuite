import {
  BlockModel,
  BlockSchemaExtension,
  defineBlockSchema,
  type Text,
} from '@blocksuite/store';

import type { BlockMeta } from '../../utils/types';

export type CalloutProps = {
  emoji: string;
  text: Text;
} & BlockMeta;

export const CalloutBlockSchema = defineBlockSchema({
  flavour: 'affine:callout',
  props: (internal): CalloutProps => ({
    emoji: '😀',
    text: internal.Text(),
    'meta:createdAt': undefined,
    'meta:updatedAt': undefined,
    'meta:createdBy': undefined,
    'meta:updatedBy': undefined,
  }),
  metadata: {
    version: 1,
    role: 'hub',
    parent: [
      'affine:note',
      'chron:change',
      'affine:database',
      'affine:paragraph',
      'affine:list',
      'affine:edgeless-text',
      'affine:transcription',
    ],
    // Allow track-changes wrapper blocks inside callout content.
    children: ['affine:paragraph', 'affine:list', 'chron:change'],
  },
  toModel: () => new CalloutBlockModel(),
});

export class CalloutBlockModel extends BlockModel<CalloutProps> {}

export const CalloutBlockSchemaExtension =
  BlockSchemaExtension(CalloutBlockSchema);
