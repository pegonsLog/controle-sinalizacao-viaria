import { SinalizacaoSolicitada } from './sinalizacao-solicitada.model';

export type StatusDevolucao = 'nao_devolvido' | 'parcialmente_devolvido' | 'devolvido';

export interface Solicitacao {
  id?: string;
  matSolicitante: string;
  matCoordSuperv: string;
  gerencia: string;
  dataSolicitacao: Date;
  horaSolicitacao: string;
  placa: string;
  evento: string;
  localDeUtilizacao: string;
  sinalizacoesSolicitadas: SinalizacaoSolicitada[];  // lista de sinalizações
  statusDevolucao: StatusDevolucao;
  dataPrevistaDevolucao: Date | null;
  devolvidoPara: string;
  dataDevolucao: Date | null;
  horaDevolucao: string | null;
}
