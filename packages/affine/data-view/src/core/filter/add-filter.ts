import {
  menu,
  popMenu,
  type PopupTarget,
} from '@blocksuite/affine-components/context-menu';
import { AddCursorIcon } from '@blocksuite/icons/lit';
import type { Middleware } from '@floating-ui/dom';
import type { ReadonlySignal } from '@preact/signals-core';
import { tt } from '../utils/i18n.js';

import type { Variable } from '../expression/index.js';
import { renderUniLit } from '../utils/index.js';
import type { Filter } from './types.js';
import { firstFilterByRef, firstFilterInGroup } from './utils.js';

export const popCreateFilter = (
  target: PopupTarget,
  props: {
    vars: ReadonlySignal<Variable[]>;
    onSelect: (filter: Filter) => void;
    onClose?: () => void;
    onBack?: () => void;
    t?: (key: string, fb: string) => string;
  },
  ops?: {
    middleware?: Middleware[];
  }
) => {
  const t = props.t ?? ((_: string, fb: string) => fb);
  popMenu(target, {
    middleware: ops?.middleware,
    options: {
      onClose: props.onClose,
      title: {
        onBack: props.onBack,
        text: t('database.filter.new', 'New filter'),
      },
      items: [
        menu.group({
          items: props.vars.value.map(v =>
            menu.action({
              name: v.name,
              prefix: renderUniLit(v.icon, {}),
              select: () => {
                props.onSelect(
                  firstFilterByRef(props.vars.value, {
                    type: 'ref',
                    name: v.id,
                  })
                );
              },
            })
          ),
        }),
        menu.group({
          name: '',
          items: [
            menu.action({
              name: t('database.filter.addGroup', 'Add filter group'),
              prefix: AddCursorIcon(),
              select: () => {
                props.onSelect(firstFilterInGroup(props.vars.value));
              },
            }),
          ],
        }),
      ],
    },
  });
};
