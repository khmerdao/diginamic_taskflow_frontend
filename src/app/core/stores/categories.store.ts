import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly _loading = signal(false);
  private readonly _items = signal<Category[]>([]);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly items = this._items.asReadonly();
  readonly error = this._error.asReadonly();

  readonly count = computed(() => this._items().length);

  constructor(private categoryService: CategoryService) {}

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const cats = await firstValueFrom(this.categoryService.getAll());
      this._items.set(cats ?? []);
    } catch (e: any) {
      this._items.set([]);
      this._error.set(e?.error?.message ?? 'Erreur de chargement des catégories');
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: number): Promise<Category> {
    return firstValueFrom(this.categoryService.getById(id));
  }

  async create(payload: Partial<Category>): Promise<Category> {
    const created = await firstValueFrom(this.categoryService.create(payload));
    this._items.update((items) => [created, ...items]);
    return created;
  }

  async update(id: number, payload: Partial<Category>): Promise<Category> {
    const updated = await firstValueFrom(this.categoryService.update(id, payload));
    this._items.update((items) => items.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.categoryService.delete(id));
    this._items.update((items) => items.filter((c) => c.id !== id));
  }
}
