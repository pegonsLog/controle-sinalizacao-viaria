import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-header">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="32" height="32">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h1>CSV</h1>
            <p class="subtitle">Controle de Sinalização Viária</p>
          </div>
          
          <form (ngSubmit)="login()" class="login-form">
            <div class="form-group">
              <label for="matricula">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Matrícula
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="matricula"
                  [(ngModel)]="matricula"
                  name="matricula"
                  placeholder="Digite sua matrícula"
                  required
                  autocomplete="username"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="senha">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Senha
              </label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="senha"
                  [(ngModel)]="senha"
                  name="senha"
                  placeholder="Digite sua senha"
                  required
                  autocomplete="current-password"
                />
              </div>
            </div>
            
            @if (erro) {
              <div class="erro">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {{ erro }}
              </div>
            }
            
            <button type="submit" [disabled]="loading" class="btn-login">
              @if (loading) {
                <span class="spinner"></span>
                Entrando...
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Entrar no Sistema
              }
            </button>
          </form>
        </div>     
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #142840 50%, #0f1f30 100%);
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 159, 223, 0.1) 0%, transparent 50%);
      animation: pulse 15s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .login-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 1.5rem;
    }

    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-icon {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #3b9fdf 0%, #1e3a5f 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      color: white;
      box-shadow: 0 10px 30px rgba(59, 159, 223, 0.3);
    }

    h1 {
      color: #1e3a5f;
      font-size: 1.625rem;
      font-weight: 700;
      margin: 0 0 0.375rem;
      letter-spacing: -0.025em;
    }

    .subtitle {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    label svg {
      color: #6b7280;
    }

    .input-wrapper {
      position: relative;
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
      background: #f9fafb;
    }

    input:focus {
      outline: none;
      border-color: #3b9fdf;
      background: white;
      box-shadow: 0 0 0 4px rgba(59, 159, 223, 0.1);
    }

    input::placeholder {
      color: #9ca3af;
    }

    .btn-login {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(30, 58, 95, 0.3);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .erro {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #b91c1c;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid #fecaca;
    }

    .copyright {
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8125rem;
      margin-top: 1.5rem;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  matricula = '';
  senha = '';
  erro = '';
  loading = false;

  async login(): Promise<void> {
    if (!this.matricula || !this.senha) {
      this.erro = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.erro = '';

    try {
      const sucesso = await this.authService.login(this.matricula, this.senha);
      if (sucesso) {
        this.router.navigate(['/solicitacoes']);
      } else {
        this.erro = 'Matrícula ou senha inválidos';
      }
    } catch (error) {
      this.erro = 'Erro ao fazer login. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}
