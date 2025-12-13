import type { Constructor } from '@blocksuite/global/utils';
import type { CSSResultGroup, CSSResultOrNative } from 'lit';
import { CSSResult, LitElement } from 'lit';

function scopeShadowlessCssText(cssText: string, scopeSelector: string): string {
  if (!scopeSelector) return cssText;

  const replaceHostSelectors = (selectorText: string) => {
    // Transform Shadow DOM specific :host(...) into light DOM selectors.
    // Examples:
    //   :host { ... }              -> <tag> { ... }
    //   :host([foo]) .bar { ... }  -> <tag>[foo] .bar { ... }
    return selectorText
      .replace(/:host\(([^)]+)\)/g, `${scopeSelector}$1`)
      .replace(/:host\b/g, scopeSelector);
  };

  const scopeSelectorList = (selectorText: string) => {
    const selectors = selectorText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(replaceHostSelectors)
      .map(sel => {
        // Allow intentionally global selectors to stay global.
        if (sel === ':root' || sel.startsWith(':root ') || sel.startsWith('html') || sel.startsWith('body')) {
          return sel;
        }

        // If already scoped, don't double-scope.
        if (sel === scopeSelector) return sel;
        if (sel.startsWith(scopeSelector)) {
          const next = sel[scopeSelector.length];
          if (
            next === ' ' ||
            next === '[' ||
            next === '.' ||
            next === '#' ||
            next === ':' ||
            next === '>' ||
            next === '+' ||
            next === '~' ||
            next === '*' ||
            next === undefined
          ) {
            return sel;
          }
        }
        return `${scopeSelector} ${sel}`;
      });
    return selectors.join(', ');
  };

  const serializeRules = (rules: CSSRuleList): string => {
    const out: string[] = [];
    for (const rule of Array.from(rules)) {
      // Keep keyframes and other at-rules as-is.
      if ((globalThis as any).CSSKeyframesRule && rule instanceof CSSKeyframesRule) {
        out.push(rule.cssText);
        continue;
      }
      if ((globalThis as any).CSSFontFaceRule && rule instanceof CSSFontFaceRule) {
        out.push(rule.cssText);
        continue;
      }

      if ((globalThis as any).CSSMediaRule && rule instanceof CSSMediaRule) {
        out.push(`@media ${rule.conditionText}{${serializeRules(rule.cssRules)}}`);
        continue;
      }
      if ((globalThis as any).CSSSupportsRule && rule instanceof CSSSupportsRule) {
        out.push(`@supports ${rule.conditionText}{${serializeRules(rule.cssRules)}}`);
        continue;
      }

      if (rule instanceof CSSStyleRule) {
        const selectorText = scopeSelectorList(rule.selectorText);
        out.push(`${selectorText}{${rule.style.cssText}}`);
        continue;
      }

      out.push(rule.cssText);
    }
    return out.join('\n');
  };

  // Prefer browser CSS parser for correctness. Fallback keeps existing behavior.
  try {
    if (typeof CSSStyleSheet === 'undefined') return replaceHostSelectors(cssText);
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    return serializeRules(sheet.cssRules);
  } catch {
    return replaceHostSelectors(cssText);
  }
}

export class ShadowlessElement extends LitElement {
  // Map of the number of styles injected into a node
  // A reference count of the number of ShadowlessElements that are still connected
  static connectedCount = new WeakMap<
    Constructor, // class
    WeakMap<Node, number>
  >();

  static onDisconnectedMap = new WeakMap<
    Constructor, // class
    WeakMap<Node, (() => void) | null>
  >();

  // NOTE: ShadowlessElement renders into light DOM (no shadow root).
  // We must not inject raw (unscoped) CSS into the document, otherwise selectors
  // like `input { ... }` will affect the whole app.
  protected static override finalizeStyles(
    styles?: CSSResultGroup
  ): CSSResultOrNative[] {
    return super.finalizeStyles(styles);
  }

  private getConnectedCount() {
    const SE = this.constructor as typeof ShadowlessElement;
    return SE.connectedCount.get(SE)?.get(this.getRootNode()) ?? 0;
  }

  private setConnectedCount(count: number) {
    const SE = this.constructor as typeof ShadowlessElement;

    if (!SE.connectedCount.has(SE)) {
      SE.connectedCount.set(SE, new WeakMap());
    }

    SE.connectedCount.get(SE)?.set(this.getRootNode(), count);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const parentRoot = this.getRootNode();
    const SE = this.constructor as typeof ShadowlessElement;
    const styleInjectedCount = this.getConnectedCount();

    if (styleInjectedCount === 0) {
      if (typeof document === 'undefined') {
        this.setConnectedCount(styleInjectedCount + 1);
        return;
      }
      const elementStyles = SE.elementStyles;
      const injectedStyles: HTMLStyleElement[] = [];
      const scopeSelector = this.localName;
      const injectionTarget =
        parentRoot instanceof ShadowRoot ? parentRoot : document.head;

      elementStyles.forEach((s: CSSResultOrNative) => {
        if (s instanceof CSSResult) {
          const style = document.createElement('style');
          style.textContent = scopeShadowlessCssText(s.cssText, scopeSelector);
          injectionTarget.prepend(style);
          injectedStyles.push(style);
        }
      });
      if (!SE.onDisconnectedMap.has(SE)) {
        SE.onDisconnectedMap.set(SE, new WeakMap());
      }
      SE.onDisconnectedMap.get(SE)?.set(parentRoot, () => {
        injectedStyles.forEach(style => style.remove());
      });
    }
    this.setConnectedCount(styleInjectedCount + 1);
  }

  override createRenderRoot() {
    return this;
  }

  override disconnectedCallback(): void {
    const parentRoot = this.getRootNode();
    super.disconnectedCallback();
    const SE = this.constructor as typeof ShadowlessElement;
    let styleInjectedCount = this.getConnectedCount();
    styleInjectedCount--;
    this.setConnectedCount(styleInjectedCount);

    if (styleInjectedCount === 0) {
      // remove the style element when the last shadowless element is disconnected in the parent root
      SE.onDisconnectedMap.get(SE)?.get(parentRoot)?.();
    }
  }
}
