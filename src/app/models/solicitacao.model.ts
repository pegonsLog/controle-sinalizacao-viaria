import { SinalizacaoSolicitada } from './sinalizacao-solicitada.model';

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
  devolucao: boolean;
  emCampo: number;
  extraviada: number;
  avariada: number;
  justificativaExtravio: string;
  dataPrevistaDevolucao: Date;
  devolvidoPara: string;
  dataDevolucao: Date | null;
  horaDevolucao: string | null;
}
