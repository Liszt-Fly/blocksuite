import { CalloutBlockModel } from '@blocksuite/affine-model';
import { focusBlockEnd } from '@blocksuite/affine-shared/commands';
import { FeatureFlagService, I18nProvider } from '@blocksuite/affine-shared/services';
import {
  findAncestorModel,
  isInsideBlockByFlavour,
  matchModels,
} from '@blocksuite/affine-shared/utils';
import { type SlashMenuConfig } from '@blocksuite/affine-widget-slash-menu';
import { FontIcon } from '@blocksuite/icons/lit';

import { calloutTooltip } from './tooltips';

export const calloutSlashMenuConfig: SlashMenuConfig = {
  disableWhen: ({ model }) => {
    return (
      findAncestorModel(model, ancestor =>
        matchModels(ancestor, [CalloutBlockModel])
      ) !== null
    );
  },
  items: ({ std }) => {
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string) => string = i18n?.t ?? (k => k);
    const tt = (key: string, fb: string) => (t(key) === key ? fb : t(key));
    const group = tt('slash.group.basic', 'Basic');
    return [
      {
        name: tt('slash.callout.title', 'Callout'),
        description: tt('slash.callout.desc', 'Let your words stand out.'),
        icon: FontIcon(),
        tooltip: {
          figure: calloutTooltip,
          caption: 'Callout',
        },
        searchAlias: ['callout'],
        group: `0_${group}@9`,
        when: ({ std, model }) => {
          return (
            std.get(FeatureFlagService).getFlag('enable_callout') &&
            !isInsideBlockByFlavour(model.store, model, 'affine:edgeless-text')
          );
        },
        action: ({ model, std }) => {
          const { store } = model;
          const parent = store.getParent(model);
          if (!parent) return;

          const index = parent.children.indexOf(model);
          if (index === -1) return;
          const calloutId = store.addBlock(
            'affine:callout',
            {},
            parent,
            index + 1
          );
          if (!calloutId) return;
          const paragraphId = store.addBlock('affine:paragraph', {}, calloutId);
          if (!paragraphId) return;
          std.host.updateComplete
            .then(() => {
              const paragraph = std.view.getBlock(paragraphId);
              if (!paragraph) return;
              std.command.exec(focusBlockEnd, {
                focusBlock: paragraph,
              });
            })
            .catch(console.error);
        },
      },
    ];
  },
};
