/**
 * @fileoverview Serviço de Diário Alimentar.
 * 
 * Gerencia o registro de consumo diário:
 * - Registro de alimentos consumidos
 * - Fotos de refeições
 * - Comparação planejado vs consumido
 * - Relatórios de aderência
 * 
 * ENDPOINTS:
 * - POST /api/DiarioAlimentar/consumo
 * - POST /api/DiarioAlimentar/consumo/lote
 * - DELETE /api/DiarioAlimentar/consumo/{registroId}
 * - POST /api/DiarioAlimentar/fotos
 * - DELETE /api/DiarioAlimentar/fotos/{fotoId}
 * - GET /api/DiarioAlimentar/fotos
 * - GET /api/DiarioAlimentar/dia
 * - GET /api/DiarioAlimentar/periodo
 * - GET /api/DiarioAlimentar/relatorio-adesao
 * 
 * @see {@link ../../../nutra/Controllers/DiarioAlimentarController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  RegistroConsumoDto,
  RegistroConsumoLoteDto,
  FotoRefeicaoDto,
  FotoRefeicaoResultadoDto,
  DiarioDiaDto,
  RelatorioAdesaoDto,
  RetornoPadrao,
  RegistroConsumoResultadoDto,
} from '@/types/api';
import { format } from 'date-fns';

/**
 * Serviço de diário alimentar.
 */
export const foodDiaryService = {
  // =====================================================
  // REGISTRO DE CONSUMO
  // =====================================================

  /**
   * Registra o consumo de um alimento.
   * 
   * @param data - Dados do consumo
   * @returns Registro criado
   */
  async registerConsumption(data: RegistroConsumoDto): Promise<RegistroConsumoResultadoDto> {
    const response = await apiClient.post<RegistroConsumoResultadoDto>(
      '/api/DiarioAlimentar/consumo',
      data
    );
    return response.data;
  },

  /**
   * Registra múltiplos consumos de uma vez (lote).
   * Útil para registrar uma refeição completa.
   * 
   * @param data - Lista de consumos
   * @returns Resultado da operação
   */
  async registerConsumptionBatch(
    data: RegistroConsumoLoteDto
  ): Promise<RetornoPadrao<RegistroConsumoResultadoDto[]>> {
    const response = await apiClient.post<RetornoPadrao<RegistroConsumoResultadoDto[]>>(
      '/api/DiarioAlimentar/consumo/lote',
      data
    );
    return response.data;
  },

  /**
   * Exclui um registro de consumo.
   * 
   * @param registroId - ID do registro
   * @returns Resultado da operação
   */
  async deleteConsumption(registroId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/DiarioAlimentar/consumo/${registroId}`
    );
    return response.data;
  },

  // =====================================================
  // FOTOS DE REFEIÇÃO
  // =====================================================

  /**
   * Adiciona uma foto de refeição.
   * 
   * @param data - Dados da foto
   * @returns Foto registrada
   */
  async addMealPhoto(data: FotoRefeicaoDto): Promise<FotoRefeicaoResultadoDto> {
    const response = await apiClient.post<FotoRefeicaoResultadoDto>(
      '/api/DiarioAlimentar/fotos',
      data
    );
    return response.data;
  },

  /**
   * Remove uma foto de refeição.
   * 
   * @param fotoId - ID da foto
   * @returns Resultado da operação
   */
  async removeMealPhoto(fotoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/DiarioAlimentar/fotos/${fotoId}`
    );
    return response.data;
  },

  /**
   * Lista fotos de refeição de um dia específico.
   * 
   * @param data - Data (padrão: hoje)
   * @returns Lista de fotos
   */
  async getMealPhotos(data?: Date): Promise<FotoRefeicaoResultadoDto[]> {
    const params = data ? { data: format(data, 'yyyy-MM-dd') } : {};
    const response = await apiClient.get<FotoRefeicaoResultadoDto[]>(
      '/api/DiarioAlimentar/fotos',
      { params }
    );
    return response.data;
  },

  // =====================================================
  // DIÁRIO DO DIA
  // =====================================================

  /**
   * Obtém o diário completo de um dia.
   * Inclui: metas, consumido, saldo, refeições detalhadas.
   * 
   * @param data - Data (padrão: hoje)
   * @returns Diário do dia
   */
  async getDailyDiary(data?: Date): Promise<DiarioDiaDto> {
    const params = data ? { data: format(data, 'yyyy-MM-dd') } : {};
    const response = await apiClient.get<DiarioDiaDto>('/api/DiarioAlimentar/dia', { params });
    return response.data;
  },

  /**
   * Obtém o diário de um período.
   * Máximo de 90 dias.
   * 
   * @param dataInicio - Data inicial
   * @param dataFim - Data final
   * @returns Lista de diários por dia
   */
  async getPeriodDiary(dataInicio: Date, dataFim: Date): Promise<DiarioDiaDto[]> {
    const response = await apiClient.get<DiarioDiaDto[]>('/api/DiarioAlimentar/periodo', {
      params: {
        dataInicio: format(dataInicio, 'yyyy-MM-dd'),
        dataFim: format(dataFim, 'yyyy-MM-dd'),
      },
    });
    return response.data;
  },

  // =====================================================
  // RELATÓRIO DE ADERÊNCIA
  // =====================================================

  /**
   * Gera relatório de aderência ao plano alimentar.
   * 
   * @param dataInicio - Data inicial
   * @param dataFim - Data final
   * @returns Relatório de aderência
   */
  async getAdherenceReport(dataInicio: Date, dataFim: Date): Promise<RelatorioAdesaoDto> {
    const response = await apiClient.get<RelatorioAdesaoDto>(
      '/api/DiarioAlimentar/relatorio-adesao',
      {
        params: {
          dataInicio: format(dataInicio, 'yyyy-MM-dd'),
          dataFim: format(dataFim, 'yyyy-MM-dd'),
        },
      }
    );
    return response.data;
  },

  /**
   * Gera relatório de aderência de um paciente (profissional com vínculo ativo).
   * 
   * @param pacienteUserId - ID do paciente
   * @param dataInicio - Data inicial
   * @param dataFim - Data final
   * @returns Relatório de aderência do paciente
   */
  async getPatientAdherenceReport(
    pacienteUserId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<RelatorioAdesaoDto> {
    const response = await apiClient.get<RelatorioAdesaoDto>(
      `/api/DiarioAlimentar/relatorio-adesao/paciente/${pacienteUserId}`,
      {
        params: {
          dataInicio: format(dataInicio, 'yyyy-MM-dd'),
          dataFim: format(dataFim, 'yyyy-MM-dd'),
        },
      }
    );
    return response.data;
  },
};
