import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  user = this.authStore.user;

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
