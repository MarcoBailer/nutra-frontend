/**
 * @fileoverview Serviço de Refeição Rápida.
 * 
 * Endpoints simplificados para registro rápido de refeições.
 * Útil para registro direto sem complexidade do plano alimentar.
 * 
 * ENDPOINTS:
 * - POST /api/Refeicao/cadastrar-refeicao
 * - GET /api/Refeicao/status-diario
 * 
 * @see {@link ../../../nutra/Controllers/RefeicaoController.cs}
 */

import { apiClient } from '@/lib/api-client';
import { StatusDiarioDto, RetornoPadrao } from '@/types/api';
import { ETipoTabela, ETipoRefeicao } from '@/types/enums';

/**
 * Serviço de refeição rápida.
 */
export const quickMealService = {
  /**
   * Registra consumo de um alimento de forma rápida.
   * Endpoint simplificado para uso direto (ex: scanner de código de barras).
   * 
   * @param alimentoId - ID do alimento
   * @param tabela - Tabela do alimento
   * @param quantidadeG - Quantidade em gramas
   * @param refeicao - Tipo de refeição
   * @returns Resultado do registro
   */
  async registerConsumption(
    alimentoId: number,
    tabela: ETipoTabela,
    quantidadeG: number,
    refeicao: ETipoRefeicao
  ): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      '/api/Refeicao/cadastrar-refeicao',
      null,
      {
        params: {
          alimentoId,
          tabela,
          quantidadeIngeridaG: quantidadeG,
          nomeRefeicao: refeicao,
        },
      }
    );
    return response.data;
  },

  /**
   * Obtém o status nutricional do dia atual.
   * Resumo de calorias, macros, água e aderência.
   * 
   * @returns Status diário
   */
  async getDailyStatus(): Promise<StatusDiarioDto> {
    const response = await apiClient.get<StatusDiarioDto>('/api/Refeicao/status-diario');
    return response.data;
  },
};
