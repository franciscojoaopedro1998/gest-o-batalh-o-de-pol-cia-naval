import { Patente, Situacao, EstadoCivil, Unidade, Militar, TipoPrestacaoServico } from "./types";

export const PATENTES_LIST = Object.values(Patente);
export const SITUACOES_LIST = Object.values(Situacao);
export const ESTADOS_CIVIS_LIST = Object.values(EstadoCivil);
export const UNIDADES_LIST = Object.values(Unidade);
export const TIPOS_PRESTACAO_LIST = Object.values(TipoPrestacaoServico);

export const COMPANHIAS_LIST = ["1ª Companhia", "2ª Companhia", "3ª Companhia"];
export const PELOTOES_LIST = ["1º Pelotão", "2º Pelotão", "3º Pelotão"];
export const SECCOES_LIST = ["1ª Secção", "2ª Secção", "3ª Secção"];
export const EQUIPAS_LIST = ["1ª Equipa", "2ª Equipa", "3ª Equipa"];

export const GRUPOS_SANGUINEOS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

// Criando data de retorno próxima para teste de notificação (hoje + 3 dias)
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 3);
const returnDate = nextWeek.toISOString().split("T")[0];

export const MOCK_MILITARES: Militar[] = [
  {
    id: "1",
    nip: "1000234",
    patente: Patente.CAPITAO_MAR_GUERRA,
    formaPrestacaoServico: "Quadro Permanente",
    tipoPrestacaoServico: TipoPrestacaoServico.QP,
    nome: "Carlos Eduardo Santos",
    bi: "123456789LA045",
    dataNascimento: "1980-05-15",
    sexo: "M",
    grupoSanguineo: "O+",
    altura: "182",
    peso: "85",
    calcado: "43",
    uniforme: "XL",
    filiacao: { pai: "António Santos", mae: "Maria Santos" },
    estadoCivil: EstadoCivil.CASADO,
    endereco: "Bairro Naval, Luanda, Angola",
    telefones: ["+244 923 000 001"],
    email: "carlos.santos@marinha.mil.ao",
    contatoAcidente: {
      nome: "Ana Santos",
      parentesco: "Esposa",
      telefone: "923 000 002",
    },
    formacaoAcademica: "Mestrado em Ciências Militares Navais",
    dataIncorporacao: "2000-02-01",
    funcao: "Comandante de Unidade",
    formacaoMilitar: "Academia Naval",
    unidadeMilitar: "Comando do Batalhão",
    companhia: "1ª Companhia",
    pelotao: "1º Pelotão",
    seccao: "1ª Secção",
    equipa: "1ª Equipa",
    dataUltimaPromocao: "2022-11-10",
    situacao: Situacao.FORMACAO,
    especialidade: "Fuzileiro Naval",
    // Fix: renamed historicoPromocoes to historico and updated object structure
    historico: [
      {
        id: "h1",
        tipo: "PROMOÇÃO",
        data: "2000-02-01",
        descricao: `Incorporação como ${Patente.GUARDA_MARINHA}`,
      },
      {
        id: "h2",
        tipo: "PROMOÇÃO",
        data: "2015-06-12",
        descricao: `Promovido a ${Patente.CAPITAO_FRAGATA}`,
      },
    ],
  },
  {
    id: "2",
    nip: "1000567",
    patente: Patente.PRIMEIRO_SARGENTO,
    formaPrestacaoServico: "Quadro Permanente",
    tipoPrestacaoServico: TipoPrestacaoServico.QP,
    nome: "João Manuel Pereira",
    bi: "987654321BE099",
    dataNascimento: "1988-08-22",
    sexo: "M",
    grupoSanguineo: "A+",
    altura: "175",
    peso: "78",
    calcado: "41",
    uniforme: "M",
    filiacao: { pai: "Manuel Pereira", mae: "Isabel Pereira" },
    estadoCivil: EstadoCivil.SOLTEIRO,
    endereco: "Rua das Flores, Edifício 4, Luanda",
    telefones: ["+244 923 000 111"],
    email: "joao.pereira@marinha.mil.ao",
    contatoAcidente: {
      nome: "Manuel Pereira",
      parentesco: "Pai",
      telefone: "923 000 112",
    },
    formacaoAcademica: "Bacharelato em Logística",
    dataIncorporacao: "2010-03-15",
    funcao: "Logística e Suprimentos",
    formacaoMilitar: "Escola de Sargentos",
    unidadeMilitar: "Comando do Batalhão",
    companhia: "2ª Companhia",
    pelotao: "2º Pelotão",
    seccao: "2ª Secção",
    equipa: "2ª Equipa",
    dataUltimaPromocao: "2023-01-20",
    situacao: Situacao.MISSAO,
    especialidade: "Logística Naval",
    dataPrevisaoRetorno: returnDate,
    // Fix: added missing required historico property
    historico: [],
  },
];
