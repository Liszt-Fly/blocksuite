/**
 * Atom Menu Service Module
 * 
 * Provides functionality for searching and displaying atoms in the linked doc menu.
 * Supports all atom types (NOTE, PDF, AUDIO, VIDEO, IMAGE, WEBPAGE, etc.)
 */

import {
  FileIconImgIcon,
  FileIconMp3Icon,
  FileIconMp4Icon,
  FileIconPdfIcon,
  LinkIcon,
  LinkedPageIcon,
} from '@blocksuite/icons/lit';
import { html, type TemplateResult } from 'lit';

/**
 * Atom type constants matching the backend enum
 */
export const ATOM_TYPES = {
  NOTE: 1,
  TODO: 2,
  PDF_FILE: 3,
  AUDIO_FILE: 4,
  VIDEO_FILE: 5,
  IMAGE: 6,
  WEBPAGE: 7,
  MINDMAP: 8,
  XINGLIU: 9,
  TODO_LIST: 10,
  WHITEBOARD: 11,
} as const;

export type AtomType = (typeof ATOM_TYPES)[keyof typeof ATOM_TYPES];

/**
 * Atom interface matching the Go API response
 */
export interface Atom {
  id: string;
  type: number;
  name?: string;
  data: string;
  meta?: unknown;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Configuration for atom menu display
 */
export interface AtomMenuConfig {
  /** Maximum number of items to display per type group */
  maxDisplayPerType: number;
  /** List of supported atom types to show in the menu */
  supportedTypes: number[];
}

/**
 * Default configuration for atom menu
 */
export const defaultAtomMenuConfig: AtomMenuConfig = {
  maxDisplayPerType: 6,
  supportedTypes: [
    ATOM_TYPES.NOTE,
    ATOM_TYPES.TODO,
    ATOM_TYPES.PDF_FILE,
    ATOM_TYPES.AUDIO_FILE,
    ATOM_TYPES.VIDEO_FILE,
    ATOM_TYPES.IMAGE,
    ATOM_TYPES.WEBPAGE,
    ATOM_TYPES.MINDMAP,
    ATOM_TYPES.XINGLIU,
    ATOM_TYPES.TODO_LIST,
    ATOM_TYPES.WHITEBOARD,
  ],
};

/**
 * Atom fetcher function type
 * This allows the consumer to inject their own atom fetching logic
 */
export type AtomFetcher = (query: string, limit: number) => Promise<Atom[]>;

/**
 * Search atoms and group by type
 * 
 * @param query - Search query string
 * @param fetcher - Function to fetch atoms from the backend
 * @param config - Menu configuration
 * @returns Map of atom type to array of atoms
 */
export async function searchAtoms(
  query: string,
  fetcher: AtomFetcher,
  config: AtomMenuConfig = defaultAtomMenuConfig
): Promise<Map<number, Atom[]>> {
  try {
    const limit = config.maxDisplayPerType * config.supportedTypes.length;
    const atoms = await fetcher(query, limit);

    // Group atoms by type
    return groupAtomsByType(atoms, config);
  } catch (error) {
    console.error('[atom-menu] Failed to fetch atoms:', error);
    return new Map();
  }
}

/**
 * Group atoms by their type
 * 
 * @param atoms - Array of atoms to group
 * @param config - Menu configuration
 * @returns Map of atom type to array of atoms
 */
export function groupAtomsByType(
  atoms: Atom[],
  config: AtomMenuConfig = defaultAtomMenuConfig
): Map<number, Atom[]> {
  const grouped = new Map<number, Atom[]>();

  for (const atom of atoms) {
    // Skip unsupported types
    if (!config.supportedTypes.includes(atom.type)) continue;

    const list = grouped.get(atom.type) || [];
    list.push(atom);
    grouped.set(atom.type, list);
  }

  return grouped;
}

/**
 * Get icon for atom type
 * 
 * @param atomType - The atom type number
 * @returns TemplateResult for the icon
 */
export function getAtomTypeIcon(atomType: number): TemplateResult<1> {
  switch (atomType) {
    case ATOM_TYPES.NOTE:
      return LinkedPageIcon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.TODO:
      // ph-check-square for single todo
      return html`<ph-check-square size="20" weight="regular"></ph-check-square>` as TemplateResult<1>;
    case ATOM_TYPES.PDF_FILE:
      return FileIconPdfIcon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.AUDIO_FILE:
      return FileIconMp3Icon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.VIDEO_FILE:
      return FileIconMp4Icon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.IMAGE:
      return FileIconImgIcon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.WEBPAGE:
      return LinkIcon({ width: '20', height: '20' }) as TemplateResult<1>;
    case ATOM_TYPES.MINDMAP:
      // ph-tree-structure for mindmap
      return html`<ph-tree-structure size="20" weight="regular"></ph-tree-structure>` as TemplateResult<1>;
    case ATOM_TYPES.XINGLIU:
      // ph-shooting-star for xingliu (星流)
      return html`<ph-shooting-star size="20" weight="regular"></ph-shooting-star>` as TemplateResult<1>;
    case ATOM_TYPES.TODO_LIST:
      // ph-list-checks for todo list
      return html`<ph-list-checks size="20" weight="regular"></ph-list-checks>` as TemplateResult<1>;
    case ATOM_TYPES.WHITEBOARD:
      // ph-frame-corners for whiteboard
      return html`<ph-frame-corners size="20" weight="regular"></ph-frame-corners>` as TemplateResult<1>;
    default:
      return LinkedPageIcon({ width: '20', height: '20' }) as TemplateResult<1>;
  }
}

/**
 * Get display name for atom type
 * 
 * @param atomType - The atom type number
 * @returns Localized display name
 */
export function getAtomTypeDisplayName(atomType: number): string {
  const names: Record<number, string> = {
    [ATOM_TYPES.NOTE]: '笔记',
    [ATOM_TYPES.PDF_FILE]: 'PDF 文档',
    [ATOM_TYPES.AUDIO_FILE]: '音频',
    [ATOM_TYPES.VIDEO_FILE]: '视频',
    [ATOM_TYPES.IMAGE]: '图片',
    [ATOM_TYPES.WEBPAGE]: '网页',
    [ATOM_TYPES.MINDMAP]: '思维导图',
    [ATOM_TYPES.XINGLIU]: '星流',
    [ATOM_TYPES.TODO]: '待办事项',
    [ATOM_TYPES.TODO_LIST]: '待办清单',
    [ATOM_TYPES.WHITEBOARD]: '手绘白板',
  };
  return names[atomType] || '文档';
}
