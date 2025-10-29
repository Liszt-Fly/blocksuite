import { EdgelessFrameManagerIdentifier } from '@blocksuite/affine-block-frame';
import { EdgelessCRUDExtension } from '@blocksuite/affine-block-surface';
import { MindmapStyle, SurfaceRefBlockSchema } from '@blocksuite/affine-model';
import {
  type SlashMenuActionItem,
  type SlashMenuConfig,
  SlashMenuConfigExtension,
  type SlashMenuItem,
} from '@blocksuite/affine-widget-slash-menu';
import { I18nProvider } from '@blocksuite/affine-shared/services';
import { Bound } from '@blocksuite/global/gfx';
import { FrameIcon, GroupingIcon, MindmapIcon } from '@blocksuite/icons/lit';
import { BlockSelection } from '@blocksuite/std';
import { GfxControllerIdentifier } from '@blocksuite/std/gfx';

import { insertSurfaceRefBlockCommand } from '../commands';
import { EdgelessTooltip, FrameTooltip, MindMapTooltip } from './tooltips';

const surfaceRefSlashMenuConfig: SlashMenuConfig = {
  items: ({ std, model }) => {
    // i18n helper with graceful fallback to original strings
    const i18n = std.getOptional?.(I18nProvider);
    const t: (key: string, params?: Record<string, unknown>) => string =
      i18n?.t ?? (k => k);
    const tt = (key: string, fallback: string) => {
      const v = t(key);
      return v === key ? fallback : v;
    };
    const crud = std.get(EdgelessCRUDExtension);
    const frameMgr = std.get(EdgelessFrameManagerIdentifier);

    const findSpace = (bound: Bound, padding = 20) => {
      const gfx = std.get(GfxControllerIdentifier);
      let elementInFrameBound = gfx.grid.search(bound);
      while (elementInFrameBound.length > 0) {
        const rightElement = elementInFrameBound.reduce((a, b) => {
          return a.x + a.w > b.x + b.w ? a : b;
        });
        bound.x = rightElement.x + rightElement.w + padding;
        elementInFrameBound = gfx.grid.search(bound);
      }
      return bound;
    };

    const insertSurfaceRefAndSelect = (reference: string) => {
      const [_, result] = std.command.exec(insertSurfaceRefBlockCommand, {
        reference,
        place: 'after',
        removeEmptyLine: true,
        selectedModels: [model],
      });
      if (!result.insertedSurfaceRefBlockId) return;

      std.selection.set([
        std.selection.create(BlockSelection, {
          blockId: result.insertedSurfaceRefBlockId,
        }),
      ]);
    };

    let index = 0;
    // Reuse existing app locales: slash.group.edgeless
    const groupEdgeless = tt('slash.group.edgeless', 'Edgeless Element');

    const insertBlankFrameItem: SlashMenuItem = {
      name: tt('slash.edgeless.frame', 'Frame'),
      description: tt('slash.edgeless.frame.desc', 'Insert a blank frame'),
      icon: FrameIcon(),
      tooltip: {
        figure: FrameTooltip,
        // keep caption simple; can be translated later if desired
        caption: tt('slash.edgeless.frame', 'Frame'),
      },
      group: `5_${groupEdgeless}@${index++}`,
      action: () => {
        const frameBound = findSpace(Bound.fromXYWH([0, 0, 1600, 900]));
        const frame = frameMgr.createFrameOnBound(frameBound);
        insertSurfaceRefAndSelect(frame.id);
      },
    };

    const insertMindMapItem: SlashMenuItem = {
      name: tt('slash.edgeless.mindMap', 'Mind Map'),
      description: tt('slash.edgeless.mindMap.desc', 'Insert a mind map'),
      icon: MindmapIcon(),
      tooltip: {
        figure: MindMapTooltip,
        caption: tt('edgeless.nav.mindmap', 'Mind Map'),
      },
      group: `5_${groupEdgeless}@${index++}`,
      action: () => {
        const bound = findSpace(Bound.fromXYWH([0, 0, 200, 200]), 150);
        const { x, y, h } = bound;

        const rootW = 145;
        const rootH = 50;

        const nodeW = 80;
        const nodeH = 35;

        const centerVertical = y + h / 2;
        const rootX = x;
        const rootY = centerVertical - rootH / 2;

        type MindMapNode = {
          children: MindMapNode[];
          text: string;
          xywh: string;
        };

        const root: MindMapNode = {
          children: [],
          text: tt('slash.edgeless.mindMap', 'Mind Map'),
          xywh: `[${rootX},${rootY},${rootW},${rootH}]`,
        };

        for (let i = 0; i < 3; i++) {
          const nodeX = x + rootW + 300;
          const nodeY = centerVertical - nodeH / 2 + (i - 1) * 50;
          root.children.push({
            children: [],
            text: tt('common.text', 'Text'),
            xywh: `[${nodeX},${nodeY},${nodeW},${nodeH}]`,
          });
        }

        const mindmapId = crud.addElement('mindmap', {
          style: MindmapStyle.ONE,
          children: root,
        });
        if (!mindmapId) return;

        insertSurfaceRefAndSelect(mindmapId);
      },
    };

    const frameItems = frameMgr.frames.map<SlashMenuActionItem>(frameModel => ({
      name:
        ((): string => {
          const title = String(frameModel.props.title ?? '');
          const tpl = t('slash.edgeless.frameWithTitle', { title });
          return tpl === 'slash.edgeless.frameWithTitle'
            ? `${tt('slash.edgeless.frame', 'Frame')}: ${title}`
            : tpl;
        })(),
      icon: FrameIcon(),
      group: `5_${groupEdgeless}@${index++}`,
      tooltip: {
        figure: EdgelessTooltip,
        caption: tt('edgeless.toolbar.frame', 'Frame'),
      },
      action: () => {
        insertSurfaceRefAndSelect(frameModel.id);
      },
    }));

    const groupElements = crud.getElementsByType('group');
    const groupItems = groupElements.map<SlashMenuActionItem>(group => ({
      name:
        ((): string => {
          const title = group.title.toString();
          const tpl = t('slash.edgeless.groupWithTitle', { title });
          return tpl === 'slash.edgeless.groupWithTitle'
            ? `${tt('slash.edgeless.group', 'Group')}: ${title}`
            : tpl;
        })(),
      icon: GroupingIcon(),
      group: `5_${groupEdgeless}@${index++}`,
      tooltip: {
        figure: EdgelessTooltip,
        caption: tt('edgeless.toolbar.group', 'Group'),
      },
      action: () => {
        insertSurfaceRefAndSelect(group.id);
      },
    }));

    return [
      insertBlankFrameItem,
      insertMindMapItem,
      ...frameItems,
      ...groupItems,
    ];
  },
};

export const SurfaceRefSlashMenuConfigExtension = SlashMenuConfigExtension(
  SurfaceRefBlockSchema.model.flavour,
  surfaceRefSlashMenuConfig
);
