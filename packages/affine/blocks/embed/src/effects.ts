import { EmbedFigmaBlockComponent } from './embed-figma-block';
import { EmbedEdgelessBlockComponent } from './embed-figma-block/embed-edgeless-figma-block';
import { EmbedGithubBlockComponent } from './embed-github-block';
import { EmbedEdgelessGithubBlockComponent } from './embed-github-block/embed-edgeless-github-block';
import { EmbedHtmlBlockComponent } from './embed-html-block';
import { EmbedHtmlFullscreenToolbar } from './embed-html-block/components/fullscreen-toolbar';
import { EmbedEdgelessHtmlBlockComponent } from './embed-html-block/embed-edgeless-html-block';
import { EmbedIframeErrorCard } from './embed-iframe-block/components/embed-iframe-error-card';
import { EmbedIframeIdleCard } from './embed-iframe-block/components/embed-iframe-idle-card';
import { EmbedIframeLinkEditPopup } from './embed-iframe-block/components/embed-iframe-link-edit-popup';
import { EmbedIframeLinkInputPopup } from './embed-iframe-block/components/embed-iframe-link-input-popup';
import { EmbedIframeLoadingCard } from './embed-iframe-block/components/embed-iframe-loading-card';
import { EmbedEdgelessIframeBlockComponent } from './embed-iframe-block/embed-edgeless-iframe-block';
import { EmbedIframeBlockComponent } from './embed-iframe-block/embed-iframe-block';
import { EmbedLoomBlockComponent } from './embed-loom-block';
import { EmbedEdgelessLoomBlockComponent } from './embed-loom-block/embed-edgeless-loom-bock';
import { EmbedYoutubeBlockComponent } from './embed-youtube-block';
import { EmbedEdgelessYoutubeBlockComponent } from './embed-youtube-block/embed-edgeless-youtube-block';

export function effects() {
  if (!customElements.get('affine-embed-edgeless-figma-block')) {
    customElements.define(
      'affine-embed-edgeless-figma-block',
      EmbedEdgelessBlockComponent
    );
  }
  if (!customElements.get('affine-embed-figma-block')) {
    customElements.define('affine-embed-figma-block', EmbedFigmaBlockComponent);
  }

  if (!customElements.get('affine-embed-html-block')) {
    customElements.define('affine-embed-html-block', EmbedHtmlBlockComponent);
  }
  if (!customElements.get('affine-embed-edgeless-html-block')) {
    customElements.define(
      'affine-embed-edgeless-html-block',
      EmbedEdgelessHtmlBlockComponent
    );
  }

  if (!customElements.get('embed-html-fullscreen-toolbar')) {
    customElements.define(
      'embed-html-fullscreen-toolbar',
      EmbedHtmlFullscreenToolbar
    );
  }
  if (!customElements.get('affine-embed-edgeless-github-block')) {
    customElements.define(
      'affine-embed-edgeless-github-block',
      EmbedEdgelessGithubBlockComponent
    );
  }
  if (!customElements.get('affine-embed-github-block')) {
    customElements.define(
      'affine-embed-github-block',
      EmbedGithubBlockComponent
    );
  }

  if (!customElements.get('affine-embed-edgeless-youtube-block')) {
    customElements.define(
      'affine-embed-edgeless-youtube-block',
      EmbedEdgelessYoutubeBlockComponent
    );
  }
  if (!customElements.get('affine-embed-youtube-block')) {
    customElements.define('affine-embed-youtube-block', EmbedYoutubeBlockComponent);
  }

  if (!customElements.get('affine-embed-edgeless-loom-block')) {
    customElements.define(
      'affine-embed-edgeless-loom-block',
      EmbedEdgelessLoomBlockComponent
    );
  }
  if (!customElements.get('affine-embed-loom-block')) {
    customElements.define('affine-embed-loom-block', EmbedLoomBlockComponent);
  }

  if (!customElements.get('affine-embed-edgeless-iframe-block')) {
    customElements.define(
      'affine-embed-edgeless-iframe-block',
      EmbedEdgelessIframeBlockComponent
    );
  }
  if (!customElements.get('affine-embed-iframe-block')) {
    customElements.define('affine-embed-iframe-block', EmbedIframeBlockComponent);
  }
  if (!customElements.get('embed-iframe-link-input-popup')) {
    customElements.define(
      'embed-iframe-link-input-popup',
      EmbedIframeLinkInputPopup
    );
  }
  if (!customElements.get('embed-iframe-loading-card')) {
    customElements.define('embed-iframe-loading-card', EmbedIframeLoadingCard);
  }
  if (!customElements.get('embed-iframe-error-card')) {
    customElements.define('embed-iframe-error-card', EmbedIframeErrorCard);
  }
  if (!customElements.get('embed-iframe-idle-card')) {
    customElements.define('embed-iframe-idle-card', EmbedIframeIdleCard);
  }
  if (!customElements.get('embed-iframe-link-edit-popup')) {
    customElements.define(
      'embed-iframe-link-edit-popup',
      EmbedIframeLinkEditPopup
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-embed-figma-block': EmbedFigmaBlockComponent;
    'affine-embed-edgeless-figma-block': EmbedEdgelessBlockComponent;
    'affine-embed-github-block': EmbedGithubBlockComponent;
    'affine-embed-edgeless-github-block': EmbedEdgelessGithubBlockComponent;
    'affine-embed-html-block': EmbedHtmlBlockComponent;
    'affine-embed-edgeless-html-block': EmbedEdgelessHtmlBlockComponent;
    'embed-html-fullscreen-toolbar': EmbedHtmlFullscreenToolbar;
    'affine-embed-edgeless-loom-block': EmbedEdgelessLoomBlockComponent;
    'affine-embed-loom-block': EmbedLoomBlockComponent;
    'affine-embed-youtube-block': EmbedYoutubeBlockComponent;
    'affine-embed-edgeless-youtube-block': EmbedEdgelessYoutubeBlockComponent;
    'affine-embed-iframe-block': EmbedIframeBlockComponent;
    'embed-iframe-link-input-popup': EmbedIframeLinkInputPopup;
    'embed-iframe-loading-card': EmbedIframeLoadingCard;
    'embed-iframe-error-card': EmbedIframeErrorCard;
    'embed-iframe-idle-card': EmbedIframeIdleCard;
    'embed-iframe-link-edit-popup': EmbedIframeLinkEditPopup;
  }
}
