import { SurfaceRefPlaceHolder, SurfaceRefToolbarTitle } from './components';
import { SurfaceRefGenericBlockPortal } from './portal/generic-block';
import { SurfaceRefNotePortal } from './portal/note';
import { SurfaceRefBlockComponent } from './surface-ref-block';
import { EdgelessSurfaceRefBlockComponent } from './surface-ref-block-edgeless';

export function effects() {
  if (!customElements.get('surface-ref-generic-block-portal')) {
    customElements.define(
      'surface-ref-generic-block-portal',
      SurfaceRefGenericBlockPortal
    );
  }
  if (!customElements.get('affine-surface-ref')) {
    customElements.define('affine-surface-ref', SurfaceRefBlockComponent);
  }
  if (!customElements.get('affine-edgeless-surface-ref')) {
    customElements.define(
      'affine-edgeless-surface-ref',
      EdgelessSurfaceRefBlockComponent
    );
  }
  if (!customElements.get('surface-ref-note-portal')) {
    customElements.define('surface-ref-note-portal', SurfaceRefNotePortal);
  }
  if (!customElements.get('surface-ref-toolbar-title')) {
    customElements.define('surface-ref-toolbar-title', SurfaceRefToolbarTitle);
  }
  if (!customElements.get('surface-ref-placeholder')) {
    customElements.define('surface-ref-placeholder', SurfaceRefPlaceHolder);
  }
}
