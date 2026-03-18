import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DashboardStore } from '../../../core/stores/dashboard.store';
import { TasksStore } from '../../../core/stores/tasks.store';
import { Category } from '../../../core/models/category.model';
import { Task } from '../../../core/models/task.model';

type KanbanStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DragDropModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHomeComponent {
  private dashboardStore = inject(DashboardStore);
  private tasksStore = inject(TasksStore);

  loading = this.dashboardStore.loading;
  stats = this.dashboardStore.stats;

  tasksLoading = this.tasksStore.loading;
  tasksError = this.tasksStore.error;
  tasks = this.tasksStore.items;

  /**
   * Les tableaux mutables utilisés par le CDK (les `computed()` sont en lecture seule).
   * On les reconstruit à chaque changement du signal `tasks()`.
   */
  todoList: Task[] = [];
  inProgressList: Task[] = [];
  doneList: Task[] = [];
  cancelledList: Task[] = [];

  private syncKanbanLists(): void {
    // Important: on crée de nouveaux tableaux pour éviter les effets de bord.
    this.todoList = this.tasks().filter((t) => t.status === 'todo');
    this.inProgressList = this.tasks().filter((t) => t.status === 'in_progress');
    this.doneList = this.tasks().filter((t) => t.status === 'done');
    this.cancelledList = this.tasks().filter((t) => t.status === 'cancelled');
  }

  constructor() {
    // Synchronise les listes Kanban à chaque changement des tâches.
    effect(() => {
      this.tasks();
      this.syncKanbanLists();
    });
  }

  ngOnInit(): void {
    void this.dashboardStore.load();
    // Kanban: on charge les tâches une fois, puis on les regroupe par statut côté front.
    void this.tasksStore.load();
  }

  async onDrop(event: CdkDragDrop<Task[]>, newStatus: KanbanStatus): Promise<void> {
    const task: Task | undefined = event.item?.data;

    // Réordonner dans la même colonne
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    if (!task) return;

    // mise à jour locale (évite tout clignotement si le store met un peu de temps à se resynchroniser)
    (task as any).status = newStatus;

    // UI optimistic move
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Persist status
    try {
      await this.tasksStore.updateStatus(task.id, newStatus);
    } catch {
      // rollback: on resynchronise depuis le store
      this.syncKanbanLists();
    }
  }

  public isCategory(category: unknown): category is Category {
    return typeof category === 'object' && category !== null;
  }
}
