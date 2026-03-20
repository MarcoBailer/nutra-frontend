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
  PerdaDeGordura = 0,
  Hipertrofia = 1,
  Manutencao = 2,
  RecomposicaoCorporal = 3,
  SaudeMetabolica = 4,
  PerformanceEsportiva = 5,
  GanhoDeEnergia = 6,
}

/**
 * Labels para tipos de objetivo.
 */
export const TipoObjetivoLabels: Record<ETipoObjetivo, string> = {
  [ETipoObjetivo.PerdaDeGordura]: 'Perda de Gordura',
  [ETipoObjetivo.Hipertrofia]: 'Hipertrofia',
  [ETipoObjetivo.Manutencao]: 'Manutenção',
  [ETipoObjetivo.RecomposicaoCorporal]: 'Recomposição Corporal',
  [ETipoObjetivo.SaudeMetabolica]: 'Saúde Metabólica',
  [ETipoObjetivo.PerformanceEsportiva]: 'Performance Esportiva',
  [ETipoObjetivo.GanhoDeEnergia]: 'Ganho de Energia',
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
 * Alergias/restrições alimentares. Valores espelham o backend EAlergico.
 */
export enum EAlergico {
  None = 0,
  Leite = 1,
  Ovos = 2,
  Amendoim = 3,
  Nozes = 4,
  Peixe = 5,
  Mariscos = 6,
  Soja = 7,
  Trigo = 8,
  Sesamo = 9,
}

export const AlergicoLabels: Record<EAlergico, string> = {
  [EAlergico.None]: 'Nenhuma',
  [EAlergico.Leite]: 'Leite / Lactose',
  [EAlergico.Ovos]: 'Ovos',
  [EAlergico.Amendoim]: 'Amendoim',
  [EAlergico.Nozes]: 'Nozes / Frutos Secos',
  [EAlergico.Peixe]: 'Peixe',
  [EAlergico.Mariscos]: 'Mariscos / Frutos do Mar',
  [EAlergico.Soja]: 'Soja',
  [EAlergico.Trigo]: 'Trigo / Glúten',
  [EAlergico.Sesamo]: 'Gergelim / Sésamo',
};

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

/**
 * Plano de assinatura do nutricionista.
 */
export enum EPlanoAssinatura {
  Gratuito = 0,
  Basico = 1,
  Profissional = 2,
  Premium = 3,
}

/**
 * Labels para planos de assinatura.
 */
export const PlanoAssinaturaLabels: Record<EPlanoAssinatura, string> = {
  [EPlanoAssinatura.Gratuito]: 'Gratuito',
  [EPlanoAssinatura.Basico]: 'Básico',
  [EPlanoAssinatura.Profissional]: 'Profissional',
  [EPlanoAssinatura.Premium]: 'Premium',
};

/**
 * Equipamentos disponíveis para preparo de refeições.
 */
export enum EEquipamentoDisponivel {
  AirFryer = 1,
  FornoConvencional = 2,
  Microondas = 3,
  Fogao = 4,
  PanelaEletrica = 5,
  Liquidificador = 6,
  ProcessadorAlimentos = 7,
  Nenhum = 8,
}

export const EquipamentoLabels: Record<EEquipamentoDisponivel, string> = {
  [EEquipamentoDisponivel.AirFryer]: 'Air Fryer',
  [EEquipamentoDisponivel.FornoConvencional]: 'Forno Convencional',
  [EEquipamentoDisponivel.Microondas]: 'Micro-ondas',
  [EEquipamentoDisponivel.Fogao]: 'Fogão',
  [EEquipamentoDisponivel.PanelaEletrica]: 'Panela Elétrica',
  [EEquipamentoDisponivel.Liquidificador]: 'Liquidificador',
  [EEquipamentoDisponivel.ProcessadorAlimentos]: 'Processador de Alimentos',
  [EEquipamentoDisponivel.Nenhum]: 'Nenhum',
};

/**
 * Condições clínicas do histórico médico.
 */
export enum ECondicaoClinica {
  Diabetes = 1,
  DiabetesTipo1 = 2,
  DiabetesTipo2 = 3,
  Hipertensao = 4,
  Dislipidemia = 5,
  Hipotireoidismo = 6,
  Hipertireoidismo = 7,
  SindromeMetabolica = 8,
  DoencaCeliaca = 9,
  DoencaInflamatoriaIntestinal = 10,
  SindromeIntestinalIrritavel = 11,
  Gastrite = 12,
  RefluxoGastroesofagico = 13,
  InsuficienciaRenal = 14,
  EsteatoseHepatica = 15,
  Anemia = 16,
  Osteoporose = 17,
  Gota = 18,
  TranstornoAlimentar = 19,
  Depressao = 20,
  Ansiedade = 21,
  Outro = 99,
}

export const CondicaoClinicaLabels: Record<ECondicaoClinica, string> = {
  [ECondicaoClinica.Diabetes]: 'Diabetes',
  [ECondicaoClinica.DiabetesTipo1]: 'Diabetes Tipo 1',
  [ECondicaoClinica.DiabetesTipo2]: 'Diabetes Tipo 2',
  [ECondicaoClinica.Hipertensao]: 'Hipertensão',
  [ECondicaoClinica.Dislipidemia]: 'Dislipidemia',
  [ECondicaoClinica.Hipotireoidismo]: 'Hipotireoidismo',
  [ECondicaoClinica.Hipertireoidismo]: 'Hipertireoidismo',
  [ECondicaoClinica.SindromeMetabolica]: 'Síndrome Metabólica',
  [ECondicaoClinica.DoencaCeliaca]: 'Doença Celíaca',
  [ECondicaoClinica.DoencaInflamatoriaIntestinal]: 'Doença Inflamatória Intestinal',
  [ECondicaoClinica.SindromeIntestinalIrritavel]: 'Síndrome do Intestino Irritável',
  [ECondicaoClinica.Gastrite]: 'Gastrite',
  [ECondicaoClinica.RefluxoGastroesofagico]: 'Refluxo Gastroesofágico',
  [ECondicaoClinica.InsuficienciaRenal]: 'Insuficiência Renal',
  [ECondicaoClinica.EsteatoseHepatica]: 'Esteatose Hepática',
  [ECondicaoClinica.Anemia]: 'Anemia',
  [ECondicaoClinica.Osteoporose]: 'Osteoporose',
  [ECondicaoClinica.Gota]: 'Gota',
  [ECondicaoClinica.TranstornoAlimentar]: 'Transtorno Alimentar',
  [ECondicaoClinica.Depressao]: 'Depressão',
  [ECondicaoClinica.Ansiedade]: 'Ansiedade',
  [ECondicaoClinica.Outro]: 'Outro',
};
