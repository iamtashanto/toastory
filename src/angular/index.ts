import {
  Component,
  Injectable,
  Input,
  NgModule,
  type OnChanges,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import type { GlazeConfig, ToastApi, ToastRecord } from '../core';
import { canMountToaster, mountToaster } from '../web/toaster';
import type { ToasterHandle } from '../web/toaster';
import { getEngine, setAutoMount } from '../web/engine';
import { toast, ui } from '../web/ui';

export { ui, toast };
export type { Ui } from '../web/ui';

/** Injectable Angular service for toastory toast and feedback toolkit. */
@Injectable({
  providedIn: 'root',
})
export class GlazeService {
  readonly ui = ui;
  readonly toast: ToastApi = toast;

  /** Observable stream of active toasts. */
  readonly toasts$: Observable<readonly ToastRecord[]> = new Observable((subscriber) => {
    const engine = getEngine();
    subscriber.next(engine.store.getToasts());
    const unsub = engine.store.subscribe(() => {
      subscriber.next(engine.store.getToasts());
    });
    return () => unsub();
  });

  /** Observable stream of current configuration. */
  readonly config$: Observable<Readonly<GlazeConfig>> = new Observable((subscriber) => {
    const engine = getEngine();
    subscriber.next(engine.store.config.get());
    const unsub = engine.store.config.subscribe(() => {
      subscriber.next(engine.store.config.get());
    });
    return () => unsub();
  });

  configure(patch: Partial<GlazeConfig>): Readonly<GlazeConfig> {
    return ui.configure(patch);
  }
}

/** Standalone component managing the toastory Toaster inside Angular applications. */
@Component({
  selector: 'glaze-toaster',
  standalone: true,
  template: '',
})
export class GlazeToasterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() theme?: string;
  @Input() mode?: GlazeConfig['mode'];
  @Input() position?: GlazeConfig['position'];
  @Input() duration?: number;
  @Input() maxVisible?: number;
  @Input() gap?: number;
  @Input() stack?: boolean;
  @Input() dir?: GlazeConfig['dir'];
  @Input() hotkey?: string;
  @Input() richColors?: boolean;
  @Input() closeButton?: boolean;
  @Input() shadow?: boolean;

  private handle?: ToasterHandle;

  ngOnInit(): void {
    this.applyInputs();
    setAutoMount(false);
    if (canMountToaster()) {
      const engine = getEngine();
      this.handle = mountToaster(engine.store);
    }
  }

  ngOnChanges(): void {
    this.applyInputs();
  }

  ngOnDestroy(): void {
    if (this.handle) {
      this.handle.destroy();
      this.handle = undefined;
    }
    setAutoMount(true);
  }

  private applyInputs(): void {
    const patch: Partial<GlazeConfig> = {};
    if (this.theme !== undefined) patch.theme = this.theme;
    if (this.mode !== undefined) patch.mode = this.mode;
    if (this.position !== undefined) patch.position = this.position;
    if (this.duration !== undefined) patch.duration = this.duration;
    if (this.maxVisible !== undefined) patch.maxVisible = this.maxVisible;
    if (this.gap !== undefined) patch.gap = this.gap;
    if (this.stack !== undefined) patch.stack = this.stack;
    if (this.dir !== undefined) patch.dir = this.dir;
    if (this.hotkey !== undefined) patch.hotkey = this.hotkey;
    if (this.richColors !== undefined) patch.richColors = this.richColors;
    if (this.closeButton !== undefined) patch.closeButton = this.closeButton;
    if (this.shadow !== undefined) patch.shadow = this.shadow;

    if (Object.keys(patch).length > 0) {
      ui.configure(patch);
    }
  }
}

/** Optional Angular Module for non-standalone workflows. */
@NgModule({
  imports: [GlazeToasterComponent],
  exports: [GlazeToasterComponent],
})
export class GlazeModule {}

/** Rebranded aliases for toastory Angular integration. */
export const ToastoryService = GlazeService;
export type ToastoryService = GlazeService;
export const ToastoryToasterComponent = GlazeToasterComponent;
export type ToastoryToasterComponent = GlazeToasterComponent;
export const ToastoryModule = GlazeModule;
export type ToastoryModule = GlazeModule;
