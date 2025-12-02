export interface SinalizacaoSolicitada {
  id?: string;
  sinalizacaoId: string;  // referência ao id da Sinalizacao
  tipo: string;           // nome/tipo da sinalização (para exibição)
  quantidade: number;
  devolvida: boolean;     // indica se foi devolvida individualmente
}
