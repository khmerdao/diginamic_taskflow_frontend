import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/stores/auth.store';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayoutComponent {
  private authStore = inject(AuthStore);

  ngOnInit(): void {
    // On refresh, we may have a token but no user in memory.
    void this.authStore.refreshMe();
  }
}
