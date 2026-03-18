import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { firstValueFrom } from 'rxjs';
import { TaskUpdate } from '../models/taskUpdate.model';

export interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  q?: string;
}

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly _loading = signal(false);
  private readonly _items = signal<Task[]>([]);
  private readonly _error = signal<string | null>(null);
  private readonly _filters = signal<TaskFilters>({});

  readonly loading = this._loading.asReadonly();
  readonly items = this._items.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly count = computed(() => this._items().length);

  constructor(private taskService: TaskService) {}

  setFilters(filters: TaskFilters): void {
    this._filters.set(filters);
  }

  async load(filters?: TaskFilters): Promise<void> {
    const effective = filters ?? this._filters();
    this._filters.set(effective);

    this._loading.set(true);
    this._error.set(null);

    try {
      const tasks = await firstValueFrom(this.taskService.getAll(effective));
      console.log("tasks coco", tasks);
      this._items.set(tasks.items ?? []);
    } catch (e: any) {
      this._items.set([]);
      this._error.set(e?.error?.message ?? 'Erreur de chargement des tâches');
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: number): Promise<Task> {
    return firstValueFrom(this.taskService.getById(id));
  }

  async create(payload: Partial<TaskUpdate>): Promise<Task> {
    const created = await firstValueFrom(this.taskService.create(payload));
    // Keep store in sync
    this._items.update((items) => [created, ...items]);
    return created;
  }

  async update(id: number, payload: Partial<TaskUpdate>): Promise<Task> {
    const updated = await firstValueFrom(this.taskService.update(id, payload));
    this._items.update((items) => items.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async remove(id: number): Promise<void> {
    this._error.set(null);
    try {
      await firstValueFrom(this.taskService.delete(id));
      this._items.update((items) => items.filter((t) => t.id !== id));
    } catch (e: any) {
      this._error.set(e?.error?.message ?? 'Erreur lors de la suppression');
      throw e;
    }
  }

  async updateStatus(id: number, status: string): Promise<void> {
    this._error.set(null);
    try {
      const updated = await firstValueFrom(this.taskService.updateStatus(id, status));
      if (!updated) return;
      this._items.update((items) => items.map((t) => (t.id === id ? updated : t)));
    } catch (e: any) {
      this._error.set(e?.error?.message ?? 'Erreur lors de la mise à jour du statut');
      throw e;
    }
  }
}
