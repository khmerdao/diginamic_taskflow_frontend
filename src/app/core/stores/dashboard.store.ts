import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly _loading = signal(false);
  private readonly _stats = signal<any | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasStats = computed(() => !!this._stats());

  constructor(private dashboardService: DashboardService) {}

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const stats = await firstValueFrom(this.dashboardService.getStats());
      this._stats.set(stats ?? null);
    } catch (e: any) {
      this._stats.set(null);
      this._error.set(e?.error?.message ?? 'Impossible de charger les statistiques');
    } finally {
      this._loading.set(false);
    }
  }
}
