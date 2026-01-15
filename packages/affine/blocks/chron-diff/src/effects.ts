import { ChronHiddenBlockComponent } from './chron-hidden-block'
import { ChronChangeBlockComponent } from './chron-change-block'
import { CHRON_DIFF_NAVIGATOR_WIDGET, ChronDiffNavigatorWidget } from './chron-diff-navigator-widget'

class ChronChangelogBlockComponent extends ChronHiddenBlockComponent {}
class ChronLegacyAffineDiffBlockComponent extends ChronHiddenBlockComponent {}

export function effects() {
  if (typeof customElements === 'undefined') return

  if (!customElements.get('chron-changelog-block')) {
    customElements.define('chron-changelog-block', ChronChangelogBlockComponent)
  }
  if (!customElements.get('chron-change-block')) {
    customElements.define('chron-change-block', ChronChangeBlockComponent)
  }
  if (!customElements.get(CHRON_DIFF_NAVIGATOR_WIDGET)) {
    customElements.define(CHRON_DIFF_NAVIGATOR_WIDGET, ChronDiffNavigatorWidget)
  }
  // Legacy safety net: some docs may contain unknown 'affine:diff' blocks.
  if (!customElements.get('chron-legacy-affine-diff-block')) {
    customElements.define('chron-legacy-affine-diff-block', ChronLegacyAffineDiffBlockComponent)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chron-changelog-block': ChronChangelogBlockComponent
    'chron-change-block': ChronChangeBlockComponent
    'chron-legacy-affine-diff-block': ChronLegacyAffineDiffBlockComponent
  }
}
