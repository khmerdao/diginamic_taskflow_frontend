import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  autohide: boolean;
  delay: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  toasts = this._toasts.asReadonly();

  private createId(): string {
    // crypto.randomUUID is not available on some older browsers.
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (crypto as any).randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  show(message: string, opts?: Partial<Omit<ToastMessage, 'id' | 'message'>>): void {
    const toast: ToastMessage = {
      id: this.createId(),
      type: opts?.type ?? 'info',
      title: opts?.title,
      message,
      autohide: opts?.autohide ?? true,
      delay: opts?.delay ?? 3500,
    };

    this._toasts.update((t) => [toast, ...t]);

    if (toast.autohide) {
      window.setTimeout(() => this.dismiss(toast.id), toast.delay);
    }
  }

  success(message: string, title = 'Succès'): void {
    this.show(message, { type: 'success', title });
  }

  error(message: string, title = 'Erreur'): void {
    this.show(message, { type: 'danger', title, autohide: false });
  }

  dismiss(id: string): void {
    this._toasts.update((t) => t.filter((x) => x.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}
