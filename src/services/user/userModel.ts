export interface User {
  cdPessoa: number;
  dsNome: string;
  dsEmail: string;
  dsSenha: string;
  nrCpf: string;
  urlFoto?: string;
  anexo?: any;
  solicitacoes?: any[];
}
