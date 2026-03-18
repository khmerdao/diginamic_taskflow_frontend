import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoriesStore } from '../../../core/stores/categories.store';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private categoriesStore = inject(CategoriesStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  categoryId: number | null = null;
  loading = false;
  saving = false;
  errorMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    color: ['#0d6efd', [Validators.required]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.categoryId = idParam ? Number(idParam) : null;

    if (this.categoryId) {
      this.loading = true;
      this.categoriesStore
        .getById(this.categoryId)
        .then((c) => this.form.patchValue({ name: c.name, color: c.color }))
        .catch((err) => {
          this.errorMessage = err?.error?.message || 'Impossible de charger la catégorie';
          this.toast.error(this.errorMessage);
        })
        .finally(() => (this.loading = false));
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as Partial<Category>;
    this.saving = true;

    const action = this.categoryId
      ? this.categoriesStore.update(this.categoryId, payload)
      : this.categoriesStore.create(payload);

    action
      .then(() => {
        this.toast.success('Catégorie enregistrée');
        this.router.navigate(['/categories']);
      })
      .catch((err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de l’enregistrement';
        this.toast.error(this.errorMessage);
      })
      .finally(() => (this.saving = false));
  }
}
