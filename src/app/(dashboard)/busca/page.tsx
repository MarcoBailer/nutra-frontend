'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { foodSearchService } from '@/services';
import { AlimentoResumoDto } from '@/types/api';
import { ETipoTabela, TipoTabelaLabels } from '@/types/enums';

const TabelaTag: Record<ETipoTabela, string> = {
  [ETipoTabela.Tbca]: 'TBCA',
  [ETipoTabela.Fabricante]: 'FAB',
  [ETipoTabela.FastFood]: 'FF',
  [ETipoTabela.Generico]: 'GEN',
};

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<ETipoTabela | 'all'>('all');
  const [results, setResults] = useState<AlimentoResumoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AlimentoResumoDto | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      let data: AlimentoResumoDto[];
      if (selectedTable === 'all') {
        const res = await foodSearchService.searchAll(searchTerm);
        data = [...res.tbca, ...res.fabricantes, ...res.fastFood, ...res.genericos];
      } else {
        data = await foodSearchService.search(searchTerm, selectedTable);
      }
      setResults(data);
    } catch {
      setError('FALHA NA BUSCA. VERIFIQUE A CONEXÃƒO.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedTable]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        &gt;&gt; INVENTÃRIO DE ALIMENTOS
      </div>

      {/* Barra de busca */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          className="pip-input"
          style={{ flex: 1, minWidth: '160px' }}
          placeholder="BUSCAR ITEM..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <select
          className="pip-input"
          style={{ width: '130px', flexShrink: 0 }}
          value={selectedTable}
          onChange={e => setSelectedTable(e.target.value as ETipoTabela | 'all')}
        >
          <option value="all">TODAS</option>
          {Object.entries(TipoTabelaLabels).map(([v, l]) => (
            <option key={v} value={v}>{l.toUpperCase()}</option>
          ))}
        </select>
        <button
          className="pip-btn pip-btn-filled"
          onClick={handleSearch}
          disabled={loading || searchTerm.length < 2}
        >
          {loading ? '...' : '[BUSCAR]'}
        </button>
      </div>

      {error && <div className="pip-alert">{error}</div>}

      {/* Resultados */}
      {loading ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
          <div className="pip-spinner" />
          <span className="pip-cursor">VARRENDO BANCO DE DADOS</span>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div style={{ opacity: 0.5, fontSize: '0.9rem', padding: '12px 0' }}>
          NENHUM ITEM ENCONTRADO: &quot;{searchTerm}&quot;
        </div>
      ) : results.length > 0 ? (
        <>
          <div style={{ opacity: 0.55, fontSize: '0.8rem' }}>
            {results.length} ITEM(S) ENCONTRADO(S)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {results.map(food => (
              <div
                key={`${food.tipoTabela}-${food.id}`}
                className="pip-row"
                style={{ cursor: 'pointer', flexWrap: 'wrap', gap: '4px' }}
                onClick={() => setDetail(detail?.id === food.id ? null : food)}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    border: '1px solid var(--pip-dim)',
                    padding: '1px 5px',
                    flexShrink: 0,
                    color: 'var(--pip-dim)',
                  }}
                >
                  {TabelaTag[food.tipoTabela]}
                </span>
                <span className="pip-row-label" style={{ flex: 1 }}>{food.nome.toUpperCase()}</span>
                <div className="pip-dots" style={{ flexShrink: 0 }} />
                <span className="pip-row-value" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {food.energiaKcal.toFixed(0)} KCAL
                </span>
                <Link
                  href={`/diario/registrar?alimento_id=${food.id}&tabela=${food.tipoTabela}`}
                  className="pip-btn"
                  style={{ marginLeft: '6px', padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  [+]
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : !hasSearched ? (
        <div style={{ opacity: 0.45, fontSize: '0.9rem', padding: '12px 0' }}>
          AGUARDANDO INPUT...
          <br />
          <span style={{ fontSize: '0.8rem' }}>MÃNIMO 2 CARACTERES PARA BUSCA.</span>
        </div>
      ) : null}

      {/* Detalhe inline */}
      {detail && (
        <div className="pip-card" style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="pip-card-title">{detail.nome.toUpperCase()}</div>
            <button
              className="pip-btn"
              style={{ padding: '2px 8px', fontSize: '0.8rem' }}
              onClick={() => setDetail(null)}
            >
              [X]
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.8rem', opacity: 0.6 }}>VALORES POR 100G:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '6px' }}>
            {[
              { l: 'KCAL', v: detail.energiaKcal.toFixed(0) },
              { l: 'PROT', v: `${detail.proteinaG.toFixed(1)}G` },
              { l: 'CARB', v: `${detail.carboidratoG.toFixed(1)}G` },
              { l: 'GORD', v: `${detail.gorduraG.toFixed(1)}G` },
            ].map(({ l, v }) => (
              <div key={l} className="pip-macro-item" style={{ flexDirection: 'column', gap: '2px', padding: '6px' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{l}</span>
                <span style={{ fontSize: '0.9rem' }}>{v}</span>
              </div>
            ))}
          </div>
          {detail.marca && (
            <div style={{ marginTop: '6px', fontSize: '0.8rem', opacity: 0.6 }}>
              MARCA: {detail.marca.toUpperCase()}
            </div>
          )}
          <Link
            href={`/diario/registrar?alimento_id=${detail.id}&tabela=${detail.tipoTabela}`}
            className="pip-btn pip-btn-filled"
            style={{ display: 'inline-block', marginTop: '10px', padding: '6px 18px', fontSize: '0.85rem' }}
          >
            [+ ADICIONAR AO DIÃRIO]
          </Link>
        </div>
      )}
    </div>
  );
}
