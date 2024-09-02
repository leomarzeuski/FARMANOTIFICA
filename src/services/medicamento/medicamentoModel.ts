export interface Medicamento {
  cdMedicamento: number;
  dsMedicamento: string;
  dsDosagem: string;
  dsFabricante: string;
  dsGrupoFinanciamento: string | null;
  dsCodigoRegistroAnvisa: string;
  dsObservacao: string;
  urlBula: string;
  dsCid: string;
  dtCadastro: string;
  snAtivo: string;
  fnMedicamentoCids: any[];
}
