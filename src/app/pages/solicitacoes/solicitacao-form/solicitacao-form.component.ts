import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { SinalizacaoService } from '../../../services/sinalizacao.service';
import { Solicitacao, Funcionario, Sinalizacao, SinalizacaoSolicitada } from '../../../models';
import { DateMaskDirective } from '../../../shared/directives/date-mask.directive';
import { PlacaMaskDirective } from '../../../shared/directives/placa-mask.directive';

@Component({
  selector: 'app-solicitacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DateMaskDirective, PlacaMaskDirective],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isEdicao ? 'Editar' : 'Nova' }} Solicitação</h1>
      </div>

      <form (ngSubmit)="salvar()" class="form-card">
        <div class="form-row">
          <div class="form-group">
            <label for="matSolicitante">Matrícula Solicitante *</label>
            <select id="matSolicitante" [(ngModel)]="solicitacao.matSolicitante" name="matSolicitante" required>
              <option value="">Selecione...</option>
              @for (func of funcionarios; track func.id) {
                <option [value]="func.matriculaFuncionario">{{ func.matriculaFuncionario }} - {{ func.nomeFuncionario }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label for="matCoordSuperv">Matrícula Coord/Superv *</label>
            <select id="matCoordSuperv" [(ngModel)]="solicitacao.matCoordSuperv" name="matCoordSuperv" required>
              <option value="">Selecione...</option>
              @for (func of funcionarios; track func.id) {
                <option [value]="func.matriculaFuncionario">{{ func.matriculaFuncionario }} - {{ func.nomeFuncionario }}</option>
              }
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="gerencia">Gerência *</label>
            <input type="text" id="gerencia" [(ngModel)]="solicitacao.gerencia" name="gerencia" required />
          </div>
          <div class="form-group">
            <label for="dataSolicitacao">Data Solicitação *</label>
            <input type="text" id="dataSolicitacao" [(ngModel)]="dataSolicitacaoStr" name="dataSolicitacao" appDateMask placeholder="dd/mm/aaaa" maxlength="10" required />
          </div>
          <div class="form-group">
            <label for="horaSolicitacao">Hora Solicitação *</label>
            <input type="time" id="horaSolicitacao" [(ngModel)]="solicitacao.horaSolicitacao" name="horaSolicitacao" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="placa">Placa *</label>
            <input type="text" id="placa" [(ngModel)]="solicitacao.placa" name="placa" appPlacaMask placeholder="AAA-AAAA" maxlength="8" required />
          </div>
          <div class="form-group">
            <label for="evento">Evento *</label>
            <input type="text" id="evento" [(ngModel)]="solicitacao.evento" name="evento" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="localDeUtilizacao">Local de Utilização *</label>
            <input type="text" id="localDeUtilizacao" [(ngModel)]="solicitacao.localDeUtilizacao" name="localDeUtilizacao" required />
          </div>
        </div>

        <!-- Lista de Sinalizações Solicitadas -->
        <div class="sinalizacoes-section">
          <h3>Sinalizações Solicitadas *</h3>
          
          <div class="sinalizacao-add-row">
            <div class="form-group">
              <label for="novaSinalizacao">Sinalização</label>
              <select id="novaSinalizacao" [(ngModel)]="novaSinalizacao.sinalizacaoId" name="novaSinalizacao" (change)="onSinalizacaoChange()">
                <option value="">Selecione...</option>
                @for (sin of sinalizacoes; track sin.id) {
                  <option [value]="sin.id">{{ sin.nomeSinalizacao }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="novaQuantidade">Quantidade</label>
              <input type="number" id="novaQuantidade" [(ngModel)]="novaSinalizacao.quantidade" name="novaQuantidade" min="1" />
            </div>
            @if (editandoIndex === -1) {
              <button type="button" class="btn btn-add" (click)="adicionarSinalizacao()" [disabled]="!novaSinalizacao.sinalizacaoId || novaSinalizacao.quantidade < 1">
                + Adicionar
              </button>
            } @else {
              <button type="button" class="btn btn-save" (click)="salvarEdicaoSinalizacao()" [disabled]="!novaSinalizacao.sinalizacaoId || novaSinalizacao.quantidade < 1">
                ✓ Salvar
              </button>
              <button type="button" class="btn btn-cancel" (click)="cancelarEdicaoSinalizacao()">
                ✕ Cancelar
              </button>
            }
          </div>

          @if (solicitacao.sinalizacoesSolicitadas.length > 0) {
            <table class="sinalizacoes-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  @if (isEdicao) {
                    <th>Devolvida</th>
                  }
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (item of solicitacao.sinalizacoesSolicitadas; track $index) {
                  <tr [class.row-devolvida]="item.devolvida">
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.quantidade }}</td>
                    @if (isEdicao) {
                      <td class="td-checkbox">
                        <label class="checkbox-container">
                          <input type="checkbox" [(ngModel)]="item.devolvida" [name]="'devolvida_' + $index" />
                          <span class="checkmark"></span>
                          <span class="checkbox-label">{{ item.devolvida ? 'Sim' : 'Não' }}</span>
                        </label>
                      </td>
                    }
                    <td class="td-actions">
                      <button type="button" class="btn-icon btn-edit" (click)="editarSinalizacao($index)" title="Editar">
                        ✎
                      </button>
                      <button type="button" class="btn-icon btn-delete" (click)="removerSinalizacao($index)" title="Remover">
                        ✕
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <p class="empty-list">Nenhuma sinalização adicionada</p>
          }
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dataPrevistaDevolucao">Data Prevista Devolução *</label>
            <input type="text" id="dataPrevistaDevolucao" [(ngModel)]="dataPrevistaDevolucaoStr" name="dataPrevistaDevolucao" appDateMask placeholder="dd/mm/aaaa" maxlength="10" required />
          </div>
        </div>

        <hr />

        <h3>Devolução</h3>

        <div class="form-row">
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" [(ngModel)]="solicitacao.devolucao" name="devolucao" />
              Devolvido
            </label>
          </div>
        </div>

        @if (solicitacao.devolucao) {
          <div class="form-row">
            <div class="form-group">
              <label for="emCampo">Em Campo</label>
              <input type="number" id="emCampo" [(ngModel)]="solicitacao.emCampo" name="emCampo" min="0" />
            </div>
            <div class="form-group">
              <label for="extraviada">Extraviada</label>
              <input type="number" id="extraviada" [(ngModel)]="solicitacao.extraviada" name="extraviada" min="0" />
            </div>
            <div class="form-group">
              <label for="avariada">Avariada</label>
              <input type="number" id="avariada" [(ngModel)]="solicitacao.avariada" name="avariada" min="0" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="justificativaExtravio">Justificativa Extravio</label>
              <textarea id="justificativaExtravio" [(ngModel)]="solicitacao.justificativaExtravio" name="justificativaExtravio" rows="3"></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="devolvidoPara">Devolvido Para</label>
              <select id="devolvidoPara" [(ngModel)]="solicitacao.devolvidoPara" name="devolvidoPara">
                <option value="">Selecione...</option>
                @for (func of funcionarios; track func.id) {
                  <option [value]="func.matriculaFuncionario">{{ func.matriculaFuncionario }} - {{ func.nomeFuncionario }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label for="dataDevolucao">Data Devolução</label>
              <input type="text" id="dataDevolucao" [(ngModel)]="dataDevolucaoStr" name="dataDevolucao" appDateMask placeholder="dd/mm/aaaa" maxlength="10" />
            </div>
            <div class="form-group">
              <label for="horaDevolucao">Hora Devolução</label>
              <input type="time" id="horaDevolucao" [(ngModel)]="solicitacao.horaDevolucao" name="horaDevolucao" />
            </div>
          </div>
        }

        <div class="form-actions">
          <a routerLink="/solicitacoes" class="btn btn-secondary">Cancelar</a>
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    h1 {
      color: #1e3a5f;
      margin: 0;
    }

    h3 {
      color: #1e3a5f;
      margin: 1rem 0;
    }

    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 1.5rem 0;
    }

    .form-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }

    label {
      margin-bottom: 0.375rem;
      font-weight: 500;
      color: #333;
      font-size: 0.875rem;
    }

    input, select, textarea {
      padding: 0.625rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #2d5a87;
    }

    textarea {
      resize: vertical;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 6px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #1e3a5f;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2d5a87;
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e9ecef;
      color: #495057;
    }

    .btn-secondary:hover {
      background: #dee2e6;
    }

    /* Estilos para lista de sinalizações */
    .sinalizacoes-section {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .sinalizacoes-section h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .sinalizacao-add-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1rem;
    }

    .sinalizacao-add-row .form-group {
      flex: 1;
    }

    .btn-add {
      background: #28a745;
      color: white;
      padding: 0.625rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      height: fit-content;
    }

    .btn-add:hover:not(:disabled) {
      background: #218838;
    }

    .btn-add:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sinalizacoes-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 6px;
      overflow: hidden;
    }

    .sinalizacoes-table th,
    .sinalizacoes-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .sinalizacoes-table th {
      background: #1e3a5f;
      color: white;
      font-weight: 500;
    }

    .sinalizacoes-table td:last-child {
      width: 60px;
      text-align: center;
    }

    .row-devolvida {
      background: #ecfdf5;
    }

    .row-devolvida td {
      color: #047857;
    }

    .td-checkbox {
      text-align: center;
    }

    .checkbox-container {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-container input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #10b981;
      cursor: pointer;
    }

    .checkbox-label {
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .btn-edit {
      color: #3b82f6;
    }

    .btn-edit:hover {
      background: #eff6ff;
    }

    .btn-delete {
      color: #dc3545;
    }

    .btn-delete:hover {
      background: #fee;
    }

    .td-actions {
      display: flex;
      gap: 0.25rem;
      justify-content: center;
    }

    .btn-save {
      background: #10b981;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-save:hover {
      background: #059669;
    }

    .btn-save:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #6b7280;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-cancel:hover {
      background: #4b5563;
    }

    .empty-list {
      text-align: center;
      color: #6c757d;
      padding: 1rem;
      margin: 0;
    }
  `]
})
export class SolicitacaoFormComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private funcionarioService = inject(FuncionarioService);
  private sinalizacaoService = inject(SinalizacaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  solicitacao: Solicitacao = {
    matSolicitante: '',
    matCoordSuperv: '',
    gerencia: 'GARBO',
    dataSolicitacao: new Date(),
    horaSolicitacao: '',
    placa: '',
    evento: '',
    localDeUtilizacao: '',
    sinalizacoesSolicitadas: [],
    devolucao: false,
    emCampo: 0,
    extraviada: 0,
    avariada: 0,
    justificativaExtravio: '',
    dataPrevistaDevolucao: new Date(),
    devolvidoPara: '',
    dataDevolucao: null,
    horaDevolucao: null
  };

  funcionarios: Funcionario[] = [];
  sinalizacoes: Sinalizacao[] = [];
  isEdicao = false;
  loading = false;

  dataSolicitacaoStr = '';
  dataPrevistaDevolucaoStr = '';
  dataDevolucaoStr = '';

  // Para adicionar nova sinalização à lista
  novaSinalizacao: SinalizacaoSolicitada = {
    sinalizacaoId: '',
    tipo: '',
    quantidade: 1,
    devolvida: false
  };

  ngOnInit(): void {
    this.funcionarioService.listar().subscribe(data => this.funcionarios = data);
    this.sinalizacaoService.listar().subscribe(data => this.sinalizacoes = data);

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.solicitacaoService.buscarPorId(id).subscribe(data => {
        if (data) {
          this.solicitacao = {
            ...data,
            sinalizacoesSolicitadas: data.sinalizacoesSolicitadas || []
          };
          this.dataSolicitacaoStr = this.toDateInputValue(data.dataSolicitacao);
          this.dataPrevistaDevolucaoStr = this.toDateInputValue(data.dataPrevistaDevolucao);
          if (data.dataDevolucao) {
            this.dataDevolucaoStr = this.toDateInputValue(data.dataDevolucao);
          }
        }
      });
    } else {
      // Campos de data vazios para preenchimento manual
      this.dataSolicitacaoStr = '';
      this.dataPrevistaDevolucaoStr = '';
      this.solicitacao.horaSolicitacao = '';
    }
  }

  private toDateInputValue(date: Date | any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 10) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Métodos para gerenciar lista de sinalizações
  onSinalizacaoChange(): void {
    const sinalizacao = this.sinalizacoes.find(s => s.id === this.novaSinalizacao.sinalizacaoId);
    if (sinalizacao) {
      this.novaSinalizacao.tipo = sinalizacao.nomeSinalizacao;
    }
  }

  adicionarSinalizacao(): void {
    if (!this.novaSinalizacao.sinalizacaoId || this.novaSinalizacao.quantidade < 1) return;

    this.solicitacao.sinalizacoesSolicitadas.push({
      sinalizacaoId: this.novaSinalizacao.sinalizacaoId,
      tipo: this.novaSinalizacao.tipo,
      quantidade: this.novaSinalizacao.quantidade,
      devolvida: false
    });

    // Limpar campos
    this.novaSinalizacao = {
      sinalizacaoId: '',
      tipo: '',
      quantidade: 1,
      devolvida: false
    };
  }

  removerSinalizacao(index: number): void {
    this.solicitacao.sinalizacoesSolicitadas.splice(index, 1);
    // Se estava editando este item, cancelar edição
    if (this.editandoIndex === index) {
      this.cancelarEdicaoSinalizacao();
    }
  }

  // Índice do item sendo editado (-1 = nenhum)
  editandoIndex = -1;

  editarSinalizacao(index: number): void {
    const item = this.solicitacao.sinalizacoesSolicitadas[index];
    this.novaSinalizacao = { ...item };
    this.editandoIndex = index;
  }

  salvarEdicaoSinalizacao(): void {
    if (this.editandoIndex >= 0 && this.novaSinalizacao.sinalizacaoId && this.novaSinalizacao.quantidade >= 1) {
      this.solicitacao.sinalizacoesSolicitadas[this.editandoIndex] = { ...this.novaSinalizacao };
      this.cancelarEdicaoSinalizacao();
    }
  }

  cancelarEdicaoSinalizacao(): void {
    this.editandoIndex = -1;
    this.novaSinalizacao = {
      sinalizacaoId: '',
      tipo: '',
      quantidade: 1,
      devolvida: false
    };
  }

  async salvar(): Promise<void> {
    this.loading = true;

    try {
      const dataSolicitacao = this.parseDate(this.dataSolicitacaoStr);
      const dataPrevistaDevolucao = this.parseDate(this.dataPrevistaDevolucaoStr);
      
      if (!dataSolicitacao || !dataPrevistaDevolucao) {
        alert('Data inválida. Use o formato dd/mm/aaaa');
        this.loading = false;
        return;
      }

      if (this.solicitacao.sinalizacoesSolicitadas.length === 0) {
        alert('Adicione pelo menos uma sinalização solicitada');
        this.loading = false;
        return;
      }
      
      this.solicitacao.dataSolicitacao = dataSolicitacao;
      this.solicitacao.dataPrevistaDevolucao = dataPrevistaDevolucao;
      
      if (this.dataDevolucaoStr) {
        this.solicitacao.dataDevolucao = this.parseDate(this.dataDevolucaoStr);
      }

      if (this.isEdicao) {
        await this.solicitacaoService.atualizar(this.solicitacao.id!, this.solicitacao);
      } else {
        await this.solicitacaoService.criar(this.solicitacao);
      }

      this.router.navigate(['/solicitacoes']);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar solicitação');
    } finally {
      this.loading = false;
    }
  }
}
