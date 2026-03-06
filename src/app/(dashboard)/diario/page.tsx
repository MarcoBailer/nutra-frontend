/**
 * @fileoverview PÃ¡gina do diÃ¡rio alimentar.
 * 
 * Exibe o consumo diÃ¡rio do usuÃ¡rio:
 * - Resumo do dia (calorias, macros)
 * - Lista de refeiÃ§Ãµes consumidas
 * - OpÃ§Ãµes para editar/remover itens
 * - NavegaÃ§Ã£o entre dias
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { foodDiaryService } from '@/services';
import { DiarioDiaDto, RegistroConsumoResultadoDto } from '@/types/api';
import { TipoRefeicaoLabels, ETipoRefeicao } from '@/types/enums';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DietaSubTab = 'ALIMENTAÃ‡ÃƒO' | 'HIDRATAÃ‡ÃƒO';

export default function DiarioPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryData, setDiaryData] = useState<DiarioDiaDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<DietaSubTab>('ALIMENTAÃ‡ÃƒO');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadDiary() {
      setLoading(true);
      setError(null);
      try {
        const data = await foodDiaryService.getDailyDiary(selectedDate);
        setDiaryData(data);
      } catch {
        setError('FALHA AO CARREGAR REGISTROS DO DIA');
        setDiaryData(null);
      } finally {
        setLoading(false);
      }
    }
    loadDiary();
  }, [selectedDate]);

  const isToday = isSameDay(selectedDate, new Date());
  const metas  = diaryData?.metasDoDia ?? { caloriasKcal: 2000, proteinaG: 150, carboidratoG: 250, gorduraG: 65, fibraG: 25, aguaL: 3 };
  const totais = diaryData?.totalConsumido ?? { caloriasKcal: 0, proteinaG: 0, carboidratoG: 0, gorduraG: 0, fibraG: 0, aguaL: 0 };
  const refeicoes = diaryData?.refeicoes ?? [];

  // Flatten all food records for easy listing
  const todosRegistros: (RegistroConsumoResultadoDto & { tipoRefeicao: ETipoRefeicao })[] = refeicoes.flatMap(r =>
    r.registros.map(reg => ({ ...reg, tipoRefeicao: r.tipoRefeicao }))
  );

  const kcalPct  = Math.min((totais.caloriasKcal / metas.caloriasKcal) * 100, 100);
  const aguaPct  = Math.min((totais.aguaL / metas.aguaL) * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>

      {/* Sub-tabs + date nav */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="pip-sub-tabs" style={{ marginBottom: 0, borderBottom: 'none', flex: 1 }}>
          {(['ALIMENTAÃ‡ÃƒO', 'HIDRATAÃ‡ÃƒO'] as DietaSubTab[]).map(t => (
            <div
              key={t}
              className={`pip-sub-tab ${subTab === t ? 'pip-sub-tab-active' : ''}`}
              onClick={() => setSubTab(t)}
            >
              {subTab === t ? `> ${t}` : t}
            </div>
          ))}
        </div>

        {/* Date navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button className="pip-btn" style={{ padding: '4px 10px' }} onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
            &lt;
          </button>
          <span className="pip-glow-sm" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {isToday ? 'HOJE' : format(selectedDate, "dd/MM/yyyy", { locale: ptBR }).toUpperCase()}
          </span>
          <button
            className="pip-btn"
            style={{ padding: '4px 10px' }}
            disabled={isToday}
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            &gt;
          </button>
        </div>

        <Link href="/diario/registrar" className="pip-btn pip-btn-filled" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
          [+ ADD]
        </Link>
      </div>

      <div style={{ borderBottom: '1px solid rgba(0,179,0,0.4)', marginBottom: '4px' }} />

      {/* Error */}
      {error && <div className="pip-alert">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
          <div className="pip-spinner" />
          <span className="pip-cursor">CARREGANDO REGISTROS</span>
        </div>
      ) : subTab === 'ALIMENTAÃ‡ÃƒO' ? (
        /* â”€â”€ ALIMENTAÃ‡ÃƒO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>

          {/* Resumo rÃ¡pido */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '180px' }}>
              <span style={{ fontSize: '0.85rem', flexShrink: 0, width: '85px' }}>HP KCAL</span>
              <div className="pip-bar" style={{ height: '16px' }}>
                <div className="pip-bar-fill" style={{ width: mounted ? `${kcalPct}%` : '0%' }} />
              </div>
              <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>
                {totais.caloriasKcal.toFixed(0)}/{metas.caloriasKcal.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Macros grid */}
          <div className="pip-macro-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { l: 'PROT', v: totais.proteinaG, m: metas.proteinaG },
              { l: 'CARB', v: totais.carboidratoG, m: metas.carboidratoG },
              { l: 'GORD', v: totais.gorduraG, m: metas.gorduraG },
              { l: 'FIBRA', v: totais.fibraG, m: metas.fibraG },
            ].map(({ l, v, m }) => (
              <div key={l} className="pip-macro-item" style={{ flexDirection: 'column', gap: '2px' }}>
                <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{l}</span>
                <span>{v.toFixed(0)}g</span>
                <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>/ {m.toFixed(0)}g</span>
              </div>
            ))}
          </div>

          {/* Registro por refeiÃ§Ã£o */}
          <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
            &gt;&gt; SUPRIMENTOS CONSUMIDOS
          </div>

          {todosRegistros.length === 0 ? (
            <div style={{ opacity: 0.45, fontSize: '0.9rem', padding: '10px 0' }}>
              NENHUM REGISTRO ENCONTRADO PARA ESTE DIA...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {refeicoes.map(refeicao => (
                refeicao.registros.length > 0 && (
                  <div key={refeicao.tipoRefeicao}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.55, marginTop: '8px', marginBottom: '4px', borderLeft: '2px solid var(--pip-dim)', paddingLeft: '6px' }}>
                      {TipoRefeicaoLabels[refeicao.tipoRefeicao].toUpperCase()}
                      <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                        ({refeicao.consumido.energiaKcal.toFixed(0)} KCAL)
                      </span>
                    </div>
                    {refeicao.registros.map(reg => (
                      <div key={reg.id} className="pip-row" style={{ fontSize: '0.9rem' }}>
                        <span className="pip-row-label" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {reg.nomeAlimento.toUpperCase()}
                        </span>
                        <div className="pip-dots" />
                        <span className="pip-row-value" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {reg.quantidadeConsumidaG}G â€” {reg.energiaKcal.toFixed(0)} KCAL
                        </span>
                        <button
                          onClick={async () => {
                            try { await foodDiaryService.deleteConsumption(reg.id); } catch {}
                            const updated = await foodDiaryService.getDailyDiary(selectedDate).catch(() => null);
                            setDiaryData(updated);
                          }}
                          className="pip-btn pip-btn-danger"
                          style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '0.75rem' }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        /* â”€â”€ HIDRATAÃ‡ÃƒO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
            &gt;&gt; REGISTRO DE HIDRATAÃ‡ÃƒO (H2O)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--pip-amber)', width: '80px', fontSize: '0.9rem' }}>AP (H2O)</span>
            <div className="pip-bar" style={{ height: '18px' }}>
              <div className="pip-bar-fill-amber" style={{ width: mounted ? `${aguaPct}%` : '0%' }} />
            </div>
            <span style={{ color: 'var(--pip-amber)', fontSize: '0.85rem', flexShrink: 0 }}>
              {totais.aguaL.toFixed(1)}L / {metas.aguaL.toFixed(1)}L
            </span>
          </div>

          <div style={{ opacity: 0.5, fontSize: '0.85rem', marginTop: '10px' }}>
            REGISTRO DE ÃGUA DISPONÃVEL NO MÃ“DULO RÃPIDO.
          </div>
          <Link href="/diario/registrar" className="pip-btn" style={{ fontSize: '0.85rem', width: 'fit-content', padding: '8px 20px' }}>
            REGISTRAR CONSUMO &gt;
          </Link>
        </div>
      )}
    </div>
  );
}
