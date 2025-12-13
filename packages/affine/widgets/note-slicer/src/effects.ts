import { NOTE_SLICER_WIDGET, NoteSlicer } from './note-slicer';

export function effects() {
  if (!customElements.get(NOTE_SLICER_WIDGET)) {
    customElements.define(NOTE_SLICER_WIDGET, NoteSlicer);
  }
}
