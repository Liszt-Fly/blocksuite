import { EdgelessToolIconButton } from './button/tool-icon-button';
import { EdgelessToolbarButton } from './button/toolbar-button';
import {
  EDGELESS_TOOLBAR_WIDGET,
  EdgelessToolbarWidget,
} from './edgeless-toolbar';
import { EdgelessSlideMenu } from './menu/slide-menu';
import { ToolbarArrowUpIcon } from './menu/toolbar-arrow-up-icon';
import { EdgelessFontFamilyPanel } from './panel/font-family-panel';
import { EdgelessFontWeightAndStylePanel } from './panel/font-weight-and-style-panel';

export function effects() {
  if (!customElements.get(EDGELESS_TOOLBAR_WIDGET)) {
    customElements.define(EDGELESS_TOOLBAR_WIDGET, EdgelessToolbarWidget);
  }
  if (!customElements.get('edgeless-toolbar-button')) {
    customElements.define('edgeless-toolbar-button', EdgelessToolbarButton);
  }
  if (!customElements.get('edgeless-tool-icon-button')) {
    customElements.define('edgeless-tool-icon-button', EdgelessToolIconButton);
  }
  if (!customElements.get('edgeless-font-weight-and-style-panel')) {
    customElements.define(
      'edgeless-font-weight-and-style-panel',
      EdgelessFontWeightAndStylePanel
    );
  }
  if (!customElements.get('edgeless-font-family-panel')) {
    customElements.define(
      'edgeless-font-family-panel',
      EdgelessFontFamilyPanel
    );
  }
  if (!customElements.get('edgeless-slide-menu')) {
    customElements.define('edgeless-slide-menu', EdgelessSlideMenu);
  }
  if (!customElements.get('toolbar-arrow-up-icon')) {
    customElements.define('toolbar-arrow-up-icon', ToolbarArrowUpIcon);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-tool-icon-button': EdgelessToolIconButton;
    'edgeless-toolbar-button': EdgelessToolbarButton;
    'edgeless-toolbar-widget': EdgelessToolbarWidget;
    'edgeless-font-weight-and-style-panel': EdgelessFontWeightAndStylePanel;
    'edgeless-font-family-panel': EdgelessFontFamilyPanel;
    'edgeless-slide-menu': EdgelessSlideMenu;
    'toolbar-arrow-up-icon': ToolbarArrowUpIcon;
  }
}
