import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IconComponent } from '../shared/components/icon/icon.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Sinalização Viária</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/solicitacoes" routerLinkActive="active">
            <app-icon name="clipboard-document-list" [size]="20"></app-icon>
            Solicitações
          </a>
          @if (authService.isAdmin()) {
            <a routerLink="/funcionarios" routerLinkActive="active">
              <app-icon name="users" [size]="20"></app-icon>
              Funcionários
            </a>
            <a routerLink="/sinalizacoes" routerLinkActive="active">
              <app-icon name="map-pin" [size]="20"></app-icon>
              Sinalizações
            </a>
            <a routerLink="/usuarios" routerLinkActive="active">
              <app-icon name="user" [size]="20"></app-icon>
              Usuários
            </a>
          }
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <app-icon name="user" [size]="18"></app-icon>
            <span>{{ authService.getUsuarioLogado()?.matriculaUsuario }}</span>
          </div>
          <button (click)="logout()" class="btn-logout">
            <app-icon name="arrow-right-on-rectangle" [size]="18"></app-icon>
            Sair
          </button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background: #1e3a5f;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.2s;
    }

    .sidebar-nav a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .sidebar-nav a.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-left: 3px solid white;
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .main-content {
      flex: 1;
      background: #f5f5f5;
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
