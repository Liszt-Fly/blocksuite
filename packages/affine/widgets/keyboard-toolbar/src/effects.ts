import {
  AFFINE_KEYBOARD_TOOLBAR_WIDGET,
  AffineKeyboardToolbarWidget,
} from './index.js';
import {
  AFFINE_KEYBOARD_TOOL_PANEL,
  AffineKeyboardToolPanel,
} from './keyboard-tool-panel.js';
import {
  AFFINE_KEYBOARD_TOOLBAR,
  AffineKeyboardToolbar,
} from './keyboard-toolbar.js';

export function effects() {
  if (!customElements.get(AFFINE_KEYBOARD_TOOLBAR_WIDGET)) {
    customElements.define(
      AFFINE_KEYBOARD_TOOLBAR_WIDGET,
      AffineKeyboardToolbarWidget
    );
  }
  if (!customElements.get(AFFINE_KEYBOARD_TOOLBAR)) {
    customElements.define(AFFINE_KEYBOARD_TOOLBAR, AffineKeyboardToolbar);
  }
  if (!customElements.get(AFFINE_KEYBOARD_TOOL_PANEL)) {
    customElements.define(AFFINE_KEYBOARD_TOOL_PANEL, AffineKeyboardToolPanel);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AFFINE_KEYBOARD_TOOLBAR]: AffineKeyboardToolbar;
    [AFFINE_KEYBOARD_TOOL_PANEL]: AffineKeyboardToolPanel;
  }
}
