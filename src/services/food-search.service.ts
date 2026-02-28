/**
 * @fileoverview Serviço de Busca de Alimentos.
 * 
 * Permite buscar alimentos em todas as tabelas disponíveis:
 * - TBCA (Tabela Brasileira de Composição de Alimentos)
 * - Fabricantes (alimentos industrializados)
 * - Fast Food (redes de fast food)
 * - Genéricos (alimentos personalizados)
 * 
 * ENDPOINTS:
 * - GET /api/Busca/BuscarTudo/{termo}
 * - GET /api/Busca/BuscarPorId/{id}/{tabela}
 * - GET /api/Alimentos/tbca/alimento/{nome}
 * - GET /api/Alimentos/fabricante/alimento/{nome}
 * - GET /api/Alimentos/fastfood/alimento/{nome}
 * 
 * @see {@link ../../../nutra/Controllers/BuscaController.cs}
 * @see {@link ../../../nutra/Controllers/AlimentosController.cs}
 */

import { apiClient } from '@/lib/api-client';
import {
  AlimentoResumoDto,
  BuscaAlimentosResponse,
  PaginatedResult,
} from '@/types/api';
import { ETipoTabela } from '@/types/enums';

/**
 * Serviço de busca de alimentos.
 */
export const foodSearchService = {
  /**
   * Busca alimentos em todas as tabelas disponíveis.
   * Requer pelo menos 3 caracteres.
   * 
   * @param termo - Termo de busca (mínimo 3 caracteres)
   * @returns Resultado agrupado por tabela
   */
  async searchAll(termo: string): Promise<BuscaAlimentosResponse> {
    if (termo.length < 3) {
      throw new Error('Digite pelo menos 3 caracteres para buscar.');
    }

    const response = await apiClient.get<BuscaAlimentosResponse>(
      `/api/Busca/BuscarTudo/${encodeURIComponent(termo)}`
    );
    return response.data;
  },

  /**
   * Busca um alimento específico por ID e tabela.
   * 
   * @param id - ID do alimento
   * @param tabela - Tabela de origem
   * @returns Dados do alimento ou null se não encontrado
   */
  async searchById(id: number, tabela: ETipoTabela): Promise<AlimentoResumoDto | null> {
    try {
      const response = await apiClient.get<AlimentoResumoDto>(
        `/api/Busca/BuscarPorId/${id}/${tabela}`
      );
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Busca alimentos na tabela TBCA com paginação.
   * 
   * @param nome - Nome do alimento
   * @param page - Número da página (1-indexed)
   * @param pageSize - Itens por página
   * @returns Resultado paginado
   */
  async searchTbca(
    nome: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<AlimentoResumoDto>> {
    const response = await apiClient.get<PaginatedResult<AlimentoResumoDto>>(
      `/api/Alimentos/tbca/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    return response.data;
  },

  /**
   * Busca alimentos de fabricantes com paginação.
   * 
   * @param nome - Nome do produto
   * @param page - Número da página (1-indexed)
   * @param pageSize - Itens por página
   * @returns Resultado paginado
   */
  async searchFabricantes(
    nome: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<AlimentoResumoDto>> {
    const response = await apiClient.get<PaginatedResult<AlimentoResumoDto>>(
      `/api/Alimentos/fabricante/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    return response.data;
  },

  /**
   * Busca alimentos de fast food com paginação.
   * 
   * @param nome - Nome do produto
   * @param page - Número da página (1-indexed)
   * @param pageSize - Itens por página
   * @returns Resultado paginado
   */
  async searchFastFood(
    nome: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<AlimentoResumoDto>> {
    const response = await apiClient.get<PaginatedResult<AlimentoResumoDto>>(
      `/api/Alimentos/fastfood/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    return response.data;
  },

  /**
   * Busca alimentos em uma tabela específica.
   * 
   * @param termo - Termo de busca
   * @param tabela - Tabela para buscar
   * @param page - Número da página
   * @param pageSize - Itens por página
   * @returns Array de alimentos encontrados
   */
  async search(
    termo: string,
    tabela: ETipoTabela,
    page: number = 1,
    pageSize: number = 10
  ): Promise<AlimentoResumoDto[]> {
    let result: PaginatedResult<AlimentoResumoDto>;

    switch (tabela) {
      case ETipoTabela.Tbca:
        result = await this.searchTbca(termo, page, pageSize);
        break;
      case ETipoTabela.Fabricante:
        result = await this.searchFabricantes(termo, page, pageSize);
        break;
      case ETipoTabela.FastFood:
        result = await this.searchFastFood(termo, page, pageSize);
        break;
      default:
        // Para genéricos, usar busca geral e filtrar
        const all = await this.searchAll(termo);
        return all.genericos;
    }

    return result.items;
  },
};
