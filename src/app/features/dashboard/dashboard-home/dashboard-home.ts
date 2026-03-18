import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStore } from '../../../core/stores/dashboard.store';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHomeComponent {
  private dashboardStore: DashboardStore;

  loading;
  stats;

  constructor(dashboardStore: DashboardStore) {
    this.dashboardStore = dashboardStore;
    this.loading = dashboardStore.loading;
    this.stats = dashboardStore.stats;
  }

  ngOnInit(): void {
    void this.dashboardStore.load();
  }
}
