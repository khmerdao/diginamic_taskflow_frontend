import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { CategoriesStore } from '../../../core/stores/categories.store';
import { TasksStore } from '../../../core/stores/tasks.store';
import { ToastService } from '../../../core/services/toast.service';
import { TaskUpdate } from '../../../core/models/taskUpdate.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private tasksStore = inject(TasksStore);
  private categoriesStore = inject(CategoriesStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  taskId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  categories = signal<Category[]>([]);
  
  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(2000)]],
    status: [TaskStatus.TODO, [Validators.required]],
    priority: [TaskPriority.MEDIUM, [Validators.required]],
    due_date: [null as string | null],
    category: [null as number | null],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskId.set(idParam ? Number(idParam) : null);

    void this.loadCategories();

    const currentTaskId = this.taskId();
    if (currentTaskId) {
      console.log("update Task");
      this.loading.set(true);
      this.tasksStore
        .getById(currentTaskId)
        .then((task) => {this.patchForm(task)})
        .catch((err) => {
          const message = err?.error?.message || 'Impossible de charger la tâche';
          this.errorMessage.set(message);
          this.toast.error(message);
        })
        .finally(() => (this.loading.set(false)));
    }
  }

  private async loadCategories(): Promise<void> {
    await this.categoriesStore.load();
    this.categories.set(this.categoriesStore.items());
  }

  private patchForm(task: Task): void {
    this.form.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      category: typeof task.category === 'number' ? task.category : task.category?.id ?? null,
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Extraire category et renommer en category_id
    const formValue = this.form.getRawValue();
  
    const payload: Partial<TaskUpdate> = {
        title: formValue.title!,
        description: formValue.description || undefined,
        status: formValue.status!,
        priority: formValue.priority!,
        due_date: formValue.due_date || undefined,
        category_id: formValue.category || undefined, // ← Explicitement l'ID
    };
    this.saving.set(true);

    console.log("payload : ", payload);
    const currentTaskId = this.taskId();
    const action = currentTaskId
      ? this.tasksStore.update(currentTaskId, payload)
      : this.tasksStore.create(payload);

    action
      .then(() => {
        this.toast.success('Tâche enregistrée');
        this.router.navigate(['/tasks']);
      })
      .catch((err) => {
        const message = err?.error?.message || 'Erreur lors de l’enregistrement';
        this.errorMessage.set(message);
        this.toast.error(message);
      })
      .finally(() => (this.saving.set(false)));
  }
}
