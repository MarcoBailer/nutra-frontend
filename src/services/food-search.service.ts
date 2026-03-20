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
 * Mapeia a propriedade 'fonte' retornada pela API para o enum ETipoTabela.
 * 
 * @param fonte - Nome da fonte/tabela retornado pela API
 * @returns Enum correspondente
 */
function mapFonteToTabela(fonte: string): ETipoTabela {
  // Normaliza: lowercase + remove acentos (ex: "Genéricos" → "genericos")
  const normalized = fonte?.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '');
  switch (normalized) {
    case 'tbca': return ETipoTabela.Tbca;
    case 'fabricantes':
    case 'fabricante': return ETipoTabela.Fabricante;
    case 'fastfood':
    case 'fastfoods': return ETipoTabela.FastFood;
    case 'generico':
    case 'genericos': return ETipoTabela.Generico;
    default:
      console.warn(`[mapFonteToTabela] Fonte desconhecida: "${fonte}" (normalizado: "${normalized}") → Tbca (fallback)`);
      return ETipoTabela.Tbca;
  }
}

/**
 * Mapeia um item da API para AlimentoResumoDto.
 * Suporta diferentes formatos retornados por endpoints específicos.
 * 
 * @param item - Item retornado pela API
 * @param tipoTabela - Tipo da tabela de origem
 * @returns AlimentoResumoDto padronizado
 */
function mapToAlimentoResumo(item: any, tipoTabela: ETipoTabela): AlimentoResumoDto {
  // Fabricantes, FastFood, Genericos usam "Produto" ao invés de "Nome"
  const nome = item.nome || item.produto || item.Nome || item.Produto || 'Sem nome';
  
  // Diferentes fontes têm diferentes estruturas de macronutrientes
  const energiaKcal = item.energiaKcal || item.EnergiaKcal || 0;
  const proteinaG = item.proteinas || item.Proteinas || item.proteina || 0;
  const carboidratoG = item.carboidratos || item.Carboidratos || item.carboidrato || 0;
  const gorduraG = item.gorduras || item.Gorduras || item.gordura || 0;
  const fibraG = item.fibras || item.Fibras || item.fibra || 0;
  const porcaoG = item.porcao || item.Porcao || item.porcaoReferencia || 100;
  const marca = item.marca || item.marcaFabricante || undefined;

  return {
    id: item.id || item.Id,
    nome,
    tipoTabela,
    energiaKcal,
    proteinaG,
    carboidratoG,
    gorduraG,
    fibraG,
    porcaoG,
    marca,
  };
}

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

    const response = await apiClient.get<any[]>(
      `/api/Busca/BuscarTudo/${encodeURIComponent(termo)}`
    );
    console.log(`Busca geral para termo "${termo}" retornou:`, response.data);
    
    // API retorna array direto - mapear para AlimentoResumoDto e agrupar por fonte
    const items = response.data.map((item: any) => {
      const tipoTabela = mapFonteToTabela(item.fonte);
      console.log(`[searchAll] id=${item.id} nome="${item.nome}" fonte="${item.fonte}" → tipoTabela=${tipoTabela}`);
      const resumo: AlimentoResumoDto = {
        id: item.id,
        nome: item.nome,
        tipoTabela,
        energiaKcal: item.macros?.energiaKcal ?? 0,
        proteinaG: item.macros?.proteina ?? 0,
        carboidratoG: item.macros?.carboDisponivel ?? item.macros?.carboTotal ?? 0,
        gorduraG: item.gorduras?.totais ?? item.macros?.lipidiosG ?? 0,
        fibraG: item.macros?.fibras ?? 0,
        porcaoG: item.porcaoReferencia,
        marca: item.marcaFabricante || undefined,
      };
      return resumo;
    });

    // Agrupar por fonte
    const grouped: BuscaAlimentosResponse = {
      tbca: items.filter((i: AlimentoResumoDto) => i.tipoTabela === ETipoTabela.Tbca),
      fabricantes: items.filter((i: AlimentoResumoDto) => i.tipoTabela === ETipoTabela.Fabricante),
      fastFood: items.filter((i: AlimentoResumoDto) => i.tipoTabela === ETipoTabela.FastFood),
      genericos: items.filter((i: AlimentoResumoDto) => i.tipoTabela === ETipoTabela.Generico),
      totalResultados: items.length,
    };

    return grouped;
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
    const response = await apiClient.get<PaginatedResult<any>>(
      `/api/Alimentos/tbca/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    const data = response.data;
    return {
      ...data,
      items: data.items.map((item: any) => mapToAlimentoResumo(item, ETipoTabela.Tbca)),
    };
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
    const response = await apiClient.get<PaginatedResult<any>>(
      `/api/Alimentos/fabricante/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    const data = response.data;
    return {
      ...data,
      items: data.items.map((item: any) => mapToAlimentoResumo(item, ETipoTabela.Fabricante)),
    };
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
    const response = await apiClient.get<PaginatedResult<any>>(
      `/api/Alimentos/fastfood/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    const data = response.data;
    return {
      ...data,
      items: data.items.map((item: any) => mapToAlimentoResumo(item, ETipoTabela.FastFood)),
    };
  },

  /**
   * Busca alimentos genéricos com paginação.
   * 
   * @param nome - Nome do produto
   * @param page - Número da página (1-indexed)
   * @param pageSize - Itens por página
   * @returns Resultado paginado
   */
  async searchGenericos(
    nome: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<AlimentoResumoDto>> {
    const response = await apiClient.get<PaginatedResult<any>>(
      `/api/Alimentos/genericos/alimento/${encodeURIComponent(nome)}`,
      { params: { pageNumber: page, pageSize } }
    );
    const data = response.data;
    return {
      ...data,
      items: data.items.map((item: any) => mapToAlimentoResumo(item, ETipoTabela.Generico)),
    };
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
      case ETipoTabela.Generico:
        result = await this.searchGenericos(termo, page, pageSize);
        break;
      default:
        // Fallback: usar busca geral e filtrar
        const all = await this.searchAll(termo);
        return all.genericos;
    }
    return result.items;
  },
};
