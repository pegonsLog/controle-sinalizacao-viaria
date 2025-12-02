import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/usuarios" class="back-link">
          <app-icon name="arrow-left" [size]="20"></app-icon>
          Voltar
        </a>
        <div class="header-content">
          <div class="header-icon">
            <app-icon name="user" [size]="24"></app-icon>
          </div>
          <div>
            <h1>{{ isEdicao ? 'Editar' : 'Novo' }} Usuário</h1>
            <p class="header-subtitle">{{ isEdicao ? 'Atualize os dados de acesso' : 'Configure o acesso ao sistema' }}</p>
          </div>
        </div>
      </div>

      <form (ngSubmit)="salvar()" class="form-card">
        <div class="form-section">
          <div class="form-group">
            <label for="matriculaUsuario">
              <app-icon name="identification" [size]="16"></app-icon>
              Matrícula
            </label>
            <input type="text" id="matriculaUsuario" [(ngModel)]="usuario.matriculaUsuario" name="matriculaUsuario" placeholder="Digite a matrícula" required />
          </div>

          <div class="form-group">
            <label for="senha">
              <app-icon name="lock-closed" [size]="16"></app-icon>
              Senha
            </label>
            <input type="password" id="senha" [(ngModel)]="usuario.senha" name="senha" [required]="!isEdicao" placeholder="{{ isEdicao ? 'Deixe em branco para manter' : 'Digite a senha' }}" />
            @if (isEdicao) {
              <span class="hint">Deixe em branco para manter a senha atual</span>
            }
          </div>

          <div class="form-group">
            <label for="perfil">
              <app-icon name="shield-check" [size]="16"></app-icon>
              Perfil de Acesso
            </label>
            <select id="perfil" [(ngModel)]="usuario.perfil" name="perfil" required>
              <option value="">Selecione o perfil...</option>
              <option value="Usuario">Usuário</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/usuarios" class="btn btn-secondary">
            <app-icon name="x-mark" [size]="18"></app-icon>
            Cancelar
          </a>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span>
              Salvando...
            } @else {
              <app-icon name="check" [size]="18"></app-icon>
              Salvar
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 640px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #6b7280; text-decoration: none; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; transition: color 0.2s; }
    .back-link:hover { color: #374151; }
    .header-content { display: flex; align-items: center; gap: 1rem; }
    .header-icon { width: 52px; height: 52px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }
    h1 { color: #1f2937; margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; }
    .header-subtitle { color: #6b7280; margin: 0.25rem 0 0; font-size: 0.875rem; }
    .form-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
    .form-section { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151; }
    label app-icon { color: #6b7280; }
    input, select { width: 100%; padding: 0.875rem 1rem; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 0.9375rem; transition: all 0.2s ease; background: #f9fafb; }
    input:focus, select:focus { outline: none; border-color: #8b5cf6; background: white; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
    input::placeholder { color: #9ca3af; }
    .hint { font-size: 0.75rem; color: #9ca3af; font-style: italic; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f3f4f6; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; transition: all 0.2s ease; }
    .btn-primary { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .btn-secondary { background: #f3f4f6; color: #4b5563; }
    .btn-secondary:hover { background: #e5e7eb; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class UsuarioFormComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuario: Usuario = { matriculaUsuario: '', senha: '', perfil: '' };
  senhaOriginal = '';
  isEdicao = false;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.usuarioService.buscarPorId(id).subscribe(data => {
        if (data) {
          this.usuario = data;
          this.senhaOriginal = data.senha;
          this.usuario.senha = '';
        }
      });
    }
  }

  async salvar(): Promise<void> {
    this.loading = true;
    try {
      if (this.isEdicao) {
        const dadosAtualizar: Partial<Usuario> = {
          matriculaUsuario: this.usuario.matriculaUsuario,
          perfil: this.usuario.perfil
        };
        if (this.usuario.senha) {
          dadosAtualizar.senha = this.usuario.senha;
        }
        await this.usuarioService.atualizar(this.usuario.id!, dadosAtualizar);
      } else {
        await this.usuarioService.criar(this.usuario);
      }
      this.router.navigate(['/usuarios']);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar usuário');
    } finally {
      this.loading = false;
    }
  }
}
