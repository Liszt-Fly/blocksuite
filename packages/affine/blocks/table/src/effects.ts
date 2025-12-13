import { AddButton, AddButtonComponentName } from './add-button';
import { SelectionLayer, SelectionLayerComponentName } from './selection-layer';
import { TableBlockComponent, TableBlockComponentName } from './table-block';
import { TableCell, TableCellComponentName } from './table-cell';

export function effects() {
  if (!customElements.get(TableBlockComponentName)) {
    customElements.define(TableBlockComponentName, TableBlockComponent);
  }
  if (!customElements.get(TableCellComponentName)) {
    customElements.define(TableCellComponentName, TableCell);
  }
  if (!customElements.get(AddButtonComponentName)) {
    customElements.define(AddButtonComponentName, AddButton);
  }
  if (!customElements.get(SelectionLayerComponentName)) {
    customElements.define(SelectionLayerComponentName, SelectionLayer);
  }
}
