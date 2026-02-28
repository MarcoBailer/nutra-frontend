/**
 * @fileoverview Enums que espelham os enums do backend Nutra (.NET).
 * 
 * Estes enums são usados para tipar corretamente os dados enviados e recebidos
 * da API Nutra. Mantêm os mesmos valores numéricos do backend para garantir
 * compatibilidade.
 * 
 * IMPORTANTE: Ao adicionar novos valores no backend, atualizar este arquivo.
 * 
 * @see {@link ../../../nutra/Enum/} Enums do backend
 */

/**
 * Tipo de tabela de alimentos.
 * Identifica a fonte dos dados nutricionais.
 */
export enum ETipoTabela {
  /** Tabela Brasileira de Composição de Alimentos */
  Tbca = 0,
  /** Alimentos de fabricantes (industrializados) */
  Fabricante = 1,
  /** Alimentos de redes de fast food */
  FastFood = 2,
  /** Alimentos genéricos/personalizados */
  Generico = 3,
}

/**
 * Labels amigáveis para tipos de tabela.
 */
export const TipoTabelaLabels: Record<ETipoTabela, string> = {
  [ETipoTabela.Tbca]: 'TBCA',
  [ETipoTabela.Fabricante]: 'Fabricantes',
  [ETipoTabela.FastFood]: 'Fast Food',
  [ETipoTabela.Generico]: 'Genérico',
};

/**
 * Tipo de refeição.
 * Usado para categorizar consumo e planejamento.
 */
export enum ETipoRefeicao {
  CafeDaManha = 0,
  LancheManha = 1,
  Almoco = 2,
  LancheTarde = 3,
  Jantar = 4,
  Ceia = 5,
  PreTreino = 6,
  PosTreino = 7,
  Outro = 8,
}

/**
 * Labels amigáveis para tipos de refeição.
 */
export const TipoRefeicaoLabels: Record<ETipoRefeicao, string> = {
  [ETipoRefeicao.CafeDaManha]: 'Café da Manhã',
  [ETipoRefeicao.LancheManha]: 'Lanche da Manhã',
  [ETipoRefeicao.Almoco]: 'Almoço',
  [ETipoRefeicao.LancheTarde]: 'Lanche da Tarde',
  [ETipoRefeicao.Jantar]: 'Jantar',
  [ETipoRefeicao.Ceia]: 'Ceia',
  [ETipoRefeicao.PreTreino]: 'Pré-Treino',
  [ETipoRefeicao.PosTreino]: 'Pós-Treino',
  [ETipoRefeicao.Outro]: 'Outro',
};

/**
 * Gênero biológico.
 * Usado para cálculos de TMB e composição corporal.
 */
export enum EGeneroBiologico {
  Masculino = 0,
  Feminino = 1,
}

/**
 * Nível de atividade física.
 * Usado para cálculo de GET (Gasto Energético Total).
 */
export enum ENivelAtividadeFisica {
  Sedentario = 0,
  LevementeAtivo = 1,
  ModeramenteAtivo = 2,
  MuitoAtivo = 3,
  ExtremamenteAtivo = 4,
}

/**
 * Labels e fatores para níveis de atividade física.
 */
export const NivelAtividadeInfo: Record<ENivelAtividadeFisica, { label: string; fator: number }> = {
  [ENivelAtividadeFisica.Sedentario]: { label: 'Sedentário', fator: 1.2 },
  [ENivelAtividadeFisica.LevementeAtivo]: { label: 'Levemente Ativo', fator: 1.375 },
  [ENivelAtividadeFisica.ModeramenteAtivo]: { label: 'Moderadamente Ativo', fator: 1.55 },
  [ENivelAtividadeFisica.MuitoAtivo]: { label: 'Muito Ativo', fator: 1.725 },
  [ENivelAtividadeFisica.ExtremamenteAtivo]: { label: 'Extremamente Ativo', fator: 1.9 },
};

/**
 * Labels simples para níveis de atividade física.
 */
export const NivelAtividadeLabels: Record<ENivelAtividadeFisica, string> = {
  [ENivelAtividadeFisica.Sedentario]: 'Sedentário',
  [ENivelAtividadeFisica.LevementeAtivo]: 'Levemente Ativo',
  [ENivelAtividadeFisica.ModeramenteAtivo]: 'Moderadamente Ativo',
  [ENivelAtividadeFisica.MuitoAtivo]: 'Muito Ativo',
  [ENivelAtividadeFisica.ExtremamenteAtivo]: 'Extremamente Ativo',
};

/**
 * Labels para gênero biológico.
 */
export const GeneroLabels: Record<EGeneroBiologico, string> = {
  [EGeneroBiologico.Masculino]: 'Masculino',
  [EGeneroBiologico.Feminino]: 'Feminino',
};

/**
 * Tipo de objetivo nutricional.
 */
export enum ETipoObjetivo {
  PerderPeso = 0,
  ManterPeso = 1,
  GanharMassa = 2,
  Recomposicao = 3,
  Performance = 4,
  Saude = 5,
}

/**
 * Labels para tipos de objetivo.
 */
export const TipoObjetivoLabels: Record<ETipoObjetivo, string> = {
  [ETipoObjetivo.PerderPeso]: 'Perder Peso',
  [ETipoObjetivo.ManterPeso]: 'Manter Peso',
  [ETipoObjetivo.GanharMassa]: 'Ganhar Massa',
  [ETipoObjetivo.Recomposicao]: 'Recomposição Corporal',
  [ETipoObjetivo.Performance]: 'Performance',
  [ETipoObjetivo.Saude]: 'Saúde Geral',
};

/**
 * Preferência alimentar/dieta.
 */
export enum EPreferenciaAlimentar {
  SemRestricao = 0,
  Vegetariano = 1,
  Vegano = 2,
  Pescetariano = 3,
  LowCarb = 4,
  Cetogenica = 5,
  Paleo = 6,
  Mediterranean = 7,
}

/**
 * Status do plano alimentar.
 */
export enum EStatusPlano {
  Rascunho = 0,
  Ativo = 1,
  Pausado = 2,
  Concluido = 3,
  Cancelado = 4,
}

/**
 * Labels para status do plano.
 */
export const StatusPlanoLabels: Record<EStatusPlano, string> = {
  [EStatusPlano.Rascunho]: 'Rascunho',
  [EStatusPlano.Ativo]: 'Ativo',
  [EStatusPlano.Pausado]: 'Pausado',
  [EStatusPlano.Concluido]: 'Concluído',
  [EStatusPlano.Cancelado]: 'Cancelado',
};

/**
 * Tipo de preferência (gosto/não gosta).
 */
export enum ETipoPreferencia {
  Gosta = 0,
  NaoGosta = 1,
  Alergia = 2,
  Intolerancia = 3,
}

/**
 * Alergias alimentares comuns.
 */
export enum EAlergico {
  Gluten = 0,
  Lactose = 1,
  Ovos = 2,
  Amendoim = 3,
  FrutosDoMar = 4,
  Soja = 5,
  Nozes = 6,
  Trigo = 7,
}

/**
 * Nível de habilidade culinária.
 */
export enum ENivelHabilidadeCulinaria {
  Iniciante = 0,
  Intermediario = 1,
  Avancado = 2,
  Chef = 3,
}

/**
 * Orçamento mensal estimado para alimentação.
 */
export enum EOrcamentoMensalEstimado {
  Economico = 0,
  Medio = 1,
  Alto = 2,
  Premium = 3,
}

/**
 * Tipo de role/perfil do usuário.
 */
export enum ETipoRole {
  Paciente = 0,
  Nutricionista = 1,
  Admin = 2,
}

/**
 * Status de vínculo entre nutricionista e paciente.
 */
export enum EStatusVinculo {
  Pendente = 0,
  Ativo = 1,
  Encerrado = 2,
  Recusado = 3,
}

/**
 * Fórmulas para cálculo de TMB.
 */
export enum EFormulaCalculo {
  HarrisBenedict = 0,
  MifflinStJeor = 1,
  KatchMcArdle = 2,
}

/**
 * Tipo de foto de progresso.
 */
export enum ETipoFotoProgresso {
  Frente = 0,
  Costas = 1,
  LateralEsquerda = 2,
  LateralDireita = 3,
}

/**
 * Labels para preferências alimentares.
 */
export const PreferenciaAlimentarLabels: Record<EPreferenciaAlimentar, string> = {
  [EPreferenciaAlimentar.SemRestricao]: 'Sem Restrição',
  [EPreferenciaAlimentar.Vegetariano]: 'Vegetariano',
  [EPreferenciaAlimentar.Vegano]: 'Vegano',
  [EPreferenciaAlimentar.Pescetariano]: 'Pescetariano',
  [EPreferenciaAlimentar.LowCarb]: 'Low Carb',
  [EPreferenciaAlimentar.Cetogenica]: 'Cetogênica',
  [EPreferenciaAlimentar.Paleo]: 'Paleo',
  [EPreferenciaAlimentar.Mediterranean]: 'Mediterrânea',
};

/**
 * Alias para TipoObjetivoLabels (usado em alguns componentes como ObjetivoLabels).
 */
export const ObjetivoLabels = TipoObjetivoLabels;
