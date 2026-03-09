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
    const response = await apiClient.get<any>('/api/Refeicao/status-diario');
    const data = response.data;
    
    // Mapear propriedades da API para o formato esperado pelo frontend
    return {
      data: data.data,
      caloriasConsumidas: data.caloriasConsumidas ?? 0,
      caloriasAlvo: data.caloriasMeta ?? 0,
      proteinaConsumidaG: data.proteinasConsumidas ?? 0,
      proteinaAlvoG: data.proteinasMeta ?? 0,
      carboidratoConsumidoG: data.carboidratosConsumidos ?? 0,
      carboidratoAlvoG: data.carboidratosMeta ?? 0,
      gorduraConsumidaG: data.gordurasConsumidas ?? 0,
      gorduraAlvoG: data.gordurasMeta ?? 0,
      fibraConsumidaG: data.fibrasConsumidas ?? 0,
      fibraAlvoG: data.fibrasMeta ?? 0,
      aguaConsumidaL: data.aguaConsumida ?? 0,
      aguaAlvoL: data.aguaMeta ?? 0,
      percentualAderencia: data.percentualAderencia ?? 0,
      refeicoesRegistradas: data.refeicoesRegistradas ?? 0,
      refeicoesPlaneadas: data.refeicoesPlaneadas ?? 0,
    };
  },
};
