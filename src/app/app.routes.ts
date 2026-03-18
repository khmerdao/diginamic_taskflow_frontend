import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskFormComponent } from './features/tasks/task-form/task-form';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail';
import { CategoryListComponent } from './features/categories/category-list/category-list';
import { CategoryFormComponent } from './features/categories/category-form/category-form';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './shared/components/auth-layout/auth-layout';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Protected area (requires JWT)
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardHomeComponent },
            { path: 'tasks', component: TaskListComponent },
            { path: 'tasks/new', component: TaskFormComponent },
            { path: 'tasks/:id', component: TaskDetailComponent },
            { path: 'tasks/:id/edit', component: TaskFormComponent },

            { path: 'categories', component: CategoryListComponent },
            { path: 'categories/new', component: CategoryFormComponent },
            { path: 'categories/:id/edit', component: CategoryFormComponent },
        ]
    },

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
