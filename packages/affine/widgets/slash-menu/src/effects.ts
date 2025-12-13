import { AFFINE_SLASH_MENU_WIDGET } from './consts';
import { InnerSlashMenu, SlashMenu } from './slash-menu-popover';
import { AffineSlashMenuWidget } from './widget';

export function effects() {
  if (!customElements.get(AFFINE_SLASH_MENU_WIDGET)) {
    customElements.define(AFFINE_SLASH_MENU_WIDGET, AffineSlashMenuWidget);
  }
  if (!customElements.get('affine-slash-menu')) {
    customElements.define('affine-slash-menu', SlashMenu);
  }
  if (!customElements.get('inner-slash-menu')) {
    customElements.define('inner-slash-menu', InnerSlashMenu);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AFFINE_SLASH_MENU_WIDGET]: AffineSlashMenuWidget;
  }
}
