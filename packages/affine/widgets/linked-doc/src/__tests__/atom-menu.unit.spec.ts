/**
 * Property-based tests for atom-menu module
 *
 * Feature: blocksuite-atom-linking
 * Property 4: 搜索结果分组正确性
 * Validates: Requirements 1.3
 *
 * For any search result set, the groupAtomsByType function should satisfy:
 * - Each group contains only atoms of the same type
 * - The group key equals the atom type of all atoms in that group
 */

import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';

import {
  ATOM_TYPES,
  groupAtomsByType,
  defaultAtomMenuConfig,
  type Atom,
  type AtomMenuConfig,
} from '../atom-menu.js';

// Arbitrary for generating valid atom types
const atomTypeArb = fc.constantFrom(
  ATOM_TYPES.NOTE,
  ATOM_TYPES.PDF_FILE,
  ATOM_TYPES.AUDIO_FILE,
  ATOM_TYPES.VIDEO_FILE,
  ATOM_TYPES.IMAGE,
  ATOM_TYPES.WEBPAGE
);

// Arbitrary for generating atoms with valid types
const atomArb = fc.record({
  id: fc.uuid(),
  type: atomTypeArb,
  name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  data: fc.string(),
  createdAt: fc.option(fc.nat(), { nil: undefined }),
  updatedAt: fc.option(fc.nat(), { nil: undefined }),
}) as fc.Arbitrary<Atom>;

// Arbitrary for generating atoms with any type (including unsupported)
const atomWithAnyTypeArb = fc.record({
  id: fc.uuid(),
  type: fc.integer({ min: 1, max: 20 }),
  name: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  data: fc.string(),
}) as fc.Arbitrary<Atom>;

describe('atom-menu groupAtomsByType', () => {
  /**
   * Property 4: 搜索结果分组正确性
   * For any search result set, groupAtomsByType returns groups where:
   * - Each group's key equals the atom type of all atoms in that group
   */
  it('Property 4: all atoms in each group have the same type as the group key', () => {
    fc.assert(
      fc.property(fc.array(atomArb, { minLength: 0, maxLength: 50 }), (atoms) => {
        const grouped = groupAtomsByType(atoms, defaultAtomMenuConfig);

        // For each group, verify all atoms have the same type as the key
        for (const [atomType, atomList] of grouped) {
          for (const atom of atomList) {
            expect(atom.type).toBe(atomType);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: group keys are valid atom types', () => {
    fc.assert(
      fc.property(fc.array(atomArb, { minLength: 1, maxLength: 50 }), (atoms) => {
        const grouped = groupAtomsByType(atoms, defaultAtomMenuConfig);

        for (const [atomType] of grouped) {
          expect(defaultAtomMenuConfig.supportedTypes).toContain(atomType);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: unsupported atom types are filtered out', () => {
    fc.assert(
      fc.property(fc.array(atomWithAnyTypeArb, { minLength: 1, maxLength: 50 }), (atoms) => {
        const grouped = groupAtomsByType(atoms, defaultAtomMenuConfig);

        // Count atoms that should be included
        const expectedCount = atoms.filter((a) =>
          defaultAtomMenuConfig.supportedTypes.includes(a.type)
        ).length;

        // Count atoms in grouped result
        let actualCount = 0;
        for (const [, atomList] of grouped) {
          actualCount += atomList.length;
        }

        expect(actualCount).toBe(expectedCount);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: all supported atoms are preserved in grouping', () => {
    fc.assert(
      fc.property(fc.array(atomArb, { minLength: 0, maxLength: 50 }), (atoms) => {
        const grouped = groupAtomsByType(atoms, defaultAtomMenuConfig);

        // Collect all atom IDs from grouped result
        const groupedIds = new Set<string>();
        for (const [, atomList] of grouped) {
          for (const atom of atomList) {
            groupedIds.add(atom.id);
          }
        }

        // All input atoms should be in the grouped result
        for (const atom of atoms) {
          expect(groupedIds.has(atom.id)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: grouping is deterministic - same input produces same output', () => {
    fc.assert(
      fc.property(fc.array(atomArb, { minLength: 0, maxLength: 30 }), (atoms) => {
        const grouped1 = groupAtomsByType(atoms, defaultAtomMenuConfig);
        const grouped2 = groupAtomsByType(atoms, defaultAtomMenuConfig);

        // Same number of groups
        expect(grouped1.size).toBe(grouped2.size);

        // Same atoms in each group
        for (const [atomType, atomList1] of grouped1) {
          const atomList2 = grouped2.get(atomType);
          expect(atomList2).toBeDefined();
          expect(atomList1.length).toBe(atomList2!.length);

          const ids1 = atomList1.map((a) => a.id).sort();
          const ids2 = atomList2!.map((a) => a.id).sort();
          expect(ids1).toEqual(ids2);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: empty input produces empty output', () => {
    const grouped = groupAtomsByType([], defaultAtomMenuConfig);
    expect(grouped.size).toBe(0);
  });

  it('Property 4: custom config filters correctly', () => {
    const customConfig: AtomMenuConfig = {
      maxDisplayPerType: 3,
      supportedTypes: [ATOM_TYPES.NOTE, ATOM_TYPES.PDF_FILE],
    };

    fc.assert(
      fc.property(fc.array(atomWithAnyTypeArb, { minLength: 1, maxLength: 50 }), (atoms) => {
        const grouped = groupAtomsByType(atoms, customConfig);

        // Only NOTE and PDF_FILE types should be in the result
        for (const [atomType] of grouped) {
          expect(customConfig.supportedTypes).toContain(atomType);
        }
      }),
      { numRuns: 100 }
    );
  });
});


import { vi } from 'vitest';
import { createAtomMenuGroups } from '../config.js';

// Mock InlineEditor for testing createAtomMenuGroups
function createMockInlineEditor() {
  return {
    getInlineRange: () => ({ index: 0, length: 0 }),
    insertText: vi.fn(),
    setInlineRange: vi.fn(),
  };
}

// Mock EditorHost for testing
function createMockEditorHost() {
  return {
    std: {
      getOptional: () => undefined,
    },
  };
}

describe('createAtomMenuGroups', () => {
  /**
   * Property 6: 搜索结果数量限制
   * For any search query, each type group's displayed items should not exceed maxDisplayPerType
   * Validates: Requirements 5.4
   */
  it('Property 6: menu group items count does not exceed maxDisplayPerType', () => {
    fc.assert(
      fc.property(
        fc.array(atomArb, { minLength: 0, maxLength: 100 }),
        fc.integer({ min: 1, max: 10 }),
        (atoms, maxDisplay) => {
          const config: AtomMenuConfig = {
            maxDisplayPerType: maxDisplay,
            supportedTypes: defaultAtomMenuConfig.supportedTypes,
          };

          const grouped = groupAtomsByType(atoms, config);
          const mockEditor = createMockInlineEditor();
          const mockHost = createMockEditorHost();

          const menuGroups = createAtomMenuGroups(
            grouped,
            () => {},
            mockEditor as any,
            mockHost as any,
            config
          );

          // Each menu group's items should not exceed maxDisplayPerType
          for (const group of menuGroups) {
            const items = Array.isArray(group.items) ? group.items : [];
            expect(items.length).toBeLessThanOrEqual(maxDisplay);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: overflow text is set when items exceed limit', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (maxDisplay) => {
          // Create more atoms than maxDisplay for a single type
          const atoms: Atom[] = Array.from({ length: maxDisplay + 5 }, (_, i) => ({
            id: `atom-${i}`,
            type: ATOM_TYPES.NOTE,
            name: `Note ${i}`,
            data: '',
          }));

          const config: AtomMenuConfig = {
            maxDisplayPerType: maxDisplay,
            supportedTypes: [ATOM_TYPES.NOTE],
          };

          const grouped = groupAtomsByType(atoms, config);
          const mockEditor = createMockInlineEditor();
          const mockHost = createMockEditorHost();

          const menuGroups = createAtomMenuGroups(
            grouped,
            () => {},
            mockEditor as any,
            mockHost as any,
            config
          );

          // Should have overflow text when there are more items than maxDisplay
          expect(menuGroups.length).toBe(1);
          expect(menuGroups[0].overflowText).toBeDefined();
          expect(menuGroups[0].overflowText).toContain('5'); // 5 more items
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 6: no overflow text when items are within limit', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5, max: 10 }),
        (maxDisplay) => {
          // Create fewer atoms than maxDisplay
          const atoms: Atom[] = Array.from({ length: 3 }, (_, i) => ({
            id: `atom-${i}`,
            type: ATOM_TYPES.NOTE,
            name: `Note ${i}`,
            data: '',
          }));

          const config: AtomMenuConfig = {
            maxDisplayPerType: maxDisplay,
            supportedTypes: [ATOM_TYPES.NOTE],
          };

          const grouped = groupAtomsByType(atoms, config);
          const mockEditor = createMockInlineEditor();
          const mockHost = createMockEditorHost();

          const menuGroups = createAtomMenuGroups(
            grouped,
            () => {},
            mockEditor as any,
            mockHost as any,
            config
          );

          // Should not have overflow text when items are within limit
          expect(menuGroups.length).toBe(1);
          expect(menuGroups[0].overflowText).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 6: maxDisplay property is set correctly on menu groups', () => {
    fc.assert(
      fc.property(
        fc.array(atomArb, { minLength: 1, maxLength: 50 }),
        fc.integer({ min: 1, max: 10 }),
        (atoms, maxDisplay) => {
          const config: AtomMenuConfig = {
            maxDisplayPerType: maxDisplay,
            supportedTypes: defaultAtomMenuConfig.supportedTypes,
          };

          const grouped = groupAtomsByType(atoms, config);
          const mockEditor = createMockInlineEditor();
          const mockHost = createMockEditorHost();

          const menuGroups = createAtomMenuGroups(
            grouped,
            () => {},
            mockEditor as any,
            mockHost as any,
            config
          );

          // Each menu group should have maxDisplay set to config value
          for (const group of menuGroups) {
            expect(group.maxDisplay).toBe(maxDisplay);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
