/**
 * @fileoverview Serviço de Plano Alimentar.
 * 
 * Gerencia planos alimentares:
 * - CRUD de planos
 * - Gerenciamento de refeições e itens
 * - Ativação/desativação de planos
 * - Substituições de alimentos
 * 
 * ENDPOINTS:
 * - POST /api/PlanoAlimentar
 * - GET /api/PlanoAlimentar/{planoId}
 * - GET /api/PlanoAlimentar/ativo
 * - GET /api/PlanoAlimentar
 * - PUT /api/PlanoAlimentar/{planoId}
 * - DELETE /api/PlanoAlimentar/{planoId}
 * - POST /api/PlanoAlimentar/{planoId}/ativar
 * - POST /api/PlanoAlimentar/{planoId}/refeicoes
 * - DELETE /api/PlanoAlimentar/refeicoes/{refeicaoId}
 * - POST /api/PlanoAlimentar/refeicoes/{refeicaoId}/itens
 * - DELETE /api/PlanoAlimentar/itens/{itemId}
 * 
 * @see {@link ../../../nutra/Controllers/PlanoAlimentarController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  CriarPlanoAlimentarDto,
  AtualizarPlanoAlimentarDto,
  PlanoAlimentarResultadoDto,
  AdicionarRefeicaoDto,
  AdicionarItemDto,
  RetornoPadrao,
} from '@/types/api';

/**
 * Serviço de plano alimentar.
 */
export const mealPlanService = {
  // =====================================================
  // CRUD DE PLANOS
  // =====================================================

  /**
   * Cria um novo plano alimentar.
   * 
   * @param data - Dados do plano
   * @returns Plano criado
   */
  async createPlan(data: CriarPlanoAlimentarDto): Promise<PlanoAlimentarResultadoDto> {
    const response = await apiClient.post<PlanoAlimentarResultadoDto>(
      '/api/PlanoAlimentar',
      data
    );
    return response.data;
  },

  /**
   * Obtém um plano específico por ID.
   * 
   * @param planoId - ID do plano
   * @returns Plano completo com refeições e itens
   */
  async getPlan(planoId: number): Promise<PlanoAlimentarResultadoDto> {
    const response = await apiClient.get<PlanoAlimentarResultadoDto>(
      `/api/PlanoAlimentar/${planoId}`
    );
    return response.data;
  },

  /**
   * Obtém o plano alimentar ativo do usuário.
   * 
   * @returns Plano ativo ou null se não houver
   */
  async getActivePlan(): Promise<PlanoAlimentarResultadoDto | null> {
    try {
      const response = await apiClient.get<PlanoAlimentarResultadoDto>(
        '/api/PlanoAlimentar/ativo'
      );
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Lista todos os planos do usuário.
   * 
   * @returns Lista de planos
   */
  async listPlans(): Promise<PlanoAlimentarResultadoDto[]> {
    const response = await apiClient.get<PlanoAlimentarResultadoDto[]>('/api/PlanoAlimentar');
    return response.data;
  },

  /**
   * Atualiza um plano existente.
   * 
   * @param planoId - ID do plano
   * @param data - Dados a atualizar
   * @returns Plano atualizado
   */
  async updatePlan(
    planoId: number,
    data: AtualizarPlanoAlimentarDto
  ): Promise<PlanoAlimentarResultadoDto> {
    const response = await apiClient.put<PlanoAlimentarResultadoDto>(
      `/api/PlanoAlimentar/${planoId}`,
      data
    );
    return response.data;
  },

  /**
   * Exclui um plano alimentar.
   * 
   * @param planoId - ID do plano
   * @returns Resultado da operação
   */
  async deletePlan(planoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(`/api/PlanoAlimentar/${planoId}`);
    return response.data;
  },

  /**
   * Ativa um plano (desativa o anterior automaticamente).
   * 
   * @param planoId - ID do plano a ativar
   * @returns Resultado da operação
   */
  async activatePlan(planoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(`/api/PlanoAlimentar/${planoId}/ativar`);
    return response.data;
  },

  // =====================================================
  // REFEIÇÕES
  // =====================================================

  /**
   * Adiciona uma refeição a um plano.
   * 
   * @param planoId - ID do plano
   * @param data - Dados da refeição
   * @returns Resultado da operação
   */
  async addMeal(planoId: number, data: AdicionarRefeicaoDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      `/api/PlanoAlimentar/${planoId}/refeicoes`,
      data
    );
    return response.data;
  },

  /**
   * Remove uma refeição de um plano.
   * 
   * @param refeicaoId - ID da refeição
   * @returns Resultado da operação
   */
  async removeMeal(refeicaoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/PlanoAlimentar/refeicoes/${refeicaoId}`
    );
    return response.data;
  },

  // =====================================================
  // ITENS DE REFEIÇÃO
  // =====================================================

  /**
   * Adiciona um item a uma refeição.
   * 
   * @param refeicaoId - ID da refeição
   * @param data - Dados do item
   * @returns Resultado da operação
   */
  async addItem(refeicaoId: number, data: AdicionarItemDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      `/api/PlanoAlimentar/refeicoes/${refeicaoId}/itens`,
      data
    );
    return response.data;
  },

  /**
   * Remove um item de uma refeição.
   * 
   * @param itemId - ID do item
   * @returns Resultado da operação
   */
  async removeItem(itemId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(`/api/PlanoAlimentar/itens/${itemId}`);
    return response.data;
  },
};
