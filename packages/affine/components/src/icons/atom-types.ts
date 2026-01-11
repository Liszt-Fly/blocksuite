/**
 * Atom Type Icons
 *
 * Pre-configured icons for different atom types (NOTE, PDF, AUDIO, VIDEO, IMAGE, WEBPAGE, etc.)
 * These icons are used in the linked doc menu and reference node rendering.
 *
 * Requirements: 3.2-3.7
 */

import * as icons from '@blocksuite/icons/lit';
import { html, type TemplateResult } from 'lit';

// ============================================================================
// Icon Size Constants
// ============================================================================

/** Standard icon size for menus (20x20) */
export const MENU_ICON_SIZE = '20';

/** Standard icon size for inline references (1.25em) */
export const INLINE_ICON_SIZE = '1.25em';

/** Style for inline icons to ensure proper vertical alignment */
export const INLINE_ICON_STYLE =
  'user-select:none;flex-shrink:0;vertical-align:middle;font-size:inherit;';

/** Style for wrapping Phosphor Icons to ensure consistent alignment */
export const PH_WRAPPER_STYLE =
  'display:inline-flex;align-items:center;vertical-align:middle;';

// ============================================================================
// Menu Icons (20x20)
// ============================================================================

/** Note/Document icon for menu display */
export const NoteMenuIcon = icons.LinkedPageIcon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

/** PDF document icon for menu display */
export const PdfMenuIcon = icons.FileIconPdfIcon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

/** Audio file icon for menu display */
export const AudioMenuIcon = icons.FileIconMp3Icon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

/** Video file icon for menu display */
export const VideoMenuIcon = icons.FileIconMp4Icon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

/** Image file icon for menu display */
export const ImageMenuIcon = icons.FileIconImgIcon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

/** Webpage/Link icon for menu display */
export const WebpageMenuIcon = icons.LinkIcon({
  width: MENU_ICON_SIZE,
  height: MENU_ICON_SIZE,
});

// ============================================================================
// Inline Icons (1.25em for reference nodes)
// ============================================================================

/** Note/Document icon for inline reference display */
export const NoteInlineIcon = icons.LinkedPageIcon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

/** PDF document icon for inline reference display */
export const PdfInlineIcon = icons.FileIconPdfIcon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

/** Audio file icon for inline reference display */
export const AudioInlineIcon = icons.FileIconMp3Icon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

/** Video file icon for inline reference display */
export const VideoInlineIcon = icons.FileIconMp4Icon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

/** Image file icon for inline reference display */
export const ImageInlineIcon = icons.FileIconImgIcon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

/** Webpage/Link icon for inline reference display */
export const WebpageInlineIcon = icons.LinkIcon({
  width: INLINE_ICON_SIZE,
  height: INLINE_ICON_SIZE,
  style: INLINE_ICON_STYLE,
});

// ============================================================================
// Phosphor Icons (for types without blocksuite icons)
// ============================================================================

/**
 * Create a Phosphor icon wrapped for menu display
 * @param iconName - The Phosphor icon element name (e.g., 'ph-check-square')
 */
export function createPhosphorMenuIcon(iconName: string): TemplateResult<1> {
  return html`<${iconName} size="${MENU_ICON_SIZE}" weight="regular"></${iconName}>` as unknown as TemplateResult<1>;
}

/**
 * Create a Phosphor icon wrapped for inline display with proper styling
 * @param iconName - The Phosphor icon element name (e.g., 'ph-check-square')
 */
export function createPhosphorInlineIcon(iconName: string): TemplateResult<1> {
  return html`<span style=${PH_WRAPPER_STYLE}><${iconName} size="${INLINE_ICON_SIZE}" weight="regular"></${iconName}></span>` as unknown as TemplateResult<1>;
}

// Pre-configured Phosphor icons for menu display
export const TodoMenuIcon = html`<ph-check-square
  size="${MENU_ICON_SIZE}"
  weight="regular"
></ph-check-square>` as TemplateResult<1>;

export const MindmapMenuIcon = html`<ph-tree-structure
  size="${MENU_ICON_SIZE}"
  weight="regular"
></ph-tree-structure>` as TemplateResult<1>;

export const XingliuMenuIcon = html`<ph-shooting-star
  size="${MENU_ICON_SIZE}"
  weight="regular"
></ph-shooting-star>` as TemplateResult<1>;

export const TodoListMenuIcon = html`<ph-list-checks
  size="${MENU_ICON_SIZE}"
  weight="regular"
></ph-list-checks>` as TemplateResult<1>;

export const WhiteboardMenuIcon = html`<ph-frame-corners
  size="${MENU_ICON_SIZE}"
  weight="regular"
></ph-frame-corners>` as TemplateResult<1>;

// Pre-configured Phosphor icons for inline display
export const TodoInlineIcon = html`<span style=${PH_WRAPPER_STYLE}
  ><ph-check-square
    size="${INLINE_ICON_SIZE}"
    weight="regular"
  ></ph-check-square
></span>` as TemplateResult<1>;

export const MindmapInlineIcon = html`<span style=${PH_WRAPPER_STYLE}
  ><ph-tree-structure
    size="${INLINE_ICON_SIZE}"
    weight="regular"
  ></ph-tree-structure
></span>` as TemplateResult<1>;

export const XingliuInlineIcon = html`<span style=${PH_WRAPPER_STYLE}
  ><ph-shooting-star
    size="${INLINE_ICON_SIZE}"
    weight="regular"
  ></ph-shooting-star
></span>` as TemplateResult<1>;

export const TodoListInlineIcon = html`<span style=${PH_WRAPPER_STYLE}
  ><ph-list-checks
    size="${INLINE_ICON_SIZE}"
    weight="regular"
  ></ph-list-checks
></span>` as TemplateResult<1>;

export const WhiteboardInlineIcon = html`<span style=${PH_WRAPPER_STYLE}
  ><ph-frame-corners
    size="${INLINE_ICON_SIZE}"
    weight="regular"
  ></ph-frame-corners
></span>` as TemplateResult<1>;
