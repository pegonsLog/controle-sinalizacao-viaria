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
      <div class="login-card">
        <h1>Controle de Sinalização Viária</h1>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="matricula">Matrícula</label>
            <input
              type="text"
              id="matricula"
              [(ngModel)]="matricula"
              name="matricula"
              placeholder="Digite sua matrícula"
              required
            />
          </div>
          <div class="form-group">
            <label for="senha">Senha</label>
            <input
              type="password"
              id="senha"
              [(ngModel)]="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
            />
          </div>
          @if (erro) {
            <div class="erro">{{ erro }}</div>
          }
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
    }

    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #1e3a5f;
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #2d5a87;
    }

    button {
      width: 100%;
      padding: 0.875rem;
      background: #1e3a5f;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover:not(:disabled) {
      background: #2d5a87;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .erro {
      background: #fee;
      color: #c00;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      text-align: center;
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
