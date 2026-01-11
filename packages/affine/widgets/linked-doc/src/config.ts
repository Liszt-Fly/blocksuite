import {
  ImportIcon,
  LinkedDocIcon,
  LinkedEdgelessIcon,
  NewDocIcon,
} from '@blocksuite/affine-components/icons';
import { toast } from '@blocksuite/affine-components/toast';
import { StoreExtensionManagerIdentifier } from '@blocksuite/affine-ext-loader';
import { insertLinkedNode, insertAtomNode } from '@blocksuite/affine-inline-reference';
import {
  DocModeProvider,
  TelemetryProvider,
} from '@blocksuite/affine-shared/services';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import {
  createDefaultDoc,
  isFuzzyMatch,
  type Signal,
} from '@blocksuite/affine-shared/utils';
import { IS_MOBILE } from '@blocksuite/global/env';
import {
  type BlockStdScope,
  ConfigExtensionFactory,
  type EditorHost,
} from '@blocksuite/std';
import type { InlineRange } from '@blocksuite/std/inline';
import type { TemplateResult } from 'lit';

import { showImportModal } from './import-doc/index.js';
import type { LinkedDocViewExtensionOptions } from './view';
import {
  searchAtoms,
  getAtomTypeIcon,
  getAtomTypeDisplayName,
  defaultAtomMenuConfig,
  type Atom,
  type AtomFetcher,
  type AtomMenuConfig,
} from './atom-menu.js';

// Re-export atom-menu types for external use
export type { Atom, AtomFetcher, AtomMenuConfig };

export type LinkedWidgetConfig = Required<
  Omit<LinkedDocViewExtensionOptions, 'autoFocusedItemKey'>
> &
  Pick<LinkedDocViewExtensionOptions, 'autoFocusedItemKey'>;

export type LinkedMenuItem = {
  key: string;
  name: string | TemplateResult<1>;
  icon: TemplateResult<1>;
  suffix?: string | TemplateResult<1>;
  // disabled?: boolean;
  action: LinkedMenuAction;
};

export type LinkedMenuAction = () => Promise<void> | void;

export type LinkedMenuGroup = {
  name: string;
  items: LinkedMenuItem[] | Signal<LinkedMenuItem[]>;
  styles?: string;
  // maximum quantity displayed by default
  maxDisplay?: number;
  // if the menu is loading
  loading?: boolean | Signal<boolean>;
  // copywriting when display quantity exceeds
  overflowText?: string | Signal<string>;
  // hide the group
  hidden?: boolean | Signal<boolean>;
};

export type LinkedDocContext = {
  std: BlockStdScope;
  inlineEditor: AffineInlineEditor;
  startRange: InlineRange;
  startNativeRange: Range;
  triggerKey: string;
  config: LinkedWidgetConfig;
  close: () => void;
};

const DEFAULT_DOC_NAME = 'Untitled';
const DISPLAY_NAME_LENGTH = 8;

export function createLinkedDocMenuGroup(
  query: string,
  abort: () => void,
  editorHost: EditorHost,
  inlineEditor: AffineInlineEditor
) {
  const doc = editorHost.store;
  const { docMetas } = doc.workspace.meta;
  const filteredDocList = docMetas
    .filter(({ id }) => id !== doc.id)
    .filter(({ title }) => isFuzzyMatch(title, query));
  const MAX_DOCS = 6;

  return {
    name: 'Link to Doc',
    items: filteredDocList.map(doc => ({
      key: doc.id,
      name: doc.title || DEFAULT_DOC_NAME,
      icon:
        editorHost.std.get(DocModeProvider).getPrimaryMode(doc.id) ===
        'edgeless'
          ? LinkedEdgelessIcon
          : LinkedDocIcon,
      action: () => {
        abort();
        insertLinkedNode({
          inlineEditor,
          docId: doc.id,
        });
        editorHost.std
          .getOptional(TelemetryProvider)
          ?.track('LinkedDocCreated', {
            control: 'linked doc',
            module: 'inline @',
            type: 'doc',
            other: 'existing doc',
          });
      },
    })),
    maxDisplay: MAX_DOCS,
    overflowText: `${filteredDocList.length - MAX_DOCS} more docs`,
  };
}

export function createNewDocMenuGroup(
  query: string,
  abort: () => void,
  editorHost: EditorHost,
  inlineEditor: AffineInlineEditor
): LinkedMenuGroup {
  const doc = editorHost.store;
  const docName = query || DEFAULT_DOC_NAME;
  const displayDocName =
    docName.slice(0, DISPLAY_NAME_LENGTH) +
    (docName.length > DISPLAY_NAME_LENGTH ? '..' : '');

  const items: LinkedMenuItem[] = [
    {
      key: 'create',
      name: `Create "${displayDocName}" doc`,
      icon: NewDocIcon,
      action: () => {
        abort();
        const docName = query;
        const newDoc = createDefaultDoc(doc.workspace, {
          title: docName,
        });
        insertLinkedNode({
          inlineEditor,
          docId: newDoc.id,
        });
        const telemetryService = editorHost.std.getOptional(TelemetryProvider);
        telemetryService?.track('LinkedDocCreated', {
          control: 'new doc',
          module: 'inline @',
          type: 'doc',
          other: 'new doc',
        });
        telemetryService?.track('DocCreated', {
          control: 'new doc',
          module: 'inline @',
          type: 'doc',
        });
      },
    },
  ];

  if (!IS_MOBILE) {
    items.push({
      key: 'import',
      name: 'Import',
      icon: ImportIcon,
      action: () => {
        abort();
        const onSuccess = (
          docIds: string[],
          options: {
            importedCount: number;
          }
        ) => {
          toast(
            editorHost,
            `Successfully imported ${options.importedCount} Doc${options.importedCount > 1 ? 's' : ''}.`
          );
          for (const docId of docIds) {
            insertLinkedNode({
              inlineEditor,
              docId,
            });
          }
        };
        const onFail = (message: string) => {
          toast(editorHost, message);
        };
        const storeManager = editorHost.std.get(
          StoreExtensionManagerIdentifier
        );
        showImportModal({
          collection: doc.workspace,
          schema: doc.schema,
          extensions: storeManager.get('store'),
          onSuccess,
          onFail,
        });
      },
    });
  }

  return {
    name: 'New Doc',
    items,
  };
}

export function getMenus(
  query: string,
  abort: () => void,
  editorHost: EditorHost,
  inlineEditor: AffineInlineEditor
): Promise<LinkedMenuGroup[]> {
  return Promise.resolve([
    createLinkedDocMenuGroup(query, abort, editorHost, inlineEditor),
    createNewDocMenuGroup(query, abort, editorHost, inlineEditor),
  ]);
}

/**
 * Create menu groups from atom search results
 * 
 * @param groupedAtoms - Map of atom type to array of atoms
 * @param abort - Function to close the menu
 * @param inlineEditor - The inline editor instance
 * @param editorHost - The editor host instance
 * @param config - Menu configuration
 * @returns Array of LinkedMenuGroup
 */
export function createAtomMenuGroups(
  groupedAtoms: Map<number, Atom[]>,
  abort: () => void,
  inlineEditor: AffineInlineEditor,
  editorHost: EditorHost,
  config: AtomMenuConfig = defaultAtomMenuConfig
): LinkedMenuGroup[] {
  const groups: LinkedMenuGroup[] = [];

  for (const [atomType, atoms] of groupedAtoms) {
    const displayAtoms = atoms.slice(0, config.maxDisplayPerType);
    const overflowCount = atoms.length - config.maxDisplayPerType;

    groups.push({
      name: getAtomTypeDisplayName(atomType),
      items: displayAtoms.map(atom => ({
        key: atom.id,
        name: atom.name || 'Untitled',
        icon: getAtomTypeIcon(atomType),
        action: () => {
          abort();
          insertAtomNode({
            inlineEditor,
            atomId: atom.id,
            atomType: atom.type,
            title: atom.name,
          });
          editorHost.std
            .getOptional(TelemetryProvider)
            ?.track('LinkedDocCreated', {
              control: 'linked atom',
              module: 'inline @',
              type: getAtomTypeDisplayName(atomType),
              other: 'existing atom',
            });
        },
      })),
      maxDisplay: config.maxDisplayPerType,
      overflowText: overflowCount > 0 ? `还有 ${overflowCount} 个` : undefined,
    });
  }

  return groups;
}

/**
 * Get menus with atom support
 * 
 * This function fetches atoms from the provided fetcher and creates menu groups.
 * If the fetcher fails or returns empty results, it falls back to the default doc menu.
 * 
 * @param query - Search query string
 * @param abort - Function to close the menu
 * @param editorHost - The editor host instance
 * @param inlineEditor - The inline editor instance
 * @param atomFetcher - Optional function to fetch atoms from the backend
 * @param config - Optional menu configuration
 * @returns Promise of LinkedMenuGroup array
 */
export async function getMenusWithAtoms(
  query: string,
  abort: () => void,
  editorHost: EditorHost,
  inlineEditor: AffineInlineEditor,
  atomFetcher?: AtomFetcher,
  config: AtomMenuConfig = defaultAtomMenuConfig
): Promise<LinkedMenuGroup[]> {
  const groups: LinkedMenuGroup[] = [];

  // Try to fetch atoms if fetcher is provided
  if (atomFetcher) {
    try {
      const groupedAtoms = await searchAtoms(query, atomFetcher, config);
      
      if (groupedAtoms.size > 0) {
        // Add atom menu groups
        groups.push(
          ...createAtomMenuGroups(groupedAtoms, abort, inlineEditor, editorHost, config)
        );
      } else {
        // Fallback to doc menu if no atoms found
        groups.push(createLinkedDocMenuGroup(query, abort, editorHost, inlineEditor));
      }
    } catch (error) {
      console.error('[linked-doc] Failed to fetch atoms, falling back to doc menu:', error);
      // Fallback to doc menu on error
      groups.push(createLinkedDocMenuGroup(query, abort, editorHost, inlineEditor));
    }
  } else {
    // No fetcher provided, use default doc menu
    groups.push(createLinkedDocMenuGroup(query, abort, editorHost, inlineEditor));
  }

  // Always add new doc menu
  groups.push(createNewDocMenuGroup(query, abort, editorHost, inlineEditor));

  return groups;
}

export const LinkedWidgetUtils = {
  createNewDocMenuGroup,
  createAtomMenuGroups,
  insertLinkedNode,
  insertAtomNode,
  getMenusWithAtoms,
  searchAtoms,
  getAtomTypeIcon,
  getAtomTypeDisplayName,
};

export const AFFINE_LINKED_DOC_WIDGET = 'affine-linked-doc-widget';

export const LinkedWidgetConfigExtension = ConfigExtensionFactory<
  Partial<LinkedWidgetConfig>
>('affine:widget-linked-doc');
