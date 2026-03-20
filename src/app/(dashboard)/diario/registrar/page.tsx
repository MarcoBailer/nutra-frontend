'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { foodDiaryService, foodSearchService } from '@/services';
import { AlimentoResumoDto } from '@/types/api';
import { ETipoRefeicao, ETipoTabela, TipoRefeicaoLabels } from '@/types/enums';

function RegistrarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preId    = searchParams.get('alimento_id');
  const preTabela = searchParams.get('tabela');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AlimentoResumoDto[]>([]);
  const [searching, setSearching] = useState(false);

  const [selected, setSelected] = useState<AlimentoResumoDto | null>(null);
  const [grams, setGrams] = useState('100');
  const [tipoRefeicao, setTipoRefeicao] = useState<ETipoRefeicao>(ETipoRefeicao.Almoco);
  const [diaOpcao, setDiaOpcao] = useState<'hoje' | 'ontem' | 'outro'>('hoje');
  const [diaCustom, setDiaCustom] = useState(() => new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveDataConsumo = (): string => {
    if (diaOpcao === 'ontem') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString();
    }
    if (diaOpcao === 'outro') {
      return new Date(diaCustom + 'T12:00:00').toISOString();
    }
    return new Date().toISOString();
  };

  const handleSearch = useCallback(async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    setError(null);
    try {
      const res = await foodSearchService.searchAll(query.trim());
      console.log('Busca realizada:', { query, resultsCount: res.tbca.length + res.fabricantes.length + res.fastFood.length + res.genericos.length });
      setResults([...res.tbca, ...res.fabricantes, ...res.fastFood, ...res.genericos]);
    } catch {
      setError('FALHA NA BUSCA. TENTE NOVAMENTE.');
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleSubmit = async () => {
    if (!selected) { setError('SELECIONE UM ALIMENTO'); return; }
    const qty = parseFloat(grams);
    if (isNaN(qty) || qty <= 0) { setError('QUANTIDADE INVÁLIDA'); return; }

    setSubmitting(true);
    setError(null);
    try {
      await foodDiaryService.registerConsumption({
        alimentoId: selected.id,
        tipoTabela: selected.tipoTabela,
        quantidadeConsumidaG: qty,
        tipoRefeicao,
        dataConsumo: resolveDataConsumo(),
      });
      router.push('/diario');
    } catch {
      setError('FALHA AO REGISTRAR CONSUMO. VERIFIQUE OS DADOS.');
    } finally {
      setSubmitting(false);
    }
  };

  const porcaoBase = selected?.porcaoG && selected.porcaoG > 0 ? selected.porcaoG : 100;
  const kcalEstimado = selected ? ((selected.energiaKcal / porcaoBase) * parseFloat(grams || '0')).toFixed(0) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        &gt;&gt; REGISTRAR CONSUMO
      </div>

      {error && <div className="pip-alert">{error}</div>}

      {/* Step 1 – buscar */}
      {!selected && (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="pip-input"
              style={{ flex: 1 }}
              placeholder="BUSCAR ALIMENTO..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="pip-btn pip-btn-filled" onClick={handleSearch} disabled={searching}>
              {searching ? '...' : '[BUSCAR]'}
            </button>
          </div>

          {/* Pre-selected from query string (from busca page) */}
          {preId && preTabela && results.length === 0 && (
            <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              BUSQUE O ALIMENTO PARA CONTINUAR OU{' '}
              <button className="pip-btn" style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                onClick={() => router.push('/busca')}>
                VOLTAR À BUSCA
              </button>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '300px', overflowY: 'auto' }} className="pip-scroll">
              {results.map(item => (
                <div
                  key={`${item.tipoTabela}-${item.id}`}
                  className="pip-row"
                  style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => { setSelected(item); setResults([]); }}
                >
                  <span className="pip-row-label" style={{ flex: 1 }}>{item.nome.toUpperCase()}</span>
                  <div className="pip-dots" />
                  <span className="pip-row-value" style={{ fontSize: '0.8rem' }}>
                    {item.energiaKcal.toFixed(0)} KCAL/100G
                  </span>
                  <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '0.75rem' }}>
                    [{item.tipoTabela}]
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 2 – configurar quantidade */}
      {selected && (
        <>
          <div className="pip-card">
            <div className="pip-card-title">{selected.nome.toUpperCase()}</div>
            <div className="pip-row" style={{ marginTop: '6px' }}>
              <span className="pip-row-label">ENERGIA</span>
              <div className="pip-dots" />
              <span className="pip-row-value">{selected.energiaKcal.toFixed(0)} KCAL/100G</span>
            </div>
            <div className="pip-row">
              <span className="pip-row-label">PROTEÍNA</span>
              <div className="pip-dots" />
              <span className="pip-row-value">{selected.proteinaG.toFixed(1)}G</span>
            </div>
            <div className="pip-row">
              <span className="pip-row-label">CARBOIDRATO</span>
              <div className="pip-dots" />
              <span className="pip-row-value">{selected.carboidratoG.toFixed(1)}G</span>
            </div>
            <div className="pip-row">
              <span className="pip-row-label">GORDURA</span>
              <div className="pip-dots" />
              <span className="pip-row-value">{selected.gorduraG.toFixed(1)}G</span>
            </div>
          </div>

          <button
            onClick={() => { setSelected(null); setQuery(''); }}
            className="pip-btn"
            style={{ fontSize: '0.8rem', width: 'fit-content', padding: '4px 12px' }}
          >
            &lt; TROCAR ALIMENTO
          </button>

          {/* Quantidade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px', fontSize: '0.9rem' }}>QUANTIDADE:</span>
            <input
              className="pip-input"
              type="number"
              style={{ width: '100px' }}
              min="1"
              value={grams}
              onChange={e => setGrams(e.target.value)}
            />
            <span style={{ opacity: 0.7 }}>G</span>
            {kcalEstimado && (
              <span className="pip-glow-sm" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>
                ≈ {kcalEstimado} KCAL
              </span>
            )}
          </div>

          {/* Tipo de refeição */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px', fontSize: '0.9rem' }}>REFEIÇÃO:</span>
            <select
              className="pip-input"
              style={{ maxWidth: '200px' }}
              value={tipoRefeicao}
              onChange={e => setTipoRefeicao(Number(e.target.value) as ETipoRefeicao)}
            >
              {Object.entries(TipoRefeicaoLabels).map(([val, label]) => (
                <option key={val} value={val}>{label.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Data de consumo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ width: '100px', fontSize: '0.9rem' }}>DATA:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['hoje', 'ontem', 'outro'] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`pip-btn${diaOpcao === opt ? ' pip-btn-filled' : ''}`}
                  style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                  onClick={() => setDiaOpcao(opt)}
                >
                  {opt === 'hoje' ? 'HOJE' : opt === 'ontem' ? 'ONTEM' : 'OUTRO DIA'}
                </button>
              ))}
            </div>
            {diaOpcao === 'outro' && (
              <input
                type="date"
                className="pip-input"
                style={{ maxWidth: '160px' }}
                value={diaCustom}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setDiaCustom(e.target.value)}
              />
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              className="pip-btn pip-btn-filled"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: '8px 24px' }}
            >
              {submitting ? '...' : '[REGISTRAR]'}
            </button>
            <button className="pip-btn" onClick={() => router.push('/diario')} style={{ padding: '8px 16px' }}>
              CANCELAR
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function RegistrarPage() {
  return (
    <Suspense fallback={<div className="pip-cursor">CARREGANDO</div>}>
      <RegistrarContent />
    </Suspense>
  );
}
