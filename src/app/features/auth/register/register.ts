import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/stores/auth.store';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(ToastService);

  errorMessage = '';

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.getRawValue() as {
      username: string;
      email: string;
      password: string;
    };

    this.authStore
      .register(username, email, password)
      .then(() => {
        this.toast.success('Compte créé. Tu peux te connecter.');
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        this.errorMessage = this.authStore.error() ?? err?.error?.message ?? 'Erreur de connexion';
        this.toast.error(this.errorMessage);
      });
  }
}
