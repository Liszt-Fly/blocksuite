import { CodeBlockComponent } from './code-block';
import {
  AFFINE_CODE_TOOLBAR_WIDGET,
  AffineCodeToolbarWidget,
} from './code-toolbar';
import { AffineCodeToolbar } from './code-toolbar/components/code-toolbar';
import { LanguageListButton } from './code-toolbar/components/lang-button';
import { PreviewButton } from './code-toolbar/components/preview-button';
import { AffineCodeUnit } from './highlight/affine-code-unit';

export function effects() {
  if (!customElements.get('language-list-button')) {
    customElements.define('language-list-button', LanguageListButton);
  }
  if (!customElements.get('affine-code-toolbar')) {
    customElements.define('affine-code-toolbar', AffineCodeToolbar);
  }
  if (!customElements.get(AFFINE_CODE_TOOLBAR_WIDGET)) {
    customElements.define(AFFINE_CODE_TOOLBAR_WIDGET, AffineCodeToolbarWidget);
  }
  if (!customElements.get('affine-code-unit')) {
    customElements.define('affine-code-unit', AffineCodeUnit);
  }
  if (!customElements.get('affine-code')) {
    customElements.define('affine-code', CodeBlockComponent);
  }
  if (!customElements.get('preview-button')) {
    customElements.define('preview-button', PreviewButton);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'language-list-button': LanguageListButton;
    'affine-code-toolbar': AffineCodeToolbar;
    'preview-button': PreviewButton;
    [AFFINE_CODE_TOOLBAR_WIDGET]: AffineCodeToolbarWidget;
  }
}
