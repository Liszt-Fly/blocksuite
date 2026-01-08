import {
  copyMiddleware,
  defaultImageProxyMiddleware,
  titleMiddleware,
} from '@blocksuite/affine-shared/adapters';
import {
  copySelectedModelsCommand,
  draftSelectedModelsCommand,
  getSelectedModelsCommand,
} from '@blocksuite/affine-shared/commands';
import { DisposableGroup } from '@blocksuite/global/disposable';
import { LifeCycleWatcher, type UIEventHandler } from '@blocksuite/std';

/**
 * ReadOnlyClipboard is a class that provides a read-only clipboard for the root block.
 * It is supported to copy models in the root block.
 */
export class ReadOnlyClipboard extends LifeCycleWatcher {
  static override key = 'affine-readonly-clipboard';

  protected _eventUnsubscribers: Array<() => void> = [];

  protected readonly _copySelectedInPage = (onCopy?: () => void) => {
    return this.std.command
      .chain()
      .with({ onCopy })
      .pipe(getSelectedModelsCommand, { types: ['block', 'text', 'image'] })
      .pipe(draftSelectedModelsCommand)
      .pipe(copySelectedModelsCommand);
  };

  protected _disposables = new DisposableGroup();

  protected _resetRuntime = () => {
    this._eventUnsubscribers.forEach(off => {
      try {
        off();
      } catch {
        // ignore
      }
    });
    this._eventUnsubscribers = [];

    try {
      this._disposables.dispose();
    } catch {
      // ignore
    }
    this._disposables = new DisposableGroup();
  };

  protected _initAdapters = () => {
    const copy = copyMiddleware(this.std);
    const title = titleMiddleware(this.std.store.workspace.meta.docMetas);
    const imageProxy = defaultImageProxyMiddleware;
    this.std.clipboard.use(copy);
    this.std.clipboard.use(
      title
    );
    this.std.clipboard.use(imageProxy);

    this._disposables.add({
      dispose: () => {
        this.std.clipboard.unuse(copy);
        this.std.clipboard.unuse(
          title
        );
        this.std.clipboard.unuse(imageProxy);
      },
    });
  };

  onPageCopy: UIEventHandler = ctx => {
    const e = ctx.get('clipboardState').raw;
    e.preventDefault();

    this._copySelectedInPage().run();
  };

  override mounted(): void {
    if (!navigator.clipboard) {
      console.error(
        'navigator.clipboard is not supported in current environment.'
      );
      return;
    }
    this._resetRuntime();
    this._eventUnsubscribers.push(this.std.event.add('copy', this.onPageCopy));
    this._initAdapters();
  }

  override unmounted(): void {
    this._eventUnsubscribers.forEach(off => {
      try {
        off();
      } catch {
        // ignore
      }
    });
    this._eventUnsubscribers = [];

    try {
      this._disposables.dispose();
    } catch {
      // ignore
    }
  }
}
