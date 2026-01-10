/**
 * Atom Type Utilities for Reference Node
 *
 * Provides atom type constants and icon mapping for rendering reference nodes
 * with different atom types (NOTE, PDF, AUDIO, VIDEO, IMAGE, WEBPAGE, etc.)
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
 * Common icon style for vertical alignment in inline reference nodes
 * Matches the style used by DocDisplayMetaService.iconBuilder
 */
const ICON_SIZE = '1.25em';
const ICON_STYLE = 'user-select:none;flex-shrink:0;vertical-align:middle;font-size:inherit;';
// Style for wrapping Phosphor Icons to ensure consistent alignment
const PH_WRAPPER_STYLE = 'display:inline-flex;align-items:center;vertical-align:middle;';

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
 * Get icon for atom type
 *
 * @param atomType - The atom type number
 * @returns TemplateResult for the icon
 */
export function getAtomTypeIcon(atomType: number): TemplateResult<1> {
  switch (atomType) {
    case ATOM_TYPES.NOTE:
      return LinkedPageIcon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.TODO:
      // ph-check-square for single todo - wrap in span for consistent styling
      return html`<span style=${PH_WRAPPER_STYLE}><ph-check-square size=${ICON_SIZE} weight="regular"></ph-check-square></span>` as TemplateResult<1>;
    case ATOM_TYPES.PDF_FILE:
      return FileIconPdfIcon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.AUDIO_FILE:
      return FileIconMp3Icon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.VIDEO_FILE:
      return FileIconMp4Icon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.IMAGE:
      return FileIconImgIcon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.WEBPAGE:
      return LinkIcon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
    case ATOM_TYPES.MINDMAP:
      // ph-tree-structure for mindmap - wrap in span for consistent styling
      return html`<span style=${PH_WRAPPER_STYLE}><ph-tree-structure size=${ICON_SIZE} weight="regular"></ph-tree-structure></span>` as TemplateResult<1>;
    case ATOM_TYPES.XINGLIU:
      // ph-shooting-star for xingliu (星流) - wrap in span for consistent styling
      return html`<span style=${PH_WRAPPER_STYLE}><ph-shooting-star size=${ICON_SIZE} weight="regular"></ph-shooting-star></span>` as TemplateResult<1>;
    case ATOM_TYPES.TODO_LIST:
      // ph-list-checks for todo list - wrap in span for consistent styling
      return html`<span style=${PH_WRAPPER_STYLE}><ph-list-checks size=${ICON_SIZE} weight="regular"></ph-list-checks></span>` as TemplateResult<1>;
    case ATOM_TYPES.WHITEBOARD:
      // ph-frame-corners for whiteboard - wrap in span for consistent styling
      return html`<span style=${PH_WRAPPER_STYLE}><ph-frame-corners size=${ICON_SIZE} weight="regular"></ph-frame-corners></span>` as TemplateResult<1>;
    default:
      return LinkedPageIcon({ width: ICON_SIZE, height: ICON_SIZE, style: ICON_STYLE }) as TemplateResult<1>;
  }
}

/**
 * Panel type constants for opening atoms
 */
export const PANEL_TYPES = {
  EDITOR: 'editor',
  PDF: 'pdf',
  AUDIO: 'audio',
  VIDEO: 'video',
  IMAGE: 'image',
  WEBVIEW: 'webview',
} as const;

export type PanelType = (typeof PANEL_TYPES)[keyof typeof PANEL_TYPES];

/**
 * Map atom type to corresponding panel type
 *
 * @param atomType - The atom type number
 * @returns The panel type string for opening the atom
 */
export function atomTypeToPanelType(atomType: number): PanelType {
  switch (atomType) {
    case ATOM_TYPES.NOTE:
      return PANEL_TYPES.EDITOR;
    case ATOM_TYPES.PDF_FILE:
      return PANEL_TYPES.PDF;
    case ATOM_TYPES.AUDIO_FILE:
      return PANEL_TYPES.AUDIO;
    case ATOM_TYPES.VIDEO_FILE:
      return PANEL_TYPES.VIDEO;
    case ATOM_TYPES.IMAGE:
      return PANEL_TYPES.IMAGE;
    case ATOM_TYPES.WEBPAGE:
      return PANEL_TYPES.WEBVIEW;
    default:
      return PANEL_TYPES.EDITOR;
  }
}
