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
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-title">GARBO</span>
            <span class="logo-subtitle">Controle de Sinalização Viária</span>
          </div>
        </div>
        
        <nav class="header-nav">
          <a routerLink="/solicitacoes" routerLinkActive="active">
            <app-icon name="clipboard-document-list" [size]="18"></app-icon>
            <span>Solicitações</span>
          </a>
          
          @if (authService.isAdmin()) {
            <a routerLink="/funcionarios" routerLinkActive="active">
              <app-icon name="users" [size]="18"></app-icon>
              <span>Funcionários</span>
            </a>
            <a routerLink="/sinalizacoes" routerLinkActive="active">
              <app-icon name="map-pin" [size]="18"></app-icon>
              <span>Sinalizações</span>
            </a>
            <a routerLink="/usuarios" routerLinkActive="active">
              <app-icon name="user" [size]="18"></app-icon>
              <span>Usuários</span>
            </a>
          }
        </nav>
        
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              <app-icon name="user" [size]="16"></app-icon>
            </div>
            <div class="user-details">
              <span class="user-name">{{ authService.getUsuarioLogado()?.matriculaUsuario }}</span>
              <span class="user-role">{{ authService.isAdmin() ? 'Admin' : 'Usuário' }}</span>
            </div>
          </div>
          <button (click)="logout()" class="btn-logout" title="Sair do sistema">
            <app-icon name="arrow-right-on-rectangle" [size]="18"></app-icon>
          </button>
        </div>
      </header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: linear-gradient(135deg, #1e3a5f 0%, #142840 100%);
      color: white;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .logo {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .logo-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #3b9fdf;
      line-height: 1;
    }

    .logo-subtitle {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.02em;
      line-height: 1.3;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-nav a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .header-nav a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .header-nav a.active {
      color: white;
      background: rgba(59, 159, 223, 0.2);
    }

    .header-nav a.active app-icon {
      color: #3b9fdf;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.375rem 0.75rem 0.375rem 0.5rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 24px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b9fdf 0%, #2d7db5 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.6875rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.2;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fecaca;
    }

    .main-content {
      flex: 1;
      margin-top: 64px;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      min-height: calc(100vh - 64px);
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
