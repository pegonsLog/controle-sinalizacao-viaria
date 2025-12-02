import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SinalizacaoService } from '../../../services/sinalizacao.service';
import { Sinalizacao } from '../../../models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-sinalizacao-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <app-icon name="map-pin" [size]="24"></app-icon>
          </div>
          <div>
            <h1>Sinalizações</h1>
            <p class="header-subtitle">Tipos de sinalização disponíveis</p>
          </div>
        </div>
        <a routerLink="/sinalizacoes/novo" class="btn btn-primary">
          <app-icon name="plus" [size]="20"></app-icon>
          Nova Sinalização
        </a>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="search-box">
            <app-icon name="magnifying-glass" [size]="18"></app-icon>
            <input type="text" placeholder="Buscar sinalizações..." [(ngModel)]="termoBusca" />
          </div>
          <div class="results-count">{{ sinalizacoesFiltradas.length }} registro(s)</div>
        </div>
        
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome da Sinalização</th>
                <th class="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (item of sinalizacoesFiltradas; track item.id) {
                <tr>
                  <td>
                    <div class="cell-sinalizacao">
                      <div class="sinalizacao-icon">
                        <app-icon name="map-pin" [size]="18"></app-icon>
                      </div>
                      <span class="sinalizacao-nome">{{ item.nomeSinalizacao }}</span>
                    </div>
                  </td>
                  <td class="actions">
                    <a [routerLink]="['/sinalizacoes/editar', item.id]" class="btn-action btn-edit" title="Editar">
                      <app-icon name="pencil" [size]="16"></app-icon>
                    </a>
                    <button (click)="excluir(item)" class="btn-action btn-delete" title="Excluir">
                      <app-icon name="trash" [size]="16"></app-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="2" class="empty-state">
                    <div class="empty-icon"><app-icon name="map-pin" [size]="48"></app-icon></div>
                    <p class="empty-title">Nenhuma sinalização encontrada</p>
                    <p class="empty-text">Comece cadastrando um novo tipo de sinalização</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header-content { display: flex; align-items: center; gap: 1rem; }
    .header-icon { width: 52px; height: 52px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25); }
    h1 { color: #1f2937; margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; }
    .header-subtitle { color: #6b7280; margin: 0.25rem 0 0; font-size: 0.875rem; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; font-size: 0.875rem; transition: all 0.2s ease; }
    .btn-primary { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(30, 58, 95, 0.3); }
    .card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); overflow: hidden; }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f3f4f6; background: #fafafa; }
    .search-box { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; background: white; border: 1px solid #e5e7eb; border-radius: 10px; width: 320px; transition: all 0.2s ease; }
    .search-box:focus-within { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1); }
    .search-box app-icon { color: #9ca3af; }
    .search-box input { border: none; outline: none; flex: 1; font-size: 0.875rem; color: #374151; }
    .search-box input::placeholder { color: #9ca3af; }
    .results-count { font-size: 0.875rem; color: #6b7280; font-weight: 500; }
    .table-wrapper { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 1rem 1.25rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .th-actions { text-align: center; width: 100px; }
    td { padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; color: #374151; }
    tbody tr { transition: background 0.15s ease; }
    tbody tr:hover { background: #f9fafb; }
    .cell-sinalizacao { display: flex; align-items: center; gap: 0.875rem; }
    .sinalizacao-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #b45309; }
    .sinalizacao-nome { font-weight: 600; color: #1f2937; }
    .actions { display: flex; justify-content: center; gap: 0.5rem; }
    .btn-action { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; border: none; cursor: pointer; text-decoration: none; transition: all 0.2s ease; }
    .btn-edit { background: #eff6ff; color: #3b82f6; }
    .btn-edit:hover { background: #dbeafe; color: #2563eb; }
    .btn-delete { background: #fef2f2; color: #ef4444; }
    .btn-delete:hover { background: #fee2e2; color: #dc2626; }
    .empty-state { text-align: center; padding: 4rem 2rem !important; }
    .empty-icon { width: 80px; height: 80px; background: #f3f4f6; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #9ca3af; }
    .empty-title { font-size: 1.125rem; font-weight: 600; color: #374151; margin: 0 0 0.5rem; }
    .empty-text { font-size: 0.875rem; color: #9ca3af; margin: 0; }
  `]
})
export class SinalizacaoListaComponent implements OnInit {
  private sinalizacaoService = inject(SinalizacaoService);
  sinalizacoes: Sinalizacao[] = [];
  termoBusca = '';

  get sinalizacoesFiltradas(): Sinalizacao[] {
    if (!this.termoBusca.trim()) return this.sinalizacoes;
    const termo = this.termoBusca.toLowerCase();
    return this.sinalizacoes.filter(s => s.nomeSinalizacao.toLowerCase().includes(termo));
  }

  ngOnInit(): void {
    this.sinalizacaoService.listar().subscribe(data => this.sinalizacoes = data);
  }

  async excluir(item: Sinalizacao): Promise<void> {
    if (confirm('Deseja realmente excluir esta sinalização?')) {
      await this.sinalizacaoService.excluir(item.id!);
    }
  }
}
