/**
 * @fileoverview Serviço de Avaliação Nutricional.
 * 
 * Gerencia avaliações antropométricas:
 * - Registrar novas avaliações
 * - Listar histórico de avaliações
 * - Comparar evolução entre avaliações
 * - Cálculos automáticos (IMC, TMB, GET, %gordura, etc.)
 * 
 * ENDPOINTS:
 * - POST /api/AvaliacaoNutricional/registrar
 * - GET /api/AvaliacaoNutricional/{avaliacaoId}
 * - GET /api/AvaliacaoNutricional/minhas-avaliacoes
 * - GET /api/AvaliacaoNutricional/comparar/{anteriorId}/{atualId}
 * - DELETE /api/AvaliacaoNutricional/{avaliacaoId}
 * 
 * @see {@link ../../../nutra/Controllers/AvaliacaoNutricionalController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  AvaliacaoAntropometricaDto,
  AvaliacaoResultadoDto,
  ComparacaoAvaliacoesDto,
  FotoProgressoDto,
  RetornoPadrao,
} from '@/types/api';

/**
 * Serviço de avaliação nutricional.
 */
export const nutritionalAssessmentService = {
  /**
   * Registra uma nova avaliação antropométrica.
   * 
   * Os seguintes cálculos são feitos automaticamente pelo backend:
   * - IMC (Índice de Massa Corporal)
   * - RCQ (Relação Cintura-Quadril)
   * - TMB com 3 fórmulas (Harris-Benedict, Mifflin-St Jeor, Katch-McArdle)
   * - GET (Gasto Energético Total)
   * - % de Gordura Corporal (se dobras cutâneas informadas)
   * - Peso Ideal
   * - Macros sugeridos
   * 
   * @param data - Dados da avaliação
   * @returns Resultado completo com todos os cálculos
   */
  async registerAssessment(
    data: AvaliacaoAntropometricaDto
  ): Promise<AvaliacaoResultadoDto> {
    const response = await apiClient.post<AvaliacaoResultadoDto>(
      '/api/AvaliacaoNutricional/registrar',
      data
    );
    return response.data;
  },

  /**
   * Obtém uma avaliação específica por ID.
   * 
   * @param avaliacaoId - ID da avaliação
   * @returns Avaliação completa
   */
  async getAssessment(avaliacaoId: number): Promise<AvaliacaoResultadoDto> {
    const response = await apiClient.get<AvaliacaoResultadoDto>(
      `/api/AvaliacaoNutricional/${avaliacaoId}`
    );
    return response.data;
  },

  /**
   * Lista todas as avaliações do usuário.
   * Ordenadas por data (mais recente primeiro).
   * 
   * @returns Lista de avaliações
   */
  async listAssessments(): Promise<AvaliacaoResultadoDto[]> {
    const response = await apiClient.get<AvaliacaoResultadoDto[]>(
      '/api/AvaliacaoNutricional/minhas-avaliacoes'
    );
    return response.data;
  },

  /**
   * Compara duas avaliações e retorna a evolução.
   * Útil para mostrar progresso ao paciente.
   * 
   * @param anteriorId - ID da avaliação anterior
   * @param atualId - ID da avaliação atual
   * @returns Comparação entre as avaliações
   */
  async compareAssessments(
    anteriorId: number,
    atualId: number
  ): Promise<ComparacaoAvaliacoesDto> {
    const response = await apiClient.get<ComparacaoAvaliacoesDto>(
      `/api/AvaliacaoNutricional/comparar/${anteriorId}/${atualId}`
    );
    return response.data;
  },

  /**
   * Exclui uma avaliação.
   * 
   * @param avaliacaoId - ID da avaliação
   * @returns Resultado da operação
   */
  async deleteAssessment(avaliacaoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/AvaliacaoNutricional/${avaliacaoId}`
    );
    return response.data;
  },

  // =====================================================
  // MÉTODOS PARA PROFISSIONAIS
  // =====================================================

  /**
   * Nutricionista registra avaliação de um paciente vinculado.
   * 
   * @param pacienteUserId - ID do paciente
   * @param data - Dados da avaliação
   * @returns Resultado completo com todos os cálculos
   */
  async registerAssessmentForPatient(
    pacienteUserId: string,
    data: AvaliacaoAntropometricaDto
  ): Promise<AvaliacaoResultadoDto> {
    const response = await apiClient.post<AvaliacaoResultadoDto>(
      `/api/AvaliacaoNutricional/paciente/${pacienteUserId}/registrar`,
      data
    );
    return response.data;
  },

  /**
   * Nutricionista lista avaliações de um paciente vinculado.
   * 
   * @param pacienteUserId - ID do paciente
   * @returns Lista de avaliações do paciente
   */
  async listPatientAssessments(
    pacienteUserId: string
  ): Promise<AvaliacaoResultadoDto[]> {
    const response = await apiClient.get<AvaliacaoResultadoDto[]>(
      `/api/AvaliacaoNutricional/paciente/${pacienteUserId}/avaliacoes`
    );
    return response.data;
  },

  // =====================================================
  // FOTOS DE PROGRESSO
  // =====================================================

  /**
   * Adiciona fotos de progresso a uma avaliação existente.
   * 
   * @param avaliacaoId - ID da avaliação
   * @param fotos - Lista de fotos
   * @returns Resultado da operação
   */
  async addProgressPhotos(
    avaliacaoId: number,
    fotos: FotoProgressoDto[]
  ): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      `/api/AvaliacaoNutricional/${avaliacaoId}/fotos`,
      fotos
    );
    return response.data;
  },

  /**
   * Remove uma foto de progresso.
   * 
   * @param fotoId - ID da foto
   * @returns Resultado da operação
   */
  async removeProgressPhoto(fotoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/AvaliacaoNutricional/fotos/${fotoId}`
    );
    return response.data;
  },
};
