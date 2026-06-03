import type { MatoGrossoDigitalDivideData } from "../../types/digitalDivide";

export const fallbackDigitalDivideMT: MatoGrossoDigitalDivideData = {
  territorio: {
    id: "51",
    nome: "Mato Grosso",
    uf: "MT",
  },
  choqueTrabalhoRemoto: {
    percentualAfastadosDistanciamento: 22.4,
    teleworkByRendimento: [
      { faixaRendimento: "Até 1 salário mínimo", percentualTeletrabalho: 5.8 },
      { faixaRendimento: "De 1 a 2 salários mínimos", percentualTeletrabalho: 11.3 },
      { faixaRendimento: "De 2 a 5 salários mínimos", percentualTeletrabalho: 27.6 },
      { faixaRendimento: "De 5 a 10 salários mínimos", percentualTeletrabalho: 50.4 },
      { faixaRendimento: "Mais de 10 salários mínimos", percentualTeletrabalho: 71.2 },
    ],
    teleworkByCorRaca: [
      { grupo: "Branca", percentualTeletrabalho: 23.7 },
      { grupo: "Preta", percentualTeletrabalho: 15.4 },
      { grupo: "Parda", percentualTeletrabalho: 14.8 },
      { grupo: "Amarela", percentualTeletrabalho: 18.2 },
      { grupo: "Indígena", percentualTeletrabalho: 9.6 },
    ],
    teleworkByEscolaridade: [
      { grupo: "Sem instrução e fundamental incompleto", percentualTeletrabalho: 2.9 },
      { grupo: "Fundamental completo e médio incompleto", percentualTeletrabalho: 7.1 },
      { grupo: "Médio completo e superior incompleto", percentualTeletrabalho: 15.8 },
      { grupo: "Superior completo", percentualTeletrabalho: 51.6 },
    ],
  },
  realidadeInfraestrutura: {
    percentualDomiciliosSemInternet: 22.8,
    motivosDomiciliosSemInternet: [
      { motivo: "Serviço de internet é caro", percentual: 28.2 },
      { motivo: "Nenhum morador sabe usar", percentual: 22.1 },
      { motivo: "Não acha necessário", percentual: 15.7 },
      { motivo: "Serviço não disponível na área", percentual: 19.4 },
      { motivo: "Equipamento muito caro", percentual: 12.3 },
      { motivo: "Outros motivos", percentual: 2.3 },
    ],
    equipamentosUtilizados: [
      { equipamento: "Telefone celular", percentualUsuarios: 97.2 },
      { equipamento: "Microcomputador", percentualUsuarios: 41.3 },
      { equipamento: "Televisão", percentualUsuarios: 17.4 },
      { equipamento: "Tablet", percentualUsuarios: 9.6 },
    ],
    motivosFaltaAcessoPessoas: [
      { motivo: "Serviço de internet é caro", percentual: 32.4 },
      { motivo: "Nenhum morador sabe usar", percentual: 24.7 },
      { motivo: "Serviço não disponível na área", percentual: 18.6 },
      { motivo: "Não acha necessário", percentual: 16.8 },
      { motivo: "Outros", percentual: 7.5 },
    ],
  },
  resumoNarrativo: {
    gapTeleworkRendimentoExtremo: 65.4,
    percentualDependenciaCelular: 97.2,
    principalBarreiraAcesso: "Serviço de internet é caro",
    percentualAfastadosEmTeletrabalho: 8.7,
  },
  fonte: {
    pesquisas: ["PNAD COVID-19", "PNAD Contínua TIC"],
    tabelas: ["6817", "6821", "6841", "7447", "7454", "7455"],
    referencia: "fallback",
    dataExtracao: "2024-01-01T00:00:00.000Z",
  },
  isFallback: true,
};
