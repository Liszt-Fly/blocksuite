import { css } from 'lit';

const editLinkStyle = css`
  .affine-link-edit-popover {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    min-width: 320px;
  }

  .affine-edit-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    transition: transform 0.2s ease;
  }

  .affine-edit-area:focus-within {
    transform: translateX(2px);
  }

  .affine-edit-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--affine-text-secondary-color, #8e8e93);
    margin-left: 4px;
    user-select: none;
  }

  .affine-edit-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    font-family: var(--chronnote-ui-font, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif);
    color: var(--affine-text-primary-color, #1d1d1f);
    
    background: var(--affine-background-secondary-color, rgba(0, 0, 0, 0.03));
    border: 1px solid transparent;
    border-radius: 10px;
    outline: none;
    
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .affine-edit-input::placeholder {
    color: var(--affine-text-disable-color, rgba(60, 60, 67, 0.3));
    font-weight: 400;
  }

  .affine-edit-input:hover {
    background: var(--affine-background-secondary-color, rgba(0, 0, 0, 0.05));
  }

  .affine-edit-input:focus {
    background: var(--affine-background-primary-color, #fff);
    border-color: var(--affine-primary-color, #007aff);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15);
    transform: scale(1.01);
  }
`;

export const linkPopupStyle = css`
  :host {
    box-sizing: border-box;
    font-family: var(--chronnote-ui-font, 'Inter', system-ui, -apple-system, sans-serif);
    --popover-bg: var(--affine-background-primary-color, rgba(255, 255, 255, 0.85));
    --popover-border: rgba(255, 255, 255, 0.4);
    --popover-shadow: 
      0 6px 20px -6px rgba(0, 0, 0, 0.15),
      0 4px 12px -4px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --popover-bg: rgba(30, 30, 30, 0.85);
      --popover-border: rgba(255, 255, 255, 0.1);
      --popover-shadow: 
        0 8px 24px -6px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.08) inset;
    }
  }

  * {
    box-sizing: border-box;
  }

  .mock-selection {
    position: absolute;
    background-color: var(--affine-primary-color, #007aff);
    opacity: 0.2;
    border-radius: 3px;
    pointer-events: none;
  }

  .popover-container {
    z-index: var(--affine-z-index-popover, 100);
    position: absolute;
    
    background: var(--popover-bg);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    
    border-radius: 16px;
    box-shadow: var(--popover-shadow);
    
    animation: link-popup-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: center bottom;
    will-change: transform, opacity;
  }

  @keyframes link-popup-enter {
    0% {
      opacity: 0;
      transform: translateY(8px) scale(0.96);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .overlay-root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--affine-z-index-popover, 100);
    pointer-events: none; /* Let clicks pass through, container handles pointer events */
  }
  
  .popover-container {
    pointer-events: auto;
  }

  .overlay-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto; /* Catch clicks outside */
  }

  .mock-selection-container {
    pointer-events: none;
  }

  /* Create mode - Floating Capsule Design */
  .affine-link-popover.create {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 6px 6px 12px;
    height: 48px;
  }

  .affine-link-popover-input {
    flex: 1;
    min-width: 280px;
    padding: 0;
    border: none;
    background: transparent;
    
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--affine-text-primary-color, #1d1d1f);
    font-family: inherit;
    
    outline: none;
  }

  .affine-link-popover-input::placeholder {
    color: var(--affine-text-disable-color, rgba(60, 60, 67, 0.3));
    font-weight: 400;
  }

  /* Confirm button - Modern Floating Action Button style */
  .affine-confirm-button {
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: none;
    
    background: transparent;
    color: var(--affine-primary-color, #007aff);
    
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    
    position: relative;
    overflow: hidden;
  }

  .affine-confirm-button svg {
    width: 20px;
    height: 20px;
    z-index: 2;
    transition: transform 0.2s ease;
  }
  
  /* Hover effect with subtle background */
  .affine-confirm-button:hover:not([disabled]) {
    background: var(--affine-background-secondary-color, rgba(0, 0, 0, 0.05));
    transform: scale(1.05);
  }
  
  .affine-confirm-button:active:not([disabled]) {
    transform: scale(0.95);
  }

  .affine-confirm-button[disabled] {
    opacity: 0.3;
    pointer-events: none;
    filter: grayscale(1);
  }
  
  /* When typed in (Logic should be: if input has value, this button becomes prominent) */
  /* Since we don't have a direct 'has-value' class here easily without JS, rely on :not([disabled]) */
  
  .affine-confirm-button:not([disabled]) {
    background: var(--affine-primary-color, #007aff);
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  }
  
  .affine-confirm-button:not([disabled]):hover {
    background: var(--affine-primary-color, #0062cc); /* slightly darker */
    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
  }

  ${editLinkStyle}
`;
