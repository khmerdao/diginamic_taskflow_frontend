import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.scss',
})
export class ToastHostComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
