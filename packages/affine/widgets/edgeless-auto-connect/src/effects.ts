import {
  AFFINE_EDGELESS_AUTO_CONNECT_WIDGET,
  EdgelessAutoConnectWidget,
} from '.';

export function effects() {
  if (!customElements.get(AFFINE_EDGELESS_AUTO_CONNECT_WIDGET)) {
    customElements.define(
      AFFINE_EDGELESS_AUTO_CONNECT_WIDGET,
      EdgelessAutoConnectWidget
    );
  }
}
