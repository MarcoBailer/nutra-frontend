/**
 * @fileoverview DTOs (Data Transfer Objects) para a API Nutra.
 * 
 * Este arquivo define as interfaces TypeScript que correspondem aos DTOs
 * do backend .NET. Usado para tipar corretamente requisições e respostas.
 * 
 * CONVENÇÃO:
 * - Sufixo 'Dto' para objetos de entrada (request body)
 * - Sufixo 'Response' ou nome descritivo para objetos de saída
 * 
 * @see {@link ../../../nutra/Models/Dtos/} DTOs do backend
 */

import {
  ETipoTabela,
  ETipoRefeicao,
  EGeneroBiologico,
  ENivelAtividadeFisica,
  ETipoObjetivo,
  EPreferenciaAlimentar,
  EStatusPlano,
  ETipoPreferencia,
  EAlergico,
  ENivelHabilidadeCulinaria,
  EOrcamentoMensalEstimado,
  ETipoRole,
  EStatusVinculo,
  ETipoFotoProgresso,
  EPlanoAssinatura,
} from './enums';

// =====================================================
// USUÁRIO E CONTA
// =====================================================

/**
 * Dados do usuário retornados pelo endpoint /api/Accounts/me
 */
export interface NutraUser {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string | null;
  role: ETipoRole;
  dataNascimento: string | null;
  telefone: string | null;
  fotoPerfilUrl: string | null;
  ativo: boolean;
  criadoEm: string;
  endereco: {
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
  };
}

/**
 * DTO para atualização de perfil
 */
export interface UpdateProfileDto {
  nomeCompleto?: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// =====================================================
// PERFIL NUTRICIONAL
// =====================================================

/**
 * Preferência de alimento (gostar/não gostar)
 */
export interface PreferenciaCadastroDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  tipoPreferencia: ETipoPreferencia;
}

/**
 * Histórico clínico do paciente
 */
export interface HistoricoClinicoDto {
  id?: number;
  condicao: string;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  emTratamento: boolean;
}

/**
 * DTO completo do perfil nutricional
 */
export interface PerfilNutricionalDto {
  userId?: string;
  alturaCm: number;
  pesoAtualKg: number;
  percentualGorduraCorporal?: number;
  circunferenciaCinturaCm?: number;
  circunferenciaQuadrilCm?: number;
  circunferenciaBracoCm?: number;
  fatorAtividade: number;
  nivelAtividade: ENivelAtividadeFisica;
  ocupacaoProfissional?: string;
  habilidadeCulinaria: ENivelHabilidadeCulinaria;
  orcamentoMensal: EOrcamentoMensalEstimado;
  possuiDoencasPreExistentes: boolean;
  descricaoCondicoesMedicas?: string;
  fumante: boolean;
  qualidadeSono?: number;
  horasSonoPorNoite?: number;
  pesoDesejadoKg?: number;
  refeicoesPorDiaDesejadas: number;
  tempoDisponivelPreparoMinutos: number;
  dataNascimento: string;
  genero: EGeneroBiologico;
  objetivo: ETipoObjetivo;
  preferenciaDieta: EPreferenciaAlimentar;
  restricoesIds: EAlergico[];
  preferencias: PreferenciaCadastroDto[];
  equipamentosIds: number[];
  historicoClinicos: HistoricoClinicoDto[];
}

// =====================================================
// ALIMENTOS E BUSCA
// =====================================================

/**
 * Alimento resumido para listagem
 */
export interface AlimentoResumoDto {
  id: number;
  nome: string;
  tipoTabela: ETipoTabela;
  energiaKcal: number;
  proteinaG: number;
  carboidratoG: number;
  gorduraG: number;
  fibraG: number;
  porcaoG?: number;
  marca?: string;
}

/**
 * Alimento completo com todos os nutrientes (para detalhes)
 */
export interface AlimentoDto {
  codigo: number;
  tabela: ETipoTabela;
  descricao: string;
  energiaKcal: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  fibra: number;
  porcaoG: number;
  sodio: number;
  colesterol: number;
  gorduraSaturada: number;
  gorduraTrans: number;
  calcio?: number;
  ferro?: number;
  vitaminaA?: number;
  vitaminaC?: number;
}

/**
 * Resultado de busca de alimentos
 */
export interface BuscaAlimentosResponse {
  tbca: AlimentoResumoDto[];
  fabricantes: AlimentoResumoDto[];
  fastFood: AlimentoResumoDto[];
  genericos: AlimentoResumoDto[];
  totalResultados: number;
}

/**
 * Resultado paginado genérico
 */
export interface PaginatedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: T[];
}

// =====================================================
// PLANO ALIMENTAR
// =====================================================

/**
 * DTO para criar plano alimentar
 */
export interface CriarPlanoAlimentarDto {
  nome: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
  modeloDietaOrigemId?: number;
  caloriasAlvoDiarias?: number;
  proteinaAlvoG?: number;
  carboidratoAlvoG?: number;
  gorduraAlvoG?: number;
  fibraAlvoG?: number;
  aguaAlvoL?: number;
  refeicoes?: RefeicaoPlanoDto[];
}

/**
 * Refeição do plano
 */
export interface RefeicaoPlanoDto {
  tipoRefeicao: ETipoRefeicao;
  horarioSugerido?: string;
  ordem: number;
  observacoes?: string;
  itens: ItemRefeicaoDto[];
}

/**
 * Item de uma refeição
 */
export interface ItemRefeicaoDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  quantidadeG: number;
  ordem: number;
  observacoes?: string;
  substituicoes?: SubstituicaoDto[];
}

/**
 * Substituição de alimento
 */
export interface SubstituicaoDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  quantidadeG: number;
}

/**
 * DTO para adicionar refeição
 */
export interface AdicionarRefeicaoDto {
  tipoRefeicao: ETipoRefeicao;
  horarioSugerido?: string;
  ordem: number;
  observacoes?: string;
  itens: ItemRefeicaoDto[];
}

/**
 * DTO para adicionar item
 */
export interface AdicionarItemDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  quantidadeG: number;
  ordem: number;
  observacoes?: string;
}

/**
 * DTO para atualizar plano
 */
export interface AtualizarPlanoAlimentarDto {
  nome?: string;
  descricao?: string;
  dataFim?: string;
  status?: EStatusPlano;
  observacoes?: string;
}

/**
 * Macros diários do plano
 */
export interface MacrosDiariosPlanoDto {
  caloriasKcal: number;
  proteinaG: number;
  carboidratoG: number;
  gorduraG: number;
  fibraG: number;
  aguaL: number;
}

/**
 * Resultado de item da refeição
 */
export interface ItemRefeicaoResultadoDto {
  id: number;
  alimentoId: number;
  tipoTabela: ETipoTabela;
  nomeAlimento: string;
  quantidadeG: number;
  ordem: number;
  observacoes?: string;
  energiaKcal: number;
  proteinaG: number;
  carboidratoG: number;
  gorduraG: number;
  fibraG: number;
  substituicoes: SubstituicaoResultadoDto[];
}

/**
 * Resultado de substituição
 */
export interface SubstituicaoResultadoDto {
  id: number;
  alimentoId: number;
  tipoTabela: ETipoTabela;
  nomeAlimento: string;
  quantidadeG: number;
  energiaKcal: number;
}

/**
 * Resultado de refeição do plano
 */
export interface RefeicaoPlanoResultadoDto {
  id: number;
  tipoRefeicao: ETipoRefeicao;
  horarioSugerido?: string;
  ordem: number;
  observacoes?: string;
  totalEnergiaKcal: number;
  totalProteinaG: number;
  totalCarboidratoG: number;
  totalGorduraG: number;
  totalFibraG: number;
  percentualCaloricoRefeicao: number;
  itens: ItemRefeicaoResultadoDto[];
}

/**
 * Resultado completo do plano alimentar
 */
export interface PlanoAlimentarResultadoDto {
  id: number;
  nome: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  status: EStatusPlano;
  observacoes?: string;
  metasDiarias: MacrosDiariosPlanoDto;
  totaisCalculados: MacrosDiariosPlanoDto;
  diferencaMetas: MacrosDiariosPlanoDto;
  profissionalResponsavel?: string;
  modeloDietaOrigem?: string;
  refeicoes: RefeicaoPlanoResultadoDto[];
  criadoEm: string;
  atualizadoEm?: string;
}

// =====================================================
// DIÁRIO ALIMENTAR
// =====================================================

/**
 * DTO para registrar consumo
 */
export interface RegistroConsumoDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  quantidadeConsumidaG: number;
  tipoRefeicao: ETipoRefeicao;
  itemRefeicaoPlanoId?: number;
  codigoBarras?: string;
}

/**
 * DTO para registrar consumo em lote
 */
export interface RegistroConsumoLoteDto {
  itens: RegistroConsumoDto[];
}

/**
 * DTO para foto de refeição
 */
export interface FotoRefeicaoDto {
  tipoRefeicao: ETipoRefeicao;
  fotoUrl: string;
  descricao?: string;
  registroAlimentarId?: number;
}

/**
 * Resultado de registro de consumo
 */
export interface RegistroConsumoResultadoDto {
  id: number;
  alimentoId: number;
  tipoTabela: ETipoTabela;
  nomeAlimento: string;
  quantidadeConsumidaG: number;
  dataConsumo: string;
  refeicao: ETipoRefeicao;
  energiaKcal: number;
  proteinaG: number;
  carboidratoG: number;
  gorduraG: number;
  fibraG: number;
  codigoBarras?: string;
  itemPlanoVinculado?: string;
}

/**
 * Resultado de foto de refeição
 */
export interface FotoRefeicaoResultadoDto {
  id: number;
  tipoRefeicao: ETipoRefeicao;
  fotoUrl: string;
  descricao?: string;
  dataRegistro: string;
}

/**
 * Macros de uma refeição
 */
export interface MacroRefeicaoDto {
  energiaKcal: number;
  proteinaG: number;
  carboidratoG: number;
  gorduraG: number;
  fibraG: number;
}

/**
 * Refeição do diário (consumido vs planejado)
 */
export interface RefeicaoDiarioDto {
  tipoRefeicao: ETipoRefeicao;
  horarioPlanejado?: string;
  planejado?: MacroRefeicaoDto;
  consumido: MacroRefeicaoDto;
  percentualAderencia?: number;
  registros: RegistroConsumoResultadoDto[];
}

/**
 * Diário do dia completo
 */
export interface DiarioDiaDto {
  data: string;
  metasDoDia: MacrosDiariosPlanoDto;
  totalConsumido: MacrosDiariosPlanoDto;
  saldoRestante: MacrosDiariosPlanoDto;
  percentualAderenciaCaloricas: number;
  refeicoes: RefeicaoDiarioDto[];
  fotos: FotoRefeicaoResultadoDto[];
}

/**
 * Relatório de adesão
 */
export interface RelatorioAdesaoDto {
  dataInicio: string;
  dataFim: string;
  diasTotais: number;
  diasComRegistro: number;
  percentualAderenciaMedia: number;
  mediaCaloriasDiarias: number;
  metaCaloriasDiaria: number;
  variacaoCaloriasDiaria: number;
  diasAcimaMeta: number;
  diasAbaixoMeta: number;
  diasDentroMeta: number;
}

// =====================================================
// AVALIAÇÃO NUTRICIONAL
// =====================================================

/**
 * DTO para avaliação antropométrica
 */
export interface AvaliacaoAntropometricaDto {
  pesoKg: number;
  alturaCm: number;
  circunferenciaCinturaCm?: number;
  circunferenciaQuadrilCm?: number;
  circunferenciaBracoCm?: number;
  circunferenciaPescoCm?: number;
  dobraCutaneaTricepsMm?: number;
  dobraCutaneaSubescapularMm?: number;
  dobraCutaneaSuprailiacaMm?: number;
  dobraCutaneaAbdominalMm?: number;
  dobraCutaneaCoxaMm?: number;
  observacoes?: string;
}

/**
 * Resultado de avaliação nutricional
 */
export interface AvaliacaoResultadoDto {
  id: number;
  dataAvaliacao: string;
  pesoKg: number;
  alturaCm: number;
  imc: number;
  classificacaoImc: string;
  rcq?: number;
  percentualGordura?: number;
  massaMagraKg?: number;
  massaGordaKg?: number;
  pesoIdealKg?: number;
  tmbHarrisBenedict: number;
  tmbMifflinStJeor: number;
  tmbKatchMcArdle?: number;
  getEstimado: number;
  macrosSugeridos: MacrosDiariosPlanoDto;
  observacoes?: string;
  profissionalResponsavel?: string;
  criadoEm: string;
}

/**
 * Comparação entre avaliações
 */
export interface ComparacaoAvaliacoesDto {
  avaliacaoAnterior: AvaliacaoResultadoDto;
  avaliacaoAtual: AvaliacaoResultadoDto;
  diferencaPesoKg: number;
  diferencaImc: number;
  diferencaPercentualGordura?: number;
  diferencaMassaMagraKg?: number;
  evolucaoPositiva: boolean;
  diasEntrAvaliacoes: number;
}

// =====================================================
// REGISTRO BIOMÉTRICO
// =====================================================

/**
 * DTO para registro biométrico
 */
export interface RegistroBiometricoDto {
  pesoKg: number;
  circunferenciaCinturaCm?: number;
  circunferenciaQuadrilCm?: number;
  circunferenciaBracoCm?: number;
  observacoes?: string;
}

/**
 * Histórico biométrico
 */
export interface HistoricoBiometricoDto {
  id: number;
  data: string;
  pesoKg: number;
  circunferenciaCinturaCm?: number;
  circunferenciaQuadrilCm?: number;
  circunferenciaBracoCm?: number;
  observacoes?: string;
}

// =====================================================
// NUTRICIONISTA
// =====================================================

/**
 * DTO para cadastro de nutricionista
 */
export interface CadastroNutricionistaDto {
  nomeCompleto: string;
  email: string;
  cpf: string;
  crn: string;
  telefone?: string;
  especialidades?: string[];
  biografia?: string;
}

/**
 * DTO para clínica
 */
export interface ClinicaDto {
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  cnpj?: string;
}

/**
 * Resultado de clínica
 */
export interface ClinicaResultadoDto {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  cnpj?: string;
  criadoEm: string;
  ativo: boolean;
}

/**
 * DTO para convite de vínculo
 */
export interface ConviteVinculoDto {
  emailPaciente: string;
  mensagem?: string;
}

/**
 * Paciente resumido
 */
export interface PacienteResumoDto {
  id: string;
  nomeCompleto: string;
  email: string;
  fotoPerfilUrl?: string;
  statusVinculo: EStatusVinculo;
  dataVinculo: string;
  ultimaAtividade?: string;
}

/**
 * Perfil profissional
 */
export interface PerfilProfissionalDto {
  id: number;
  userId: string;
  crn: string;
  especialidades: string[];
  biografia?: string;
  fotoPerfilUrl?: string;
  certificacoes?: string[];
  totalPacientes: number;
  avaliacaoMedia?: number;
}

// =====================================================
// ANAMNESE ALIMENTAR
// =====================================================

/**
 * DTO para anamnese alimentar
 */
export interface AnamneseAlimentarDto {
  frequenciaConsumo: FrequenciaConsumoItem[];
  alimentosFavoritos?: string;
  alimentosEvitados?: string;
  restricoesReligiosas?: string;
  horarioRefeicoes?: HorarioRefeicoesDto;
  consumoAgua?: number;
  suplementosUsados?: string;
  observacoesGerais?: string;
}

/**
 * Item de frequência de consumo
 */
export interface FrequenciaConsumoItem {
  grupoAlimentar: string;
  frequencia: number;
  observacao?: string;
}

/**
 * Horários de refeições
 */
export interface HorarioRefeicoesDto {
  cafeDaManha?: string;
  lancheManha?: string;
  almoco?: string;
  lancheTarde?: string;
  jantar?: string;
  ceia?: string;
}

// =====================================================
// FOTOS DE PROGRESSO
// =====================================================

/**
 * DTO para foto de progresso
 */
export interface FotoProgressoDto {
  tipo: ETipoFotoProgresso;
  fotoUrl: string;
  avaliacaoId?: number;
  observacoes?: string;
}

// =====================================================
// STATUS DIÁRIO (compatível com pipboy)
// =====================================================

/**
 * Status diário do usuário
 */
export interface StatusDiarioDto {
  data: string;
  caloriasConsumidas: number;
  caloriasAlvo: number;
  proteinaConsumidaG: number;
  proteinaAlvoG: number;
  carboidratoConsumidoG: number;
  carboidratoAlvoG: number;
  gorduraConsumidaG: number;
  gorduraAlvoG: number;
  fibraConsumidaG: number;
  fibraAlvoG: number;
  aguaConsumidaL: number;
  aguaAlvoL: number;
  percentualAderencia: number;
  refeicoesRegistradas: number;
  refeicoesPlaneadas: number;
}

// =====================================================
// RESPOSTA PADRÃO
// =====================================================

/**
 * Resposta padrão da API
 */
export interface RetornoPadrao<T = unknown> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
}

// =====================================================
// TIPOS ADICIONAIS PARA NUTRICIONISTAS
// =====================================================

/**
 * DTO para atualizar perfil profissional
 */
export interface UpdatePerfilProfissionalDto {
  especialidades?: string[];
  biografia?: string;
  fotoPerfilUrl?: string;
  certificacoes?: string[];
}

/**
 * Nutricionista resumido (para listagem de pacientes)
 */
export interface NutricionistaResumoDto {
  id: string;
  nomeCompleto: string;
  email: string;
  crn: string;
  especialidades: string[];
  fotoPerfilUrl?: string;
  statusVinculo: EStatusVinculo;
  dataVinculo: string;
}

// =====================================================
// TIPOS ADICIONAIS PARA PLANOS ALIMENTARES
// =====================================================

/**
 * DTO para criar plano para paciente (profissional)
 */
export interface CriarPlanoProfissionalDto extends CriarPlanoAlimentarDto {
  pacienteUserId: string;
}

/**
 * DTO para adicionar substituição
 */
export interface AdicionarSubstituicaoDto {
  alimentoId: number;
  tipoTabela: ETipoTabela;
  quantidadeG: number;
}

/**
 * DTO para criar modelo de dieta
 */
export interface CriarModeloDietaDto {
  nome: string;
  descricao?: string;
  publico: boolean;
  objetivo?: ETipoObjetivo;
  preferenciaDieta?: EPreferenciaAlimentar;
  caloriasBase?: number;
  refeicoes: RefeicaoPlanoDto[];
}

/**
 * Resultado de modelo de dieta
 */
export interface ModeloDietaResultadoDto {
  id: number;
  nome: string;
  descricao?: string;
  publico: boolean;
  objetivo?: string;
  preferenciaDieta?: string;
  caloriasBase?: number;
  totalRefeicoes: number;
  criadoPorId?: string;
  criadoPorNome?: string;
  criadoEm: string;
  refeicoes: RefeicaoPlanoResultadoDto[];
}
