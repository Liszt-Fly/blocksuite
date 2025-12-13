import { EdgelessFrameMenu, EdgelessFrameToolButton } from './edgeless-toolbar';
import { PresentationToolbar } from './edgeless-toolbar/presentation-toolbar';
import { FrameBlockComponent } from './frame-block';
import { EdgelessFrameOrderButton } from './present/frame-order-button';
import { EdgelessFrameOrderMenu } from './present/frame-order-menu';
import {
  EDGELESS_NAVIGATOR_BLACK_BACKGROUND_WIDGET,
  EdgelessNavigatorBlackBackgroundWidget,
} from './present/navigator-bg-widget';
import { EdgelessNavigatorSettingButton } from './present/navigator-setting-button';
import { EdgelessPresentButton } from './present/present-button';

export function effects() {
  if (!customElements.get('affine-frame')) {
    customElements.define('affine-frame', FrameBlockComponent);
  }
  if (!customElements.get('edgeless-frame-tool-button')) {
    customElements.define(
      'edgeless-frame-tool-button',
      EdgelessFrameToolButton
    );
  }
  if (!customElements.get('edgeless-frame-menu')) {
    customElements.define('edgeless-frame-menu', EdgelessFrameMenu);
  }
  if (!customElements.get('edgeless-frame-order-button')) {
    customElements.define(
      'edgeless-frame-order-button',
      EdgelessFrameOrderButton
    );
  }
  if (!customElements.get('edgeless-frame-order-menu')) {
    customElements.define('edgeless-frame-order-menu', EdgelessFrameOrderMenu);
  }
  if (!customElements.get('edgeless-navigator-setting-button')) {
    customElements.define(
      'edgeless-navigator-setting-button',
      EdgelessNavigatorSettingButton
    );
  }
  if (!customElements.get('edgeless-present-button')) {
    customElements.define('edgeless-present-button', EdgelessPresentButton);
  }
  if (!customElements.get('presentation-toolbar')) {
    customElements.define('presentation-toolbar', PresentationToolbar);
  }
  // Navigation components
  if (!customElements.get(EDGELESS_NAVIGATOR_BLACK_BACKGROUND_WIDGET)) {
    customElements.define(
      EDGELESS_NAVIGATOR_BLACK_BACKGROUND_WIDGET,
      EdgelessNavigatorBlackBackgroundWidget
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-frame': FrameBlockComponent;
    'edgeless-frame-tool-button': EdgelessFrameToolButton;
    'edgeless-frame-menu': EdgelessFrameMenu;
    'edgeless-frame-order-button': EdgelessFrameOrderButton;
    'edgeless-frame-order-menu': EdgelessFrameOrderMenu;
    'edgeless-navigator-setting-button': EdgelessNavigatorSettingButton;
    'edgeless-present-button': EdgelessPresentButton;
    'presentation-toolbar': PresentationToolbar;
    'edgeless-navigator-black-background': EdgelessNavigatorBlackBackgroundWidget;
  }
}
