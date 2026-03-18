import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TasksStore } from '../../../core/stores/tasks.store';
import { CategoriesStore } from '../../../core/stores/categories.store';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent implements OnInit {
  private tasksStore = inject(TasksStore);
  private categoriesStore = inject(CategoriesStore);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  tasks = this.tasksStore.items;
  loading = this.tasksStore.loading;
  categories = this.categoriesStore.items;
  error = this.tasksStore.error;

  hasError = computed(() => !!this.error());

  filtersForm = this.fb.group({
    status: [''],
    priority: [''],
    category: [''],
    q: [''],
  });

  ngOnInit(): void {
    void this.categoriesStore.load();
    void this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    const raw = this.filtersForm.getRawValue();
    const filters: Record<string, any> = {
      status: raw.status,
      priority: raw.priority,
      category: raw.category,
      q: raw.q,
    };

    await this.tasksStore.load(filters);
  }

  clearFilters(): void {
    this.filtersForm.reset({ status: '', priority: '', category: '', q: '' });
    void this.loadTasks();
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await this.tasksStore.remove(id);
      this.toast.success('Tâche supprimée');
    } catch {
      this.toast.error(this.tasksStore.error() ?? 'Impossible de supprimer la tâche');
    }
  }

  async changeStatus(id: number, status: string): Promise<void> {
    try {
      await this.tasksStore.updateStatus(id, status);
      this.toast.success('Statut mis à jour');
    } catch {
      this.toast.error(this.tasksStore.error() ?? 'Impossible de mettre à jour le statut');
    }
  }

  public isCategory(category: unknown): category is Category {
    return typeof category === 'object' && category !== null;
  }
}
