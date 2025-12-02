import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SinalizacaoService } from '../../../services/sinalizacao.service';
import { Sinalizacao } from '../../../models';

@Component({
  selector: 'app-sinalizacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isEdicao ? 'Editar' : 'Nova' }} Sinalização</h1>
      </div>

      <form (ngSubmit)="salvar()" class="form-card">
        <div class="form-group">
          <label for="nomeSinalizacao">Nome da Sinalização *</label>
          <input type="text" id="nomeSinalizacao" [(ngModel)]="sinalizacao.nomeSinalizacao" name="nomeSinalizacao" required />
        </div>

        <div class="form-actions">
          <a routerLink="/sinalizacoes" class="btn btn-secondary">Cancelar</a>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; max-width: 600px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { color: #1e3a5f; margin: 0; }
    .form-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.375rem; font-weight: 500; color: #333; font-size: 0.875rem; }
    input { width: 100%; padding: 0.625rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.875rem; }
    input:focus { outline: none; border-color: #2d5a87; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; }
    .btn { padding: 0.625rem 1.25rem; border-radius: 6px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; }
    .btn-primary { background: #1e3a5f; color: white; }
    .btn-primary:hover:not(:disabled) { background: #2d5a87; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .btn-secondary:hover { background: #dee2e6; }
  `]
})
export class SinalizacaoFormComponent implements OnInit {
  private sinalizacaoService = inject(SinalizacaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sinalizacao: Sinalizacao = { nomeSinalizacao: '' };
  isEdicao = false;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.sinalizacaoService.buscarPorId(id).subscribe(data => {
        if (data) this.sinalizacao = data;
      });
    }
  }

  async salvar(): Promise<void> {
    this.loading = true;
    try {
      if (this.isEdicao) {
        await this.sinalizacaoService.atualizar(this.sinalizacao.id!, this.sinalizacao);
      } else {
        await this.sinalizacaoService.criar(this.sinalizacao);
      }
      this.router.navigate(['/sinalizacoes']);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar sinalização');
    } finally {
      this.loading = false;
    }
  }
}
