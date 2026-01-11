import { type BlockStdScope, ConfigExtensionFactory } from '@blocksuite/std';
import type { TemplateResult } from 'lit';

import type { AffineReference } from './reference-node';

/**
 * Function type for checking if an atom exists
 * @param atomId - The atom ID to check
 * @returns Promise resolving to true if atom exists, false otherwise
 */
export type CheckAtomExistsFn = (atomId: string) => Promise<boolean>;

export interface ReferenceNodeConfig {
  customContent?: (reference: AffineReference) => TemplateResult;
  interactable?: boolean;
  hidePopup?: boolean;
  /** Optional function to check if an atom exists (for atoms with atomType in params) */
  checkAtomExists?: CheckAtomExistsFn;
}

export const ReferenceNodeConfigExtension =
  ConfigExtensionFactory<ReferenceNodeConfig>('AffineReferenceNodeConfig');

export class ReferenceNodeConfigProvider {
  private _customContent:
    | ((reference: AffineReference) => TemplateResult)
    | undefined = undefined;

  private _hidePopup = false;

  private _interactable = true;

  private _checkAtomExists: CheckAtomExistsFn | undefined = undefined;

  get customContent() {
    return this._customContent;
  }

  get doc() {
    return this.std.store;
  }

  get hidePopup() {
    return this._hidePopup;
  }

  get interactable() {
    return this._interactable;
  }

  get checkAtomExists() {
    return this._checkAtomExists;
  }

  constructor(readonly std: BlockStdScope) {}

  setCustomContent(content: ReferenceNodeConfigProvider['_customContent']) {
    this._customContent = content;
  }

  setHidePopup(hidePopup: boolean) {
    this._hidePopup = hidePopup;
  }

  setInteractable(interactable: boolean) {
    this._interactable = interactable;
  }

  setCheckAtomExists(fn: CheckAtomExistsFn | undefined) {
    this._checkAtomExists = fn;
  }
}
