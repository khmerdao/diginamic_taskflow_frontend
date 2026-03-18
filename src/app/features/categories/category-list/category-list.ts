import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { CategoriesStore } from '../../../core/stores/categories.store';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryListComponent implements OnInit {
  private categoriesStore = inject(CategoriesStore);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  categories = this.categoriesStore.items;
  loading = this.categoriesStore.loading;
  error = this.categoriesStore.error;

  hasError = computed(() => !!this.error());

  editingId: number | null = null;
  saving = false;
  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    color: ['#0d6efd', [Validators.required]],
  });

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    await this.categoriesStore.load();
    if (this.categoriesStore.error()) {
      this.toast.error(this.categoriesStore.error()!);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await this.categoriesStore.remove(id);
      this.toast.success('Catégorie supprimée');
    } catch (err: any) {
      this.toast.error(err?.error?.message || 'Impossible de supprimer la catégorie');
    }
  }

  startEdit(c: Category): void {
    this.editingId = c.id;
    this.editForm.setValue({ name: c.name, color: c.color });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  async saveEdit(): Promise<void> {
    if (!this.editingId) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.editForm.getRawValue() as any;
    try {
      await this.categoriesStore.update(this.editingId, payload);
      this.toast.success('Catégorie mise à jour');
      this.editingId = null;
    } catch (err: any) {
      this.toast.error(err?.error?.message || 'Impossible de mettre à jour la catégorie');
    } finally {
      this.saving = false;
    }
  }
}
