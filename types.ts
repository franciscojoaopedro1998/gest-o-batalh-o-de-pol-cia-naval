export enum Patente {
  ALMIRANTE_ARMADA = "Almirante da Armada",
  ALMIRANTE = "Almirante",
  VICE_ALMIRANTE = "Vice-Almirante",
  CONTRA_ALMIRANTE = "Contra-Almirante",
  CAPITAO_MAR_GUERRA = "Capitão-de-Mar-e-Guerra",
  CAPITAO_FRAGATA = "Capitão-de-Fragata",
  CAPITAO_CORVETA = "Capitão-de-Corveta",
  TENENTE_NAVIO = "Tenente-de-Navio",
  TENENTE_FRAGATA = "Tenente-de-Fragata",
  TENENTE_CORVETA = "Tenente-de-Corveta",
  GUARDA_MARINHA = "Guarda-Marinha",
  SARGENTO_MAIOR = "Sargento-Maior",
  SARGENTO_CHEFE = "Sargento-Chefe",
  SARGENTO_AJUDANTE = "Sargento-Ajudante",
  PRIMEIRO_SARGENTO = "1°Sargento",
  SEGUNDO_SARGENTO = "2°Sargento",
  SUB_SARGENTO = "Sub-Sargento",
  PRIMEIRO_CABO = "1°Cabo",
  MARINHEIRO = "Marinheiro",
  GRUMETE = "Grumete",
}

export enum Situacao {
  MISSAO = "Missão",
  FERIAS = "Férias",
  BAIXA_MEDICA = "Baixa Médica",
  DESTACADO = "Destacado",
  ORDENANCA = "Ordenança",
  FORMACAO = "Formação",
  DESERTOR = "Desertor",
  DISPENSADO = "Dispensado",
  AUSENTE = "Ausente",
}

export enum Unidade {
  COMANDO_BATALHAO = "Comando do Batalhão",
  PRIMEIRA_COMPANNHA = "1ª Companhia",
  SEGUNDA_COMPANNHA = "2ª Companhia",
  TERCEIRA_COMPANNHA = "3ª Companhia",
  AGREGADOS = "Agregados",
}

export enum EstadoCivil {
  SOLTEIRO = "Solteiro(a)",
  CASADO = "Casado(a)",
  DIVORCIADO = "Divorciado(a)",
  VIUVO = "Viúvo(a)",
}

export interface Missao {
  id: string;
  nome: string;
  descricao: string;
  local: string;
  dataInicio: string;
  dataFimPrevisa: string;
  status: "Planejada" | "Em Curso" | "Concluída";
}

export interface HistoricoEvento {
  id: string;
  tipo: "PROMOÇÃO" | "MISSÃO" | "FÉRIAS" | "PUNIÇÃO" | "LOUVOR";
  data: string;
  descricao: string;
  detalhes?: string;
}

export enum TipoPrestacaoServico {
  SMO = "SMO – Serviço Militar Obrigatório",
  SMC = "SMC – Serviço Militar por Contrato",
  QP = "QP – Quadro Permanente",
}

export interface Militar {
  id: string;
  nip: string;
  patente: Patente;
  formaPrestacaoServico: string; // Keep this for now to avoid breaking changes, or replace it if safe
  tipoPrestacaoServico: TipoPrestacaoServico;
  nome: string;
  bi: string;
  dataNascimento: string;
  sexo: "M" | "F";
  grupoSanguineo: string;
  altura: string;
  weight?: string; // peso
  peso: string;
  calcado: string;
  uniforme: string;
  filiacao: {
    pai: string;
    mae: string;
  };
  estadoCivil: EstadoCivil;
  endereco: string;
  telefones: string[];
  email: string;
  contatoAcidente: {
    nome: string;
    parentesco: string;
    telefone: string;
  };
  formacaoAcademica: string;
  dataIncorporacao: string;
  funcao: string;
  formacaoMilitar: string;
  unidadeMilitar: string;
  companhia: string;
  pelotao: string;
  seccao: string;
  equipa: string;
  dataUltimaPromocao: string;
  situacao: Situacao;
  especialidade: string;
  foto?: string;
  dataPrevisaoRetorno?: string;
  historico: HistoricoEvento[];
}

export type ViewType =
  | "dashboard"
  | "efetivos"
  | "missao"
  | "ferias"
  | "calendario"
  | "relatorios"
  | "adicionar"
  | "gestao_missoes"
  | "promocoes";
