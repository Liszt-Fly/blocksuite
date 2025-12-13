import { LatexBlockComponent } from './latex-block';

export function effects() {
  if (!customElements.get('affine-latex')) {
    customElements.define('affine-latex', LatexBlockComponent);
  }
}
