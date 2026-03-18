import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isLoggedIn = computed(() => !!this._user() || this.authService.isLoggedIn());

  constructor(private authService: AuthService) {
    this._user.set(this.authService.currentUser());
  }

  async login(email: string, password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.authService.login({ email, password }));
      const me = await firstValueFrom(this.authService.getMe());
      this._user.set(me);
    } catch (e: any) {
      this._error.set(e?.error?.message ?? 'Erreur de connexion');
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  async register(username: string, email: string, password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.authService.register({ username, email, password }));
    } catch (e: any) {
      this._error.set(e?.error?.message ?? 'Erreur lors de l’inscription');
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  async refreshMe(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this._user.set(null);
      return;
    }

    this._loading.set(true);
    this._error.set(null);
    try {
      const me = await firstValueFrom(this.authService.getMe());
      this._user.set(me);
    } catch (e: any) {
      this._error.set(e?.error?.message ?? 'Impossible de récupérer le profil');
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this._user.set(null);
  }
}
