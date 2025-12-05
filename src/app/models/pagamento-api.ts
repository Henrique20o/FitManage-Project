export interface PagamentoApi {
  id?: number;
  idAluno: number;
  idAcademia: number;
  dataPagamento: string;   
  mesReferencia: string;   
  anoReferencia: number;
  valor: number;           
}
