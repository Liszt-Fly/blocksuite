import { CHRON_CHANGE_FLAVOUR, CHRON_CHANGELOG_FLAVOUR } from '@blocksuite/affine-model'
import { BlockViewExtension, FlavourExtension } from '@blocksuite/std'
import type { ExtensionType } from '@blocksuite/store'
import { literal } from 'lit/static-html.js'

export const ChronDiffBlockSpec: ExtensionType[] = [
  FlavourExtension(CHRON_CHANGELOG_FLAVOUR),
  BlockViewExtension(CHRON_CHANGELOG_FLAVOUR, literal`chron-changelog-block`),
  FlavourExtension(CHRON_CHANGE_FLAVOUR),
  BlockViewExtension(CHRON_CHANGE_FLAVOUR, literal`chron-change-block`),

  // Legacy safety net: unknown blocks should not crash rendering.
  FlavourExtension('affine:diff'),
  BlockViewExtension('affine:diff', literal`chron-legacy-affine-diff-block`),
].flat()
