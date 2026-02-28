/**
 * @fileoverview Página de busca de alimentos.
 * 
 * Permite buscar alimentos em diferentes tabelas:
 * - TBCA (Tabela Brasileira de Composição de Alimentos)
 * - Fabricantes
 * - Fast Food
 * 
 * Exibe informações nutricionais completas dos alimentos encontrados.
 */

'use client';

import { useState, useCallback } from 'react';
import { Search, ChevronDown, Plus, Info, X } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
  Skeleton,
} from '@/components/ui';
import { foodSearchService } from '@/services';
import { AlimentoResumoDto } from '@/types/api';
import { ETipoTabela, TipoTabelaLabels } from '@/types/enums';

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<ETipoTabela | 'all'>('all');
  const [results, setResults] = useState<AlimentoResumoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<AlimentoResumoDto | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let data: AlimentoResumoDto[];
      
      if (selectedTable === 'all') {
        // Busca em todas as tabelas e combina resultados
        const response = await foodSearchService.searchAll(searchTerm);
        data = [
          ...response.tbca,
          ...response.fabricantes,
          ...response.fastFood,
          ...response.genericos,
        ];
      } else {
        // Busca na tabela específica
        data = await foodSearchService.search(searchTerm, selectedTable);
      }

      setResults(data);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Não foi possível realizar a busca. Tente novamente.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedTable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getFoodTableBadge = (tabela: ETipoTabela) => {
    const colors: Record<ETipoTabela, string> = {
      [ETipoTabela.Tbca]: 'bg-emerald-100 text-emerald-700',
      [ETipoTabela.Fabricante]: 'bg-blue-100 text-blue-700',
      [ETipoTabela.FastFood]: 'bg-orange-100 text-orange-700',
      [ETipoTabela.Generico]: 'bg-slate-100 text-slate-700',
    };
    return colors[tabela] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Buscar Alimentos</h1>
        <p className="text-slate-500">
          Encontre informações nutricionais de milhares de alimentos
        </p>
      </div>

      {/* Barra de busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Input de busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite o nome do alimento..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de tabela */}
            <div className="relative">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value as ETipoTabela | 'all')}
                className="appearance-none w-full md:w-48 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white pr-10"
              >
                <option value="all">Todas as tabelas</option>
                {Object.entries(TipoTabelaLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Botão de busca */}
            <Button onClick={handleSearch} disabled={loading || searchTerm.length < 2}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hasSearched && results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum alimento encontrado
            </h3>
            <p className="text-slate-500">
              Tente buscar por outro termo ou selecione outra tabela.
            </p>
          </CardContent>
        </Card>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            {results.length} alimento(s) encontrado(s)
          </p>

          {results.map((food) => (
            <Card
              key={`${food.id}-${food.tipoTabela}`}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFood(food)}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {/* Ícone */}
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Search className="h-6 w-6 text-emerald-600" />
                  </div>

                  {/* Info do alimento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 truncate">
                        {food.nome}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getFoodTableBadge(
                          food.tipoTabela
                        )}`}
                      >
                        {TipoTabelaLabels[food.tipoTabela]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>
                        <strong>{food.energiaKcal.toFixed(0)}</strong> kcal
                      </span>
                      <span>
                        P: <strong>{food.proteinaG.toFixed(1)}g</strong>
                      </span>
                      <span>
                        C: <strong>{food.carboidratoG.toFixed(1)}g</strong>
                      </span>
                      <span>
                        G: <strong>{food.gorduraG.toFixed(1)}g</strong>
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFood(food);
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Abrir modal de adicionar ao diário
                        alert('Adicionar ao diário: ' + food.nome);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !hasSearched ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Comece sua busca
            </h3>
            <p className="text-slate-500">
              Digite pelo menos 2 caracteres para buscar alimentos.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Modal de detalhes do alimento */}
      {selectedFood && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedFood(null)}
        >
          <Card
            className="w-full max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{selectedFood.nome}</CardTitle>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full inline-block mt-2 ${getFoodTableBadge(
                    selectedFood.tipoTabela
                  )}`}
                >
                  {TipoTabelaLabels[selectedFood.tipoTabela]}
                </span>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">
                Valores por {selectedFood.porcaoG ?? 100}g
              </p>

              {/* Macros principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-700">
                    {selectedFood.energiaKcal.toFixed(0)}
                  </p>
                  <p className="text-sm text-emerald-600">Calorias (kcal)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedFood.proteinaG.toFixed(1)}g
                  </p>
                  <p className="text-sm text-blue-600">Proteína</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-700">
                    {selectedFood.carboidratoG.toFixed(1)}g
                  </p>
                  <p className="text-sm text-amber-600">Carboidratos</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-700">
                    {selectedFood.gorduraG.toFixed(1)}g
                  </p>
                  <p className="text-sm text-purple-600">Gorduras</p>
                </div>
              </div>

              {/* Outros nutrientes */}
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Outros nutrientes</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Fibra</span>
                    <span className="font-medium">{selectedFood.fibraG.toFixed(1)}g</span>
                  </div>
                  {selectedFood.marca && (
                    <div className="flex justify-between p-2 bg-slate-50 rounded col-span-2">
                      <span className="text-slate-600">Marca</span>
                      <span className="font-medium">{selectedFood.marca}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de adicionar */}
              <Button className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar ao Diário
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
