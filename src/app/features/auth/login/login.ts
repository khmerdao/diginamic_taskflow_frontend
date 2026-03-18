import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/stores/auth.store';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(ToastService);

  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue() as { email: string; password: string };
    this.authStore
      .login(email, password)
      .then(() => {
        this.toast.success('Connexion réussie');
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.errorMessage = this.authStore.error() ?? err?.error?.message ?? 'Erreur de connexion';
        this.toast.error(this.errorMessage);
      });
  }
}
