/**
 * Property-based tests for utils module
 *
 * Feature: blocksuite-atom-linking
 * Property 5: 插入数据格式正确性
 * Validates: Requirements 2.1, 2.2, 2.4
 *
 * For any call to insertAtomNode, the inserted delta should contain:
 * - reference.type === 'LinkedPage'
 * - reference.params.atomType equals the passed atomType
 */

import { describe, expect, it, vi } from 'vitest';
import * as fc from 'fast-check';

import { insertAtomNode, insertLinkedNode, ATOM_TYPE_NOTE } from '../utils.js';

// Mock InlineEditor interface for testing
interface MockInlineEditor {
  getInlineRange: () => { index: number; length: number } | null;
  insertText: (
    range: { index: number; length: number },
    text: string,
    attributes: Record<string, unknown>
  ) => void;
  setInlineRange: (range: { index: number; length: number }) => void;
}

function createMockInlineEditor(): MockInlineEditor & {
  insertTextCalls: Array<{
    range: { index: number; length: number };
    text: string;
    attributes: Record<string, unknown>;
  }>;
} {
  const insertTextCalls: Array<{
    range: { index: number; length: number };
    text: string;
    attributes: Record<string, unknown>;
  }> = [];

  return {
    insertTextCalls,
    getInlineRange: () => ({ index: 0, length: 0 }),
    insertText: (range, text, attributes) => {
      insertTextCalls.push({ range, text, attributes });
    },
    setInlineRange: vi.fn(),
  };
}

// Arbitrary for generating valid atom types
const atomTypeArb = fc.integer({ min: 1, max: 11 });

// Arbitrary for generating atom IDs (UUIDs)
const atomIdArb = fc.uuid();

// Arbitrary for generating optional titles
const titleArb = fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
  nil: undefined,
});

describe('insertAtomNode', () => {
  /**
   * Property 5: 插入数据格式正确性
   * For any call to insertAtomNode, the inserted delta should contain
   * reference.type === 'LinkedPage'
   */
  it('Property 5: inserted reference type is always LinkedPage', () => {
    fc.assert(
      fc.property(atomIdArb, atomTypeArb, titleArb, (atomId, atomType, title) => {
        const mockEditor = createMockInlineEditor();

        insertAtomNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertAtomNode
          >[0]['inlineEditor'],
          atomId,
          atomType,
          title,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;

        expect(reference.type).toBe('LinkedPage');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: 插入数据格式正确性
   * For any call to insertAtomNode, reference.params.atomType equals the passed atomType
   */
  it('Property 5: inserted atomType matches input atomType', () => {
    fc.assert(
      fc.property(atomIdArb, atomTypeArb, titleArb, (atomId, atomType, title) => {
        const mockEditor = createMockInlineEditor();

        insertAtomNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertAtomNode
          >[0]['inlineEditor'],
          atomId,
          atomType,
          title,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;
        const params = reference.params as Record<string, unknown>;

        expect(params.atomType).toBe(atomType);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: 插入数据格式正确性
   * For any call to insertAtomNode, reference.pageId equals the passed atomId
   */
  it('Property 5: inserted pageId matches input atomId', () => {
    fc.assert(
      fc.property(atomIdArb, atomTypeArb, titleArb, (atomId, atomType, title) => {
        const mockEditor = createMockInlineEditor();

        insertAtomNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertAtomNode
          >[0]['inlineEditor'],
          atomId,
          atomType,
          title,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;

        expect(reference.pageId).toBe(atomId);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: 插入数据格式正确性
   * When title is provided, it should be included in the reference
   */
  it('Property 5: title is included when provided', () => {
    fc.assert(
      fc.property(
        atomIdArb,
        atomTypeArb,
        fc.string({ minLength: 1, maxLength: 100 }),
        (atomId, atomType, title) => {
          const mockEditor = createMockInlineEditor();

          insertAtomNode({
            inlineEditor: mockEditor as unknown as Parameters<
              typeof insertAtomNode
            >[0]['inlineEditor'],
            atomId,
            atomType,
            title,
          });

          expect(mockEditor.insertTextCalls.length).toBe(1);
          const call = mockEditor.insertTextCalls[0];
          const reference = call.attributes.reference as Record<string, unknown>;

          expect(reference.title).toBe(title);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: 插入数据格式正确性
   * When title is not provided, it should not be in the reference
   */
  it('Property 5: title is not included when not provided', () => {
    fc.assert(
      fc.property(atomIdArb, atomTypeArb, (atomId, atomType) => {
        const mockEditor = createMockInlineEditor();

        insertAtomNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertAtomNode
          >[0]['inlineEditor'],
          atomId,
          atomType,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;

        expect(reference.title).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Default atomType should be NOTE (1) when not specified
   */
  it('Property 5: default atomType is NOTE when not specified', () => {
    fc.assert(
      fc.property(atomIdArb, (atomId) => {
        const mockEditor = createMockInlineEditor();

        insertAtomNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertAtomNode
          >[0]['inlineEditor'],
          atomId,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;
        const params = reference.params as Record<string, unknown>;

        expect(params.atomType).toBe(ATOM_TYPE_NOTE);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Custom reference params should be preserved (e.g. block anchor links)
   */
  it('preserves custom reference params when provided', () => {
    const mockEditor = createMockInlineEditor();

    insertAtomNode({
      inlineEditor: mockEditor as unknown as Parameters<
        typeof insertAtomNode
      >[0]['inlineEditor'],
      atomId: 'doc-1',
      atomType: 10,
      referenceParams: {
        mode: 'page',
        blockIds: ['block-1'],
      },
    });

    expect(mockEditor.insertTextCalls.length).toBe(1);
    const call = mockEditor.insertTextCalls[0];
    const reference = call.attributes.reference as Record<string, unknown>;
    const params = reference.params as Record<string, unknown>;

    expect(params.mode).toBe('page');
    expect(params.blockIds).toEqual(['block-1']);
    expect(params.atomType).toBe(10);
  });

  /**
   * No operation when inlineEditor is null
   */
  it('does nothing when inlineEditor is null', () => {
    // This should not throw
    insertAtomNode({
      inlineEditor: null as unknown as Parameters<
        typeof insertAtomNode
      >[0]['inlineEditor'],
      atomId: 'test-id',
      atomType: 1,
    });
  });

  /**
   * No operation when getInlineRange returns null
   */
  it('does nothing when getInlineRange returns null', () => {
    const mockEditor = {
      getInlineRange: () => null,
      insertText: vi.fn(),
      setInlineRange: vi.fn(),
    };

    insertAtomNode({
      inlineEditor: mockEditor as unknown as Parameters<
        typeof insertAtomNode
      >[0]['inlineEditor'],
      atomId: 'test-id',
      atomType: 1,
    });

    expect(mockEditor.insertText).not.toHaveBeenCalled();
  });
});

describe('insertLinkedNode', () => {
  /**
   * insertLinkedNode should use NOTE type by default
   */
  it('uses NOTE type for backward compatibility', () => {
    fc.assert(
      fc.property(atomIdArb, (docId) => {
        const mockEditor = createMockInlineEditor();

        insertLinkedNode({
          inlineEditor: mockEditor as unknown as Parameters<
            typeof insertLinkedNode
          >[0]['inlineEditor'],
          docId,
        });

        expect(mockEditor.insertTextCalls.length).toBe(1);
        const call = mockEditor.insertTextCalls[0];
        const reference = call.attributes.reference as Record<string, unknown>;
        const params = reference.params as Record<string, unknown>;

        expect(reference.type).toBe('LinkedPage');
        expect(reference.pageId).toBe(docId);
        expect(params.atomType).toBe(ATOM_TYPE_NOTE);
      }),
      { numRuns: 100 }
    );
  });
});
