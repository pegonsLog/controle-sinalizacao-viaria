import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Funcionario } from '../../../models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/funcionarios" class="back-link">
          <app-icon name="arrow-left" [size]="20"></app-icon>
          Voltar
        </a>
        <div class="header-content">
          <div class="header-icon">
            <app-icon name="users" [size]="24"></app-icon>
          </div>
          <div>
            <h1>{{ isEdicao ? 'Editar' : 'Novo' }} Funcionário</h1>
            <p class="header-subtitle">{{ isEdicao ? 'Atualize os dados do funcionário' : 'Preencha os dados para cadastrar' }}</p>
          </div>
        </div>
      </div>

      <form (ngSubmit)="salvar()" class="form-card">
        <div class="form-section">
          <div class="form-group">
            <label for="matriculaFuncionario">
              <app-icon name="identification" [size]="16"></app-icon>
              Matrícula
            </label>
            <input type="text" id="matriculaFuncionario" [(ngModel)]="funcionario.matriculaFuncionario" name="matriculaFuncionario" placeholder="Digite a matrícula" required />
          </div>

          <div class="form-group">
            <label for="nomeFuncionario">
              <app-icon name="user" [size]="16"></app-icon>
              Nome Completo
            </label>
            <input type="text" id="nomeFuncionario" [(ngModel)]="funcionario.nomeFuncionario" name="nomeFuncionario" placeholder="Digite o nome completo" required />
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/funcionarios" class="btn btn-secondary">
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
    .header-icon { width: 52px; height: 52px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
    h1 { color: #1f2937; margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; }
    .header-subtitle { color: #6b7280; margin: 0.25rem 0 0; font-size: 0.875rem; }
    .form-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
    .form-section { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151; }
    label app-icon { color: #6b7280; }
    input { width: 100%; padding: 0.875rem 1rem; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 0.9375rem; transition: all 0.2s ease; background: #f9fafb; }
    input:focus { outline: none; border-color: #10b981; background: white; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
    input::placeholder { color: #9ca3af; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f3f4f6; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; transition: all 0.2s ease; }
    .btn-primary { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .btn-secondary { background: #f3f4f6; color: #4b5563; }
    .btn-secondary:hover { background: #e5e7eb; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class FuncionarioFormComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  funcionario: Funcionario = { matriculaFuncionario: '', nomeFuncionario: '' };
  isEdicao = false;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.funcionarioService.buscarPorId(id).subscribe(data => {
        if (data) this.funcionario = data;
      });
    }
  }

  async salvar(): Promise<void> {
    this.loading = true;
    try {
      if (this.isEdicao) {
        await this.funcionarioService.atualizar(this.funcionario.id!, this.funcionario);
      } else {
        await this.funcionarioService.criar(this.funcionario);
      }
      this.router.navigate(['/funcionarios']);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar funcionário');
    } finally {
      this.loading = false;
    }
  }
}
