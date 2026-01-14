import { BlockComponent } from '@blocksuite/std'
import { nothing } from 'lit'

export class ChronHiddenBlockComponent extends BlockComponent {
  override connectedCallback(): void {
    super.connectedCallback()
    this.style.display = 'none'
  }

  override render() {
    return nothing
  }
}

