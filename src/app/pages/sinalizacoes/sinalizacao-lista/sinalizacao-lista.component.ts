import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SinalizacaoService } from '../../../services/sinalizacao.service';
import { Sinalizacao } from '../../../models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-sinalizacao-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sinalizações</h1>
        <a routerLink="novo" class="btn btn-primary">
          <app-icon name="plus" [size]="20"></app-icon>
          Nova Sinalização
        </a>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome da Sinalização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (item of sinalizacoes; track item.id) {
              <tr>
                <td>{{ item.nomeSinalizacao }}</td>
                <td class="actions">
                  <a [routerLink]="['editar', item.id]" class="btn-icon" title="Editar">
                    <app-icon name="pencil" [size]="18"></app-icon>
                  </a>
                  <button (click)="excluir(item)" class="btn-icon btn-danger" title="Excluir">
                    <app-icon name="trash" [size]="18"></app-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="2" class="empty">Nenhuma sinalização encontrada</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { color: #1e3a5f; margin: 0; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; border-radius: 6px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; }
    .btn-primary { background: #1e3a5f; color: white; }
    .btn-primary:hover { background: #2d5a87; }
    .table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #333; }
    tr:hover { background: #f8f9fa; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: none; background: #e9ecef; color: #495057; cursor: pointer; text-decoration: none; }
    .btn-icon:hover { background: #dee2e6; }
    .btn-icon.btn-danger:hover { background: #f8d7da; color: #721c24; }
    .empty { text-align: center; color: #6c757d; padding: 2rem !important; }
  `]
})
export class SinalizacaoListaComponent implements OnInit {
  private sinalizacaoService = inject(SinalizacaoService);
  sinalizacoes: Sinalizacao[] = [];

  ngOnInit(): void {
    this.sinalizacaoService.listar().subscribe(data => this.sinalizacoes = data);
  }

  async excluir(item: Sinalizacao): Promise<void> {
    if (confirm('Deseja realmente excluir esta sinalização?')) {
      await this.sinalizacaoService.excluir(item.id!);
    }
  }
}
