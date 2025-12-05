export interface AlunoApi {
  id?: number;
  nome: string;
  telefone: string;
  cpf: string;
  endereco: string;
  idPlano: number | null;
  idAcademia: number;
}
