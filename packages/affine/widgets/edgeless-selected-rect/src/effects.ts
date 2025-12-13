import { EdgelessAutoCompletePanel } from './auto-complete-panel';
import { EdgelessAutoComplete } from './edgeless-auto-complete';
import {
  EDGELESS_SELECTED_RECT_WIDGET,
  EdgelessSelectedRectWidget,
} from './edgeless-selected-rect';

export function effects() {
  if (!customElements.get('edgeless-auto-complete-panel')) {
    customElements.define(
      'edgeless-auto-complete-panel',
      EdgelessAutoCompletePanel
    );
  }
  if (!customElements.get('edgeless-auto-complete')) {
    customElements.define('edgeless-auto-complete', EdgelessAutoComplete);
  }
  if (!customElements.get(EDGELESS_SELECTED_RECT_WIDGET)) {
    customElements.define(
      EDGELESS_SELECTED_RECT_WIDGET,
      EdgelessSelectedRectWidget
    );
  }
}
