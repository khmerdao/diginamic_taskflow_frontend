import { TaskPriority, TaskStatus } from "./task.model";

export interface TaskUpdate {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  category_id: number | null;
}