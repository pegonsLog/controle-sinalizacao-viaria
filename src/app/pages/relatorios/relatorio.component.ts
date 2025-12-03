import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../models';
import { DateMaskDirective } from '../../shared/directives/date-mask.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface ResumoSinalizacao {
  tipo: string;
  retiradas: number;
  devolvidas: number;
  extraviadas: number;
  avariadas: number;
}

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, FormsModule, DateMaskDirective, IconComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <app-icon name="chart-bar" [size]="24"></app-icon>
          </div>
          <div>
            <h1>Relatório de Sinalizações</h1>
            <p class="header-subtitle">Quantitativos por período</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="abrirModal()">
            <app-icon name="calendar" [size]="20"></app-icon>
            Selecionar Período
          </button>
          @if (periodoSelecionado && resumoPorSinalizacao.length > 0) {
            <button class="btn btn-success" (click)="imprimir()">
              <app-icon name="printer" [size]="20"></app-icon>
              Imprimir
            </button>
          }
        </div>
      </div>

      @if (periodoSelecionado) {
        <div class="periodo-info">
          <app-icon name="calendar" [size]="18"></app-icon>
          <span>Período: {{ dataInicioStr }} a {{ dataFimStr }}</span>
        </div>
      }

      @if (loading) {
        <div class="loading">
          <p>Carregando dados...</p>
        </div>
      } @else if (periodoSelecionado) {
        <div class="cards-resumo">
          <div class="card-resumo card-retiradas">
            <div class="card-icon">
              <app-icon name="arrow-up-tray" [size]="32"></app-icon>
            </div>
            <div class="card-info">
              <span class="card-valor">{{ totalRetiradas }}</span>
              <span class="card-label">Retiradas</span>
            </div>
          </div>
          <div class="card-resumo card-devolvidas">
            <div class="card-icon">
              <app-icon name="arrow-down-tray" [size]="32"></app-icon>
            </div>
            <div class="card-info">
              <span class="card-valor">{{ totalDevolvidas }}</span>
              <span class="card-label">Devolvidas</span>
            </div>
          </div>
          <div class="card-resumo card-extraviadas">
            <div class="card-icon">
              <app-icon name="exclamation-circle" [size]="32"></app-icon>
            </div>
            <div class="card-info">
              <span class="card-valor">{{ totalExtraviadas }}</span>
              <span class="card-label">Extraviadas</span>
            </div>
          </div>
          <div class="card-resumo card-avariadas">
            <div class="card-icon">
              <app-icon name="wrench" [size]="32"></app-icon>
            </div>
            <div class="card-info">
              <span class="card-valor">{{ totalAvariadas }}</span>
              <span class="card-label">Avariadas</span>
            </div>
          </div>
        </div>

        @if (resumoPorSinalizacao.length > 0) {
          <div class="card">
            <div class="card-header">
              <h3>Detalhamento por Sinalização</h3>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Tipo de Sinalização</th>
                    <th class="th-number">Retiradas</th>
                    <th class="th-number">Devolvidas</th>
                    <th class="th-number">Extraviadas</th>
                    <th class="th-number">Avariadas</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of resumoPorSinalizacao; track item.tipo) {
                    <tr>
                      <td>{{ item.tipo }}</td>
                      <td class="td-number">{{ item.retiradas }}</td>
                      <td class="td-number">{{ item.devolvidas }}</td>
                      <td class="td-number td-extraviada">{{ item.extraviadas }}</td>
                      <td class="td-number td-avariada">{{ item.avariadas }}</td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td class="td-number"><strong>{{ totalRetiradas }}</strong></td>
                    <td class="td-number"><strong>{{ totalDevolvidas }}</strong></td>
                    <td class="td-number td-extraviada"><strong>{{ totalExtraviadas }}</strong></td>
                    <td class="td-number td-avariada"><strong>{{ totalAvariadas }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <app-icon name="chart-bar" [size]="48"></app-icon>
            <p>Nenhuma solicitação encontrada no período selecionado</p>
          </div>
        }
      } @else {
        <div class="empty-state">
          <app-icon name="calendar" [size]="48"></app-icon>
          <p>Selecione um período para visualizar o relatório</p>
        </div>
      }

      <!-- Área de impressão A4 -->
      <div id="print-area" class="print-area">
        <div class="print-header">
          <div class="print-logo">
            <h1>GARBO</h1>
            <span>Controle de Sinalização Viária</span>
          </div>
          <div class="print-title">
            <h2>Relatório de Sinalizações</h2>
            <p>Período: {{ dataInicioStr }} a {{ dataFimStr }}</p>
          </div>
        </div>

        <div class="print-summary">
          <div class="summary-item">
            <span class="summary-label">Retiradas</span>
            <span class="summary-value">{{ totalRetiradas }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Devolvidas</span>
            <span class="summary-value">{{ totalDevolvidas }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Extraviadas</span>
            <span class="summary-value summary-danger">{{ totalExtraviadas }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Avariadas</span>
            <span class="summary-value summary-warning">{{ totalAvariadas }}</span>
          </div>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th>Tipo de Sinalização</th>
              <th>Retiradas</th>
              <th>Devolvidas</th>
              <th>Extraviadas</th>
              <th>Avariadas</th>
            </tr>
          </thead>
          <tbody>
            @for (item of resumoPorSinalizacao; track item.tipo) {
              <tr>
                <td>{{ item.tipo }}</td>
                <td class="td-center">{{ item.retiradas }}</td>
                <td class="td-center">{{ item.devolvidas }}</td>
                <td class="td-center">{{ item.extraviadas }}</td>
                <td class="td-center">{{ item.avariadas }}</td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td><strong>TOTAL</strong></td>
              <td class="td-center"><strong>{{ totalRetiradas }}</strong></td>
              <td class="td-center"><strong>{{ totalDevolvidas }}</strong></td>
              <td class="td-center"><strong>{{ totalExtraviadas }}</strong></td>
              <td class="td-center"><strong>{{ totalAvariadas }}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="print-footer">
          <p>Relatório gerado em {{ dataGeracao }}</p>
        </div>
      </div>

      <!-- Modal de seleção de período -->
      @if (modalAberto) {
        <div class="modal-overlay" (click)="fecharModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Selecionar Período</h2>
              <button class="btn-close" (click)="fecharModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="dataInicio">Data Início</label>
                <input type="text" id="dataInicio" [(ngModel)]="dataInicioStr" appDateMask placeholder="dd/mm/aaaa" maxlength="10" />
              </div>
              <div class="form-group">
                <label for="dataFim">Data Fim</label>
                <input type="text" id="dataFim" [(ngModel)]="dataFimStr" appDateMask placeholder="dd/mm/aaaa" maxlength="10" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="fecharModal()">Cancelar</button>
              <button class="btn btn-primary" (click)="gerarRelatorio()" [disabled]="!dataInicioStr || !dataFimStr">
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1200px;
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
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b9fdf 0%, #1e3a5f 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    h1 {
      color: #1f2937;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
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

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(30, 58, 95, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .btn-success {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
    }

    .btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.3);
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .periodo-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #eff6ff;
      border-radius: 8px;
      color: #1e40af;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .cards-resumo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card-resumo {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 16px;
      background: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .card-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-retiradas .card-icon {
      background: #dbeafe;
      color: #2563eb;
    }

    .card-devolvidas .card-icon {
      background: #d1fae5;
      color: #059669;
    }

    .card-extraviadas .card-icon {
      background: #ede9fe;
      color: #7c3aed;
    }

    .card-avariadas .card-icon {
      background: #fee2e2;
      color: #dc2626;
    }

    .card-info {
      display: flex;
      flex-direction: column;
    }

    .card-valor {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .card-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      background: #fafafa;
    }

    .card-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1rem;
      font-weight: 600;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem 1.5rem;
      text-align: left;
      border-bottom: 1px solid #f3f4f6;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .th-number, .td-number {
      text-align: center;
      width: 120px;
    }

    td {
      color: #4b5563;
      font-size: 0.875rem;
    }

    .td-extraviada {
      color: #7c3aed;
    }

    .td-avariada {
      color: #dc2626;
    }

    tfoot td {
      background: #f9fafb;
      border-top: 2px solid #e5e7eb;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-state {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .empty-state p {
      margin-top: 1rem;
      font-size: 1rem;
    }

    /* Modal */
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
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.125rem;
      color: #1f2937;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .btn-close:hover {
      color: #1f2937;
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-group input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: #3b9fdf;
      box-shadow: 0 0 0 3px rgba(59, 159, 223, 0.1);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 16px 16px;
    }

    /* Área de impressão - oculta na tela */
    .print-area {
      display: none;
    }

    /* Estilos de impressão */
    @media print {
      /* Ocultar tudo exceto a área de impressão */
      :host {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }

      .page-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: none !important;
      }

      .page-container > *:not(.print-area) {
        display: none !important;
      }

      .print-area {
        display: block !important;
        width: 100%;
        max-width: 180mm;
        min-height: auto;
        padding: 0;
        margin: 0 auto;
        background: white;
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #000;
        font-size: 11pt;
      }

      .print-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #1e3a5f;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }

      .print-logo h1 {
        font-size: 24pt;
        color: #1e3a5f;
        margin: 0;
        font-weight: 700;
      }

      .print-logo span {
        font-size: 9pt;
        color: #666;
      }

      .print-title {
        text-align: right;
      }

      .print-title h2 {
        font-size: 14pt;
        color: #1e3a5f;
        margin: 0 0 5px 0;
      }

      .print-title p {
        font-size: 10pt;
        color: #666;
        margin: 0;
      }

      .print-summary {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
      }

      .summary-item {
        text-align: center;
        flex: 1;
      }

      .summary-label {
        display: block;
        font-size: 9pt;
        color: #666;
        margin-bottom: 5px;
      }

      .summary-value {
        display: block;
        font-size: 18pt;
        font-weight: 700;
        color: #1e3a5f;
      }

      .summary-danger {
        color: #7c3aed;
      }

      .summary-warning {
        color: #dc2626;
      }

      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .print-table th,
      .print-table td {
        border: 1px solid #ddd;
        padding: 10px 12px;
        text-align: left;
      }

      .print-table th {
        background: #1e3a5f;
        color: white;
        font-weight: 600;
        font-size: 10pt;
      }

      .print-table tbody tr:nth-child(even) {
        background: #f9f9f9;
      }

      .print-table .td-center {
        text-align: center;
      }

      .print-table tfoot td {
        background: #e5e7eb;
        font-weight: 600;
        border-top: 2px solid #1e3a5f;
      }

      .print-footer {
        margin-top: 30px;
        text-align: center;
        font-size: 8pt;
        color: #999;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
    }
  `]
})
export class RelatorioComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);

  solicitacoes: Solicitacao[] = [];
  resumoPorSinalizacao: ResumoSinalizacao[] = [];
  
  modalAberto = false;
  periodoSelecionado = false;
  loading = false;
  
  dataInicioStr = '';
  dataFimStr = '';
  
  totalRetiradas = 0;
  totalDevolvidas = 0;
  totalExtraviadas = 0;
  totalAvariadas = 0;
  dataGeracao = '';

  ngOnInit(): void {
    this.solicitacaoService.listar().subscribe(data => {
      this.solicitacoes = data;
    });
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  imprimir(): void {
    window.print();
  }

  gerarRelatorio(): void {
    this.dataGeracao = new Date().toLocaleString('pt-BR');
    const dataInicio = this.parseDate(this.dataInicioStr);
    const dataFim = this.parseDate(this.dataFimStr);

    if (!dataInicio || !dataFim) {
      alert('Datas inválidas. Use o formato dd/mm/aaaa');
      return;
    }

    this.loading = true;
    this.fecharModal();
    this.periodoSelecionado = true;

    // Filtrar solicitações pelo período
    const solicitacoesFiltradas = this.solicitacoes.filter(s => {
      const dataSolicitacao = this.toDate(s.dataSolicitacao);
      return dataSolicitacao >= dataInicio && dataSolicitacao <= dataFim;
    });

    // Calcular totais
    this.calcularResumo(solicitacoesFiltradas);
    this.loading = false;
  }

  private calcularResumo(solicitacoes: Solicitacao[]): void {
    const resumoMap = new Map<string, ResumoSinalizacao>();

    this.totalRetiradas = 0;
    this.totalDevolvidas = 0;
    this.totalExtraviadas = 0;
    this.totalAvariadas = 0;

    for (const solicitacao of solicitacoes) {
      if (!solicitacao.sinalizacoesSolicitadas) continue;

      for (const sin of solicitacao.sinalizacoesSolicitadas) {
        let resumo = resumoMap.get(sin.tipo);
        if (!resumo) {
          resumo = {
            tipo: sin.tipo,
            retiradas: 0,
            devolvidas: 0,
            extraviadas: 0,
            avariadas: 0
          };
          resumoMap.set(sin.tipo, resumo);
        }

        // Retiradas = quantidade solicitada
        resumo.retiradas += sin.quantidade;
        this.totalRetiradas += sin.quantidade;

        // Devolvidas = quantidade - emCampo - extraviada - avariada (se devolvida)
        if (sin.devolvida) {
          const devolvidas = sin.quantidade - (sin.emCampo || 0) - (sin.extraviada || 0) - (sin.avariada || 0);
          resumo.devolvidas += Math.max(0, devolvidas);
          this.totalDevolvidas += Math.max(0, devolvidas);
        }

        // Extraviadas e avariadas
        resumo.extraviadas += sin.extraviada || 0;
        resumo.avariadas += sin.avariada || 0;
        this.totalExtraviadas += sin.extraviada || 0;
        this.totalAvariadas += sin.avariada || 0;
      }
    }

    this.resumoPorSinalizacao = Array.from(resumoMap.values()).sort((a, b) => 
      a.tipo.localeCompare(b.tipo)
    );
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 10) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  private toDate(date: Date | any): Date {
    if (!date) return new Date(0);
    return date.toDate ? date.toDate() : new Date(date);
  }
}
