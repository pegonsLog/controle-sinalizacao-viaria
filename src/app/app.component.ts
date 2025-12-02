import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LayoutComponent],
  template: `
    @if (authService.isLoggedIn()) {
      <app-layout></app-layout>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styles: []
})
export class AppComponent {
  authService = inject(AuthService);
}
