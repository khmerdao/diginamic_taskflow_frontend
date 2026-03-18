import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHostComponent } from './shared/components/toast-host/toast-host';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastHostComponent],
  template: `<router-outlet /><app-toast-host />`,
  // templateUrl: './app.html',
  // styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
