import { REFERENCE_NODE } from '@blocksuite/affine-shared/consts';
import type { AffineInlineEditor } from '@blocksuite/affine-shared/types';
import type { ReferenceParams } from '@blocksuite/affine-model';

/**
 * Atom type constants for reference
 * NOTE = 1 is the default type for backward compatibility
 */
export const ATOM_TYPE_NOTE = 1;

/**
 * Insert an atom reference node into the inline editor.
 * This is the new function that supports all atom types.
 *
 * @param inlineEditor - The inline editor instance
 * @param atomId - The ID of the atom to link
 * @param atomType - The type of the atom (defaults to NOTE for backward compatibility)
 * @param title - Optional custom title for the reference
 * @param referenceParams - Optional reference params such as blockIds/mode
 */
export function insertAtomNode({
  inlineEditor,
  atomId,
  atomType = ATOM_TYPE_NOTE,
  title,
  referenceParams,
}: {
  inlineEditor: AffineInlineEditor;
  atomId: string;
  atomType?: number;
  title?: string;
  referenceParams?: ReferenceParams;
}) {
  if (!inlineEditor) return;
  const inlineRange = inlineEditor.getInlineRange();
  if (!inlineRange) return;

  const params: ReferenceParams = {
    ...(referenceParams ?? {}),
    atomType: referenceParams?.atomType ?? atomType,
  };

  inlineEditor.insertText(inlineRange, REFERENCE_NODE, {
    reference: {
      type: 'LinkedPage',
      pageId: atomId,
      params,
      ...(title && { title }),
    },
  });

  inlineEditor.setInlineRange({
    index: inlineRange.index + 1,
    length: 0,
  });
}

/**
 * Insert a linked document node into the inline editor.
 * This is the legacy function maintained for backward compatibility.
 * It internally calls insertAtomNode with atomType = NOTE.
 *
 * @param inlineEditor - The inline editor instance
 * @param docId - The ID of the document to link
 */
export function insertLinkedNode({
  inlineEditor,
  docId,
}: {
  inlineEditor: AffineInlineEditor;
  docId: string;
}) {
  insertAtomNode({
    inlineEditor,
    atomId: docId,
    atomType: ATOM_TYPE_NOTE,
  });
}
