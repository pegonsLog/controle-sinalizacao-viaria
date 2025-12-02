import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Solicitacao, Funcionario } from '../../../models';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-solicitacao-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DateFormatPipe, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <app-icon name="clipboard-document-list" [size]="24"></app-icon>
          </div>
          <div>
            <h1>Solicitações</h1>
            <p class="header-subtitle">Lista de retirada de sinalização</p>
          </div>
        </div>
        <a routerLink="/solicitacoes/novo" class="btn btn-primary">
          <app-icon name="plus" [size]="20"></app-icon>
          Nova Solicitação
        </a>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="header-filters">
            <div class="search-box">
              <app-icon name="magnifying-glass" [size]="18"></app-icon>
              <input type="text" placeholder="Buscar solicitações..." [(ngModel)]="termoBusca" />
            </div>
            <label class="filter-checkbox">
              <input type="checkbox" [(ngModel)]="filtrarPendentes" />
              <span class="filter-label">
                <app-icon name="exclamation-triangle" [size]="16"></app-icon>
                Com pendências
              </span>
            </label>
            <label class="filter-checkbox filter-warning">
              <input type="checkbox" [(ngModel)]="filtrarEmCampo" />
              <span class="filter-label">
                <app-icon name="map-pin" [size]="16"></app-icon>
                Em campo
              </span>
            </label>
          </div>
          <div class="results-count">
            {{ solicitacoesFiltradas.length }} registro(s)
          </div>
        </div>
        
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Solicitante</th>
                <th>Placa</th>
                <th>Evento</th>
                <th>Sinalizações</th>
                <th>Status</th>
                <th class="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (item of solicitacoesFiltradas; track item.id) {
                <tr>
                  <td>
                    <span class="cell-value">{{ item.dataSolicitacao | dateFormat }}</span>
                  </td>
                  <td>
                    <span class="cell-value">{{ item.horaSolicitacao }}</span>
                  </td>
                  <td>
                    <span class="cell-funcionario">{{ item.matSolicitante }} - {{ getNomeFuncionario(item.matSolicitante) }}</span>
                  </td>
                  <td>
                    <span class="cell-value">{{ item.placa }}</span>
                  </td>
                  <td>{{ item.evento }}</td>
                  <td>
                    <div class="sinalizacoes-cell">
                      <span class="cell-sinalizacoes">{{ formatarSinalizacoes(item) }}</span>
                      @if (temPendentes(item)) {
                        <span class="badge-pendente" [title]="contarPendentes(item) + ' item(ns) pendente(s)'">
                          {{ contarPendentes(item) }}
                        </span>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" [class.status-success]="item.devolucao" [class.status-warning]="!item.devolucao">
                      <span class="status-dot"></span>
                      {{ item.devolucao ? 'Devolvido' : 'Em campo' }}
                    </span>
                  </td>
                  <td class="actions">
                    <button (click)="verDetalhes(item)" class="btn-action btn-view" title="Ver detalhes">
                      <app-icon name="eye" [size]="16"></app-icon>
                    </button>
                    <a [routerLink]="['/solicitacoes/editar', item.id]" class="btn-action btn-edit" title="Editar">
                      <app-icon name="pencil" [size]="16"></app-icon>
                    </a>
                    <button (click)="excluir(item)" class="btn-action btn-delete" title="Excluir">
                      <app-icon name="trash" [size]="16"></app-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="empty-state">
                    <div class="empty-icon">
                      <app-icon name="clipboard-document-list" [size]="48"></app-icon>
                    </div>
                    <p class="empty-title">Nenhuma solicitação encontrada</p>
                    <p class="empty-text">Comece criando uma nova solicitação</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Detalhes -->
      @if (solicitacaoSelecionada) {
        <div class="modal-overlay" (click)="fecharDetalhes()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Detalhes da Solicitação</h2>
              <button class="btn-close" (click)="fecharDetalhes()">
                <app-icon name="x-mark" [size]="20"></app-icon>
              </button>
            </div>
            <div class="modal-body">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Data</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.dataSolicitacao | dateFormat }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Hora</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.horaSolicitacao }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Solicitante</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.matSolicitante }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Coord/Superv</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.matCoordSuperv }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Gerência</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.gerencia }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Placa</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.placa }}</span>
                </div>
                <div class="detail-item full-width">
                  <span class="detail-label">Evento</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.evento }}</span>
                </div>
                <div class="detail-item full-width">
                  <span class="detail-label">Local de Utilização</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.localDeUtilizacao }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h3>Sinalizações Solicitadas</h3>
                <table class="detail-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (sin of solicitacaoSelecionada.sinalizacoesSolicitadas; track $index) {
                      <tr>
                        <td>{{ sin.tipo }}</td>
                        <td>{{ sin.quantidade }}</td>
                        <td>
                          <span class="status-mini" [class.devolvida]="sin.devolvida">
                            {{ sin.devolvida ? 'Devolvida' : 'Pendente' }}
                          </span>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="3" class="empty-text">Nenhuma sinalização</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Status Geral</span>
                  <span class="detail-value">
                    <span class="status-badge" [class.status-success]="solicitacaoSelecionada.devolucao" [class.status-warning]="!solicitacaoSelecionada.devolucao">
                      {{ solicitacaoSelecionada.devolucao ? 'Devolvido' : 'Em campo' }}
                    </span>
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Em Campo</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.emCampo }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Extraviada</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.extraviada }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Avariada</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.avariada }}</span>
                </div>
              </div>

              @if (solicitacaoSelecionada.justificativaExtravio) {
                <div class="detail-item full-width">
                  <span class="detail-label">Justificativa Extravio</span>
                  <span class="detail-value">{{ solicitacaoSelecionada.justificativaExtravio }}</span>
                </div>
              }
            </div>
            <div class="modal-footer">
              <a [routerLink]="['/solicitacoes/editar', solicitacaoSelecionada.id]" class="btn btn-primary">
                <app-icon name="pencil" [size]="16"></app-icon>
                Editar
              </a>
              <button class="btn btn-secondary" (click)="fecharDetalhes()">Fechar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #3b9fdf 0%, #2d7db5 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 159, 223, 0.25);
    }

    h1 {
      color: #1f2937;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .header-subtitle {
      color: #6b7280;
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(30, 58, 95, 0.3);
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      background: #fafafa;
    }

    .header-filters {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }

    .filter-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #ef4444;
      cursor: pointer;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }

    .filter-checkbox:has(input:checked) .filter-label {
      color: #ef4444;
    }

    .filter-warning input[type="checkbox"] {
      accent-color: #f59e0b;
    }

    .filter-warning:has(input:checked) .filter-label {
      color: #f59e0b;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      width: 320px;
      transition: all 0.2s ease;
    }

    .search-box:focus-within {
      border-color: #3b9fdf;
      box-shadow: 0 0 0 3px rgba(59, 159, 223, 0.1);
    }

    .search-box app-icon {
      color: #9ca3af;
    }

    .search-box input {
      border: none;
      outline: none;
      flex: 1;
      font-size: 0.875rem;
      color: #374151;
    }

    .search-box input::placeholder {
      color: #9ca3af;
    }

    .results-count {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .th-actions {
      text-align: center;
      width: 100px;
    }

    td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.875rem;
      color: #374151;
    }

    tbody tr {
      transition: background 0.15s ease;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    .cell-value {
      font-weight: 500;
      color: #374151;
    }

    .cell-badge {
      display: inline-flex;
      padding: 0.25rem 0.625rem;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #4b5563;
    }

    .cell-funcionario {
      font-size: 0.875rem;
      color: #374151;
    }

    .sinalizacoes-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cell-sinalizacoes {
      display: inline-block;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badge-pendente {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background: #ef4444;
      color: white;
      font-size: 0.6875rem;
      font-weight: 600;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-success {
      background: #ecfdf5;
      color: #047857;
    }

    .status-success .status-dot {
      background: #10b981;
    }

    .status-warning {
      background: #fffbeb;
      color: #b45309;
    }

    .status-warning .status-dot {
      background: #f59e0b;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-view {
      background: #f0fdf4;
      color: #16a34a;
    }

    .btn-view:hover {
      background: #dcfce7;
      color: #15803d;
    }

    .btn-edit {
      background: #eff6ff;
      color: #3b82f6;
    }

    .btn-edit:hover {
      background: #dbeafe;
      color: #2563eb;
    }

    .btn-delete {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem !important;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      background: #f3f4f6;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: #9ca3af;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem;
    }

    .empty-text {
      font-size: 0.875rem;
      color: #9ca3af;
      margin: 0;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item.full-width {
      grid-column: span 2;
    }

    .detail-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }

    .detail-value {
      font-size: 0.9375rem;
      color: #1f2937;
    }

    .detail-section {
      margin-bottom: 1.5rem;
    }

    .detail-section h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .detail-table th,
    .detail-table td {
      padding: 0.625rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid #f3f4f6;
    }

    .detail-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-mini {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #fef3c7;
      color: #92400e;
    }

    .status-mini.devolvida {
      background: #d1fae5;
      color: #065f46;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .modal-footer .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .modal-footer .btn-primary {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      color: white;
    }

    .modal-footer .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
    }

    .modal-footer .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .modal-footer .btn-secondary:hover {
      background: #d1d5db;
    }
  `]
})
export class SolicitacaoListaComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private funcionarioService = inject(FuncionarioService);

  solicitacoes: Solicitacao[] = [];
  funcionariosMap: Map<string, string> = new Map();
  termoBusca = '';
  filtrarPendentes = false;
  filtrarEmCampo = false;
  solicitacaoSelecionada: Solicitacao | null = null;

  get solicitacoesFiltradas(): Solicitacao[] {
    let resultado = this.solicitacoes;

    // Filtro de pendências
    if (this.filtrarPendentes) {
      resultado = resultado.filter(s => this.temPendentes(s));
    }

    // Filtro de em campo (não devolvido)
    if (this.filtrarEmCampo) {
      resultado = resultado.filter(s => !s.devolucao);
    }

    // Filtro de busca por texto
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(s =>
        s.matSolicitante.toLowerCase().includes(termo) ||
        s.placa.toLowerCase().includes(termo) ||
        s.evento.toLowerCase().includes(termo) ||
        s.localDeUtilizacao.toLowerCase().includes(termo)
      );
    }

    return resultado;
  }

  ngOnInit(): void {
    // Carregar funcionários primeiro para ter o mapa disponível
    this.funcionarioService.listar().subscribe(funcionarios => {
      funcionarios.forEach(f => {
        this.funcionariosMap.set(f.matriculaFuncionario, f.nomeFuncionario);
      });
    });

    this.solicitacaoService.listar().subscribe(data => {
      this.solicitacoes = data;
    });
  }

  getNomeFuncionario(matricula: string): string {
    return this.funcionariosMap.get(matricula) || matricula;
  }

  formatarSinalizacoes(item: Solicitacao): string {
    if (!item.sinalizacoesSolicitadas || item.sinalizacoesSolicitadas.length === 0) {
      return '-';
    }
    return item.sinalizacoesSolicitadas
      .map(s => `${s.tipo} (${s.quantidade})`)
      .join(', ');
  }

  temPendentes(item: Solicitacao): boolean {
    if (!item.sinalizacoesSolicitadas) return false;
    return item.sinalizacoesSolicitadas.some(s => !s.devolvida);
  }

  contarPendentes(item: Solicitacao): number {
    if (!item.sinalizacoesSolicitadas) return 0;
    return item.sinalizacoesSolicitadas.filter(s => !s.devolvida).length;
  }

  verDetalhes(item: Solicitacao): void {
    this.solicitacaoSelecionada = item;
  }

  fecharDetalhes(): void {
    this.solicitacaoSelecionada = null;
  }

  async excluir(item: Solicitacao): Promise<void> {
    if (confirm('Deseja realmente excluir esta solicitação?')) {
      await this.solicitacaoService.excluir(item.id!);
    }
  }
}
