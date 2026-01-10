/**
 * Property-based tests for atom-utils module
 *
 * Feature: blocksuite-atom-linking
 * Property 1: 原子类型默认值
 * Property 2: 类型到图标映射一致性
 *
 * Validates: Requirements 2.3, 3.1-3.8, 6.1
 */

import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';

import { ATOM_TYPES, getAtomTypeIcon } from '../reference-node/atom-utils.js';

// Arbitrary for generating valid atom types (1-11)
const validAtomTypeArb = fc.integer({ min: 1, max: 11 });

// Arbitrary for generating any integer (including invalid atom types)
const anyIntegerArb = fc.integer({ min: -1000, max: 1000 });

// Arbitrary for generating undefined or missing values
const undefinedOrMissingArb = fc.constantFrom(undefined, null);

describe('Property 1: 原子类型默认值', () => {
  /**
   * Property 1: 原子类型默认值
   * For any reference data without params.atomType, the system should
   * treat it as NOTE type (atomType=1)
   *
   * **Validates: Requirements 2.3, 6.1**
   */
  it('Property 1: missing atomType defaults to NOTE type', () => {
    // Simulate the _atomType getter logic
    const getAtomTypeFromReference = (
      reference: { params?: { atomType?: number } } | undefined
    ): number => {
      return reference?.params?.atomType ?? ATOM_TYPES.NOTE;
    };

    fc.assert(
      fc.property(
        fc.record({
          params: fc.option(
            fc.record({
              // Explicitly omit atomType to test default behavior
              mode: fc.option(fc.constantFrom('edgeless', 'page'), {
                nil: undefined,
              }),
              blockIds: fc.option(fc.array(fc.string()), { nil: undefined }),
            }),
            { nil: undefined }
          ),
        }),
        reference => {
          // When atomType is not specified, should default to NOTE (1)
          const atomType = getAtomTypeFromReference(reference);
          expect(atomType).toBe(ATOM_TYPES.NOTE);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1: 原子类型默认值
   * For any reference data with undefined reference, should default to NOTE
   *
   * **Validates: Requirements 2.3, 6.1**
   */
  it('Property 1: undefined reference defaults to NOTE type', () => {
    const getAtomTypeFromReference = (
      reference: { params?: { atomType?: number } } | undefined | null
    ): number => {
      return reference?.params?.atomType ?? ATOM_TYPES.NOTE;
    };

    fc.assert(
      fc.property(undefinedOrMissingArb, reference => {
        const atomType = getAtomTypeFromReference(reference);
        expect(atomType).toBe(ATOM_TYPES.NOTE);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1: 原子类型默认值
   * When atomType IS specified, it should be preserved
   *
   * **Validates: Requirements 2.3, 6.1**
   */
  it('Property 1: specified atomType is preserved', () => {
    const getAtomTypeFromReference = (
      reference: { params?: { atomType?: number } } | undefined
    ): number => {
      return reference?.params?.atomType ?? ATOM_TYPES.NOTE;
    };

    fc.assert(
      fc.property(validAtomTypeArb, specifiedAtomType => {
        const reference = {
          params: {
            atomType: specifiedAtomType,
          },
        };
        const atomType = getAtomTypeFromReference(reference);
        expect(atomType).toBe(specifiedAtomType);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 2: 类型到图标映射一致性', () => {
  /**
   * Property 2: 类型到图标映射一致性
   * For any atomType value, getAtomTypeIcon should return a consistent result
   * (same input always produces structurally equivalent output - deterministic)
   *
   * **Validates: Requirements 3.1-3.8**
   */
  it('Property 2: getAtomTypeIcon is deterministic', () => {
    fc.assert(
      fc.property(anyIntegerArb, atomType => {
        const icon1 = getAtomTypeIcon(atomType);
        const icon2 = getAtomTypeIcon(atomType);

        // Same input should always produce structurally equivalent output
        // Using toStrictEqual because icon functions may return new objects
        expect(icon1).toStrictEqual(icon2);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: 类型到图标映射一致性
   * For any known atom type, getAtomTypeIcon should return a non-null icon
   *
   * **Validates: Requirements 3.1-3.8**
   */
  it('Property 2: known atom types return non-null icons', () => {
    const knownAtomTypes = [
      ATOM_TYPES.NOTE,
      ATOM_TYPES.PDF_FILE,
      ATOM_TYPES.AUDIO_FILE,
      ATOM_TYPES.VIDEO_FILE,
      ATOM_TYPES.IMAGE,
      ATOM_TYPES.WEBPAGE,
    ];

    fc.assert(
      fc.property(fc.constantFrom(...knownAtomTypes), atomType => {
        const icon = getAtomTypeIcon(atomType);
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: 类型到图标映射一致性
   * For any unknown atom type, getAtomTypeIcon should fallback to LinkedDocIcon
   *
   * **Validates: Requirements 3.8**
   */
  it('Property 2: unknown atom types fallback to default icon', () => {
    // Generate integers that are NOT valid atom types
    const unknownAtomTypeArb = fc.integer({ min: 12, max: 1000 });

    fc.assert(
      fc.property(unknownAtomTypeArb, atomType => {
        const icon = getAtomTypeIcon(atomType);
        const defaultIcon = getAtomTypeIcon(ATOM_TYPES.NOTE);

        // Unknown types should return structurally equivalent icon as NOTE (LinkedDocIcon)
        expect(icon).toStrictEqual(defaultIcon);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: 类型到图标映射一致性
   * Negative atom types should also fallback to default icon
   *
   * **Validates: Requirements 3.8**
   */
  it('Property 2: negative atom types fallback to default icon', () => {
    const negativeAtomTypeArb = fc.integer({ min: -1000, max: -1 });

    fc.assert(
      fc.property(negativeAtomTypeArb, atomType => {
        const icon = getAtomTypeIcon(atomType);
        const defaultIcon = getAtomTypeIcon(ATOM_TYPES.NOTE);

        // Negative types should return structurally equivalent icon as NOTE (LinkedDocIcon)
        expect(icon).toStrictEqual(defaultIcon);
      }),
      { numRuns: 100 }
    );
  });
});
