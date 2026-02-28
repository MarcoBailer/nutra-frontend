/**
 * @fileoverview Serviço de Perfil Nutricional do Usuário.
 * 
 * Gerencia operações relacionadas ao perfil nutricional:
 * - Criar/atualizar perfil nutricional
 * - Gerenciar preferências alimentares
 * - Registros biométricos
 * - Histórico clínico
 * - Anamnese alimentar
 * 
 * ENDPOINTS:
 * - POST /api/User/perfil-nutricional
 * - PUT /api/User/perfil-nutricional
 * - GET /api/User/buscar-perfil-nutricional
 * - POST /api/User/preferencia-alimentar/{id}/{tabela}/{afinidade}
 * - DELETE /api/User/preferencia-alimentar/{preferenciaId}
 * - POST /api/User/registro-biometrico
 * - GET /api/User/historico-biometrico
 * - GET/POST/PUT/DELETE /api/User/historico-clinico
 * - GET/POST /api/User/anamnese-alimentar
 * 
 * @see {@link ../../../nutra/Controllers/UserController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  PerfilNutricionalDto,
  RetornoPadrao,
  RegistroBiometricoDto,
  HistoricoBiometricoDto,
  HistoricoClinicoDto,
  AnamneseAlimentarDto,
} from '@/types/api';
import { ETipoTabela, ETipoPreferencia } from '@/types/enums';

/**
 * Serviço de perfil nutricional do usuário.
 */
export const userProfileService = {
  // =====================================================
  // PERFIL NUTRICIONAL
  // =====================================================

  /**
   * Cria um novo perfil nutricional para o usuário.
   * Deve ser chamado apenas uma vez durante o onboarding.
   * 
   * @param data - Dados do perfil nutricional
   * @returns Perfil criado
   */
  async createProfile(data: PerfilNutricionalDto): Promise<RetornoPadrao<PerfilNutricionalDto>> {
    const response = await apiClient.post<RetornoPadrao<PerfilNutricionalDto>>(
      '/api/User/perfil-nutricional',
      data
    );
    return response.data;
  },

  /**
   * Atualiza o perfil nutricional existente.
   * 
   * @param data - Dados atualizados
   * @returns Resultado da operação
   */
  async updateProfile(data: PerfilNutricionalDto): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>('/api/User/perfil-nutricional', data);
    return response.data;
  },

  /**
   * Busca o perfil nutricional do usuário.
   * 
   * @returns Perfil nutricional ou null se não existir
   */
  async getProfile(): Promise<PerfilNutricionalDto | null> {
    try {
      const response = await apiClient.get<PerfilNutricionalDto>(
        '/api/User/buscar-perfil-nutricional'
      );
      return response.data;
    } catch {
      return null;
    }
  },

  // =====================================================
  // PREFERÊNCIAS ALIMENTARES
  // =====================================================

  /**
   * Adiciona uma preferência alimentar (gosta/não gosta de um alimento).
   * 
   * @param alimentoId - ID do alimento
   * @param tabela - Tabela do alimento (TBCA, Fabricante, etc.)
   * @param preferencia - Tipo de preferência (gosta, não gosta, alergia)
   * @returns Resultado da operação
   */
  async addFoodPreference(
    alimentoId: number,
    tabela: ETipoTabela,
    preferencia: ETipoPreferencia
  ): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      `/api/User/preferencia-alimentar/${alimentoId}/${tabela}/${preferencia}`
    );
    return response.data;
  },

  /**
   * Remove uma preferência alimentar.
   * 
   * @param preferenciaId - ID da preferência a remover
   * @returns Resultado da operação
   */
  async removeFoodPreference(preferenciaId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/User/preferencia-alimentar/${preferenciaId}`
    );
    return response.data;
  },

  // =====================================================
  // REGISTROS BIOMÉTRICOS
  // =====================================================

  /**
   * Registra dados biométricos (peso, medidas, etc.).
   * Usado para acompanhamento de progresso.
   * 
   * @param data - Dados biométricos
   * @returns Resultado da operação
   */
  async addBiometricRecord(data: RegistroBiometricoDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>('/api/User/registro-biometrico', data);
    return response.data;
  },

  /**
   * Lista o histórico de registros biométricos.
   * 
   * @returns Lista de registros ordenados por data
   */
  async getBiometricHistory(): Promise<HistoricoBiometricoDto[]> {
    const response = await apiClient.get<HistoricoBiometricoDto[]>(
      '/api/User/historico-biometrico'
    );
    return response.data;
  },

  // =====================================================
  // HISTÓRICO CLÍNICO
  // =====================================================

  /**
   * Lista o histórico clínico do usuário.
   * 
   * @returns Lista de condições clínicas
   */
  async getClinicalHistory(): Promise<HistoricoClinicoDto[]> {
    const response = await apiClient.get<HistoricoClinicoDto[]>('/api/User/historico-clinico');
    return response.data;
  },

  /**
   * Adiciona uma condição clínica ao histórico.
   * 
   * @param data - Dados da condição
   * @returns Resultado da operação
   */
  async addClinicalHistory(data: HistoricoClinicoDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>('/api/User/historico-clinico', data);
    return response.data;
  },

  /**
   * Atualiza uma condição clínica.
   * 
   * @param id - ID da condição
   * @param data - Dados atualizados
   * @returns Resultado da operação
   */
  async updateClinicalHistory(id: number, data: HistoricoClinicoDto): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>(`/api/User/historico-clinico/${id}`, data);
    return response.data;
  },

  /**
   * Remove uma condição clínica do histórico.
   * 
   * @param id - ID da condição
   * @returns Resultado da operação
   */
  async removeClinicalHistory(id: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(`/api/User/historico-clinico/${id}`);
    return response.data;
  },

  // =====================================================
  // ANAMNESE ALIMENTAR
  // =====================================================

  /**
   * Salva uma anamnese alimentar.
   * 
   * @param data - Dados da anamnese
   * @returns Resultado da operação
   */
  async saveAnamnesis(data: AnamneseAlimentarDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>('/api/User/anamnese-alimentar', data);
    return response.data;
  },

  /**
   * Obtém a última anamnese alimentar.
   * 
   * @returns Anamnese mais recente ou null se não existir
   */
  async getLatestAnamnesis(): Promise<AnamneseAlimentarDto | null> {
    try {
      const response = await apiClient.get<AnamneseAlimentarDto>(
        '/api/User/anamnese-alimentar/ultima'
      );
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Lista todas as anamneses do usuário.
   * 
   * @returns Lista de anamneses
   */
  async getAnamnesisHistory(): Promise<AnamneseAlimentarDto[]> {
    const response = await apiClient.get<AnamneseAlimentarDto[]>(
      '/api/User/anamnese-alimentar/historico'
    );
    return response.data;
  },
};
