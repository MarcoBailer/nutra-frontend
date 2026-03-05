/**
 * @fileoverview Serviço de Nutricionista.
 * 
 * Gerencia operações exclusivas para nutricionistas:
 * - Cadastro e perfil profissional
 * - Gerenciamento de clínicas
 * - Gestão de pacientes e vínculos
 * - Planos de assinatura
 * 
 * ENDPOINTS:
 * - POST /api/Nutricionista/cadastro
 * - GET /api/Nutricionista/perfil
 * - PUT /api/Nutricionista/perfil
 * - GET /api/Nutricionista/clinicas
 * - POST /api/Nutricionista/clinicas
 * - PUT /api/Nutricionista/clinicas/{id}
 * - DELETE /api/Nutricionista/clinicas/{id}
 * - GET /api/Nutricionista/pacientes
 * - POST /api/Nutricionista/pacientes/convite
 * - DELETE /api/Nutricionista/pacientes/vinculo/{id}
 * - PUT /api/Nutricionista/assinatura/{plano}
 * 
 * @see {@link ../../../nutra/Controllers/NutricionistaController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  CadastroNutricionistaDto,
  PerfilProfissionalDto,
  UpdatePerfilProfissionalDto,
  ClinicaDto,
  ClinicaResultadoDto,
  ConviteVinculoDto,
  PacienteResumoDto,
  RetornoPadrao,
} from '@/types/api';
import { EPlanoAssinatura } from '@/types/enums';

/**
 * Serviço de nutricionista.
 */
export const nutritionistService = {
  // =====================================================
  // CADASTRO E PERFIL
  // =====================================================

  /**
   * Cadastra um novo nutricionista.
   * Pode ser chamado sem autenticação (auto-cadastro).
   * 
   * @param data - Dados do cadastro
   * @returns Resultado da operação
   */
  async register(data: CadastroNutricionistaDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      '/api/Nutricionista/cadastro',
      data
    );
    return response.data;
  },

  /**
   * Obtém o perfil profissional do nutricionista logado.
   * 
   * @returns Perfil profissional completo
   */
  async getProfile(): Promise<PerfilProfissionalDto> {
    const response = await apiClient.get<PerfilProfissionalDto>(
      '/api/Nutricionista/perfil'
    );
    return response.data;
  },

  /**
   * Atualiza o perfil profissional.
   * 
   * @param data - Dados a atualizar
   * @returns Resultado da operação
   */
  async updateProfile(data: UpdatePerfilProfissionalDto): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>(
      '/api/Nutricionista/perfil',
      data
    );
    return response.data;
  },

  // =====================================================
  // CLÍNICAS
  // =====================================================

  /**
   * Lista clínicas ativas do nutricionista.
   * 
   * @returns Lista de clínicas
   */
  async listClinics(): Promise<ClinicaResultadoDto[]> {
    const response = await apiClient.get<ClinicaResultadoDto[]>(
      '/api/Nutricionista/clinicas'
    );
    return response.data;
  },

  /**
   * Cria uma nova clínica.
   * 
   * @param data - Dados da clínica
   * @returns Resultado da operação
   */
  async createClinic(data: ClinicaDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      '/api/Nutricionista/clinicas',
      data
    );
    return response.data;
  },

  /**
   * Atualiza uma clínica existente.
   * 
   * @param clinicaId - ID da clínica
   * @param data - Dados a atualizar
   * @returns Resultado da operação
   */
  async updateClinic(clinicaId: number, data: ClinicaDto): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>(
      `/api/Nutricionista/clinicas/${clinicaId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove uma clínica (soft delete).
   * 
   * @param clinicaId - ID da clínica
   * @returns Resultado da operação
   */
  async deleteClinic(clinicaId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/Nutricionista/clinicas/${clinicaId}`
    );
    return response.data;
  },

  // =====================================================
  // GESTÃO DE PACIENTES
  // =====================================================

  /**
   * Lista pacientes vinculados ao nutricionista.
   * 
   * @returns Lista de pacientes
   */
  async listPatients(): Promise<PacienteResumoDto[]> {
    const response = await apiClient.get<PacienteResumoDto[]>(
      '/api/Nutricionista/pacientes'
    );
    return response.data;
  },

  /**
   * Envia convite de vínculo para um paciente.
   * 
   * @param data - Dados do convite
   * @returns Resultado da operação
   */
  async sendInvite(data: ConviteVinculoDto): Promise<RetornoPadrao> {
    const response = await apiClient.post<RetornoPadrao>(
      '/api/Nutricionista/pacientes/convite',
      data
    );
    return response.data;
  },

  /**
   * Encerra vínculo com um paciente.
   * 
   * @param vinculoId - ID do vínculo
   * @returns Resultado da operação
   */
  async endBond(vinculoId: number): Promise<RetornoPadrao> {
    const response = await apiClient.delete<RetornoPadrao>(
      `/api/Nutricionista/pacientes/vinculo/${vinculoId}`
    );
    return response.data;
  },

  // =====================================================
  // ASSINATURA
  // =====================================================

  /**
   * Atualiza o plano de assinatura.
   * 
   * @param plano - Novo plano
   * @returns Resultado da operação
   */
  async updateSubscription(plano: EPlanoAssinatura): Promise<RetornoPadrao> {
    const response = await apiClient.put<RetornoPadrao>(
      `/api/Nutricionista/assinatura/${plano}`
    );
    return response.data;
  },
};
