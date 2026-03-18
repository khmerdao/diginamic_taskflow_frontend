import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { Task } from '../../../core/models/task.model';
import { TasksStore } from '../../../core/stores/tasks.store';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgClass],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tasksStore = inject(TasksStore);
  private router = inject(Router);
  private toast = inject(ToastService);

  taskId = signal<number | null>(null);
  loading = signal(false);
  deleting = signal(false);
  task = signal<Task | null>(null);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskId.set(id ? Number(id) : null);

    if (!id) {
      this.errorMessage.set('Identifiant de tâche invalide');
      return;
    }

    this.loading.set(true);
    this.tasksStore
      .getById(id)
      .then((t) => (this.task.set(t)))
      .catch((err) => {
        const message = err?.error?.message || 'Impossible de charger la tâche';
        this.errorMessage.set(message);
        this.toast.error(message);
      })
      .finally(() => (this.loading.set(false)));
  }

  getCategoryLabel(task: Task): string {
    if (!task.category) return '—';
    if (typeof task.category === 'number') return `Catégorie #${task.category}`;
    return (task.category as Category).name;
  }

  changeStatus(status: string): void {
    if (!this.task()) return;

    const currentTaskId = this.taskId(); 
    if (!currentTaskId) return;

    this.tasksStore
      .updateStatus(currentTaskId, status)
      .then(() => {
        const updated = this.tasksStore.items().find((t) => t.id === this.taskId());
        if (updated) this.task.set(updated);
        this.toast.success('Statut mis à jour');
      })
      .catch((err) => {
        const message = err?.error?.message || 'Impossible de mettre à jour le statut';
        this.errorMessage.set(message);
        this.toast.error(message);
      });
  }

  deleteTask(): void {
    if (!this.task) return;

    const ok = confirm('Supprimer cette tâche ?');
    if (!ok) return;

    const currentTaskId = this.taskId();
    if (!currentTaskId) return;
    
    this.deleting.set(true);
    this.tasksStore
      .remove(currentTaskId)
      .then(() => {
        this.toast.success('Tâche supprimée');
        this.router.navigate(['/tasks']);
      })
      .catch((err) => {
        const message = err?.error?.message || 'Impossible de supprimer la tâche';
        this.errorMessage.set(message);
        this.toast.error(message);
      })
      .finally(() => (this.deleting.set(false)));
  }
}
