import type { Disposable } from '@blocksuite/global/disposable';
import {
  autoPlacement,
  autoUpdate,
  computePosition,
  offset,
  type Placement,
  type Rect,
  shift,
  size,
} from '@floating-ui/dom';

export function listenClickAway(
  element: HTMLElement,
  onClickAway: () => void,
  popperElement?: HTMLElement,
  hostElement?: HTMLElement  // 新增：宿主元素，用于检查是否仍然有效
): Disposable {
  let disposed = false;

  const callback = (event: MouseEvent) => {
    // 如果已被清理，直接返回
    if (disposed) {
      document.removeEventListener('click', callback);
      return;
    }
    
    // 如果宿主元素存在但不在 DOM 中，说明这是一个过时的监听器
    if (hostElement && !hostElement.isConnected) {
      disposed = true;
      document.removeEventListener('click', callback);
      return;
    }
    
    // 如果元素已不在 DOM 中，自动清理监听器
    if (!element.isConnected) {
      disposed = true;
      document.removeEventListener('click', callback);
      return;
    }
    
    // 如果 popperElement 存在但不在 DOM 中，说明这是一个过时的监听器
    if (popperElement && !popperElement.isConnected) {
      disposed = true;
      document.removeEventListener('click', callback);
      return;
    }

    const path = event.composedPath();
    
    // 检查点击是否在宿主元素内部（包括 shadow DOM）
    const insideHost = hostElement ? path.includes(hostElement) : false;
    const insideReference = path.includes(element);
    const insidePopper = popperElement ? path.includes(popperElement) : false;
    
    // 点击在 host、reference 或 popper 内部时不触发 clickAway
    if (!insideHost && !insideReference && !insidePopper) {
      onClickAway();
    }
  };

  document.addEventListener('click', callback);

  return {
    dispose: () => {
      disposed = true;
      document.removeEventListener('click', callback);
    },
  };
}

type Display = 'show' | 'hidden';

const ATTR_SHOW = 'data-show';

export type ButtonPopperOptions = {
  reference: HTMLElement;
  popperElement: HTMLElement;
  hostElement?: HTMLElement;  // 新增：宿主元素
  stateUpdated?: (state: { display: Display }) => void;
  mainAxis?: number;
  crossAxis?: number;
  allowedPlacements?: Placement[];
  rootBoundary?: Rect | (() => Rect | undefined);
  offsetHeight?: number;
};
/**
 * Using attribute 'data-show' to control popper visibility.
 *
 * ```css
 * selector {
 *   display: none;
 * }
 * selector[data-show] {
 *   display: block;
 * }
 * ```
 */
export function createButtonPopper(options: ButtonPopperOptions) {
  let display: Display = 'hidden';
  let cleanup: (() => void) | void;
  const {
    reference,
    popperElement,
    hostElement,
    stateUpdated = () => {},
    mainAxis,
    crossAxis,
    allowedPlacements = ['top', 'bottom'],
    rootBoundary,
    offsetHeight,
  } = options;

  const originMaxHeight = window.getComputedStyle(popperElement).maxHeight;

  function compute() {
    const overflowOptions = {
      rootBoundary:
        typeof rootBoundary === 'function' ? rootBoundary() : rootBoundary,
    };

    computePosition(reference, popperElement, {
      middleware: [
        offset({
          mainAxis: mainAxis ?? 14,
          crossAxis: crossAxis ?? 0,
        }),
        autoPlacement({
          allowedPlacements,
          ...overflowOptions,
        }),
        shift(overflowOptions),
        size({
          ...overflowOptions,
          apply({ availableHeight }) {
            popperElement.style.maxHeight =
              originMaxHeight && originMaxHeight !== 'none'
                ? `min(${originMaxHeight}, ${availableHeight}px)`
                : `${availableHeight - (offsetHeight ?? 0)}px`;
          },
        }),
      ],
    })
      .then(({ x, y }) => {
        Object.assign(popperElement.style, {
          position: 'absolute',
          zIndex: 1,
          left: `${x}px`,
          top: `${y}px`,
        });
      })
      .catch(console.error);
  }

  const show = (force = false) => {
    const displayed = display === 'show';

    if (displayed && !force) return;

    if (!displayed) {
      popperElement.setAttribute(ATTR_SHOW, '');
      display = 'show';
      stateUpdated({ display });
    }

    cleanup?.();
    cleanup = autoUpdate(reference, popperElement, compute, {
      animationFrame: true,
    });
  };

  const hide = () => {
    if (display === 'hidden') return;
    popperElement.removeAttribute(ATTR_SHOW);
    display = 'hidden';
    stateUpdated({ display });
    cleanup?.();
  };

  const toggle = () => {
    if (popperElement.hasAttribute(ATTR_SHOW)) {
      hide();
    } else {
      show();
    }
  };

  const clickAway = listenClickAway(reference, () => hide(), popperElement, hostElement);

  return {
    get state() {
      return display;
    },
    show,
    hide,
    toggle,
    dispose: () => {
      cleanup?.();
      clickAway.dispose();
    },
  };
}
