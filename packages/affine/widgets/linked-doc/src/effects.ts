import { AFFINE_LINKED_DOC_WIDGET } from './config.js';
import { ImportDoc } from './import-doc/import-doc.js';
import { Loader } from './import-doc/loader.js';
import { AffineLinkedDocWidget } from './index.js';
import { LinkedDocPopover } from './linked-doc-popover.js';
import { AffineMobileLinkedDocMenu } from './mobile-linked-doc-menu.js';

export function effects() {
  if (!customElements.get('affine-linked-doc-popover')) {
    customElements.define('affine-linked-doc-popover', LinkedDocPopover);
  }
  if (!customElements.get(AFFINE_LINKED_DOC_WIDGET)) {
    customElements.define(AFFINE_LINKED_DOC_WIDGET, AffineLinkedDocWidget);
  }
  if (!customElements.get('import-doc')) {
    customElements.define('import-doc', ImportDoc);
  }
  if (!customElements.get('affine-mobile-linked-doc-menu')) {
    customElements.define(
      'affine-mobile-linked-doc-menu',
      AffineMobileLinkedDocMenu
    );
  }
  if (!customElements.get('loader-element')) {
    customElements.define('loader-element', Loader);
  }
}
