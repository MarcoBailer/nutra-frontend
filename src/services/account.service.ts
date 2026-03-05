/**
 * @fileoverview Serviço de Conta do Usuário.
 * 
 * Gerencia operações relacionadas à conta do usuário:
 * - Obter perfil do usuário autenticado
 * - Atualizar dados do perfil
 * - Desativar/reativar conta
 * 
 * ENDPOINTS:
 * - GET /api/Accounts/me - Perfil do usuário
 * - PUT /api/Accounts/update-profile - Atualizar perfil
 * - POST /api/Accounts/desativar - Desativar conta
 * - POST /api/Accounts/reativar - Reativar conta
 * 
 * @see {@link ../../../nutra/Controllers/AccountsController.cs}
 */

import { apiClient, createServerApiClient } from '@/lib/api-client';
import { NutraUser, UpdateProfileDto, RetornoPadrao, NutricionistaResumoDto } from '@/types/api';

/**
 * Serviço de contas do usuário.
 */
export const accountService = {
  /**
   * Obtém o perfil do usuário autenticado.
   * 
   * Se o usuário não existir no banco local da API Nutra,
   * será criado automaticamente com os dados do token.
   * 
   * @returns Dados do usuário
   */
  async getProfile(): Promise<NutraUser> {
    const response = await apiClient.get<NutraUser>('/api/Accounts/me');
    return response.data;
  },

  /**
   * Obtém o perfil do usuário (versão server-side).
   * 
   * @param token - Token de acesso JWT
   * @returns Dados do usuário
   */
  async getProfileServer(token: string): Promise<NutraUser> {
    const client = createServerApiClient(token);
    const response = await client.get<NutraUser>('/api/Accounts/me');
    return response.data;
  },

  /**
   * Atualiza os dados do perfil do usuário.
   * 
   * @param data - Dados a serem atualizados
   * @returns Resultado da operação
   */
  async updateProfile(data: UpdateProfileDto): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>('/api/Accounts/update-profile', data);
    return response.data;
  },

  /**
   * Desativa a conta do usuário (soft delete).
   * O usuário não poderá mais acessar o sistema até reativar.
   * 
   * @returns Resultado da operação
   */
  async deactivateAccount(): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>('/api/Accounts/desativar');
    return response.data;
  },

  /**
   * Reativa uma conta desativada.
   * 
   * @returns Resultado da operação
   */
  async reactivateAccount(): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>('/api/Accounts/reativar');
    return response.data;
  },

  /**
   * Responde a um convite de vínculo com nutricionista.
   * 
   * @param vinculoId - ID do vínculo
   * @param aceitar - true para aceitar, false para recusar
   * @returns Resultado da operação
   */
  async respondToInvite(vinculoId: number, aceitar: boolean): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      `/api/Accounts/vinculos/${vinculoId}/responder`,
      null,
      { params: { aceitar } }
    );
    return response.data;
  },

  /**
   * Lista nutricionistas vinculados ao paciente.
   * 
   * @returns Lista de nutricionistas
   */
  async listMyNutritionists(): Promise<NutricionistaResumoDto[]> {
    const response = await apiClient.get<NutricionistaResumoDto[]>(
      '/api/Accounts/meus-nutricionistas'
    );
    return response.data;
  },
};
