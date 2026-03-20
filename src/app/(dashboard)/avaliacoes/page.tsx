'use client';

import { useState, useEffect } from 'react';
import { nutritionalAssessmentService } from '@/services';
import { AvaliacaoResultadoDto } from '@/types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AvaliacoesPage() {
  const [assessments, setAssessments] = useState<AvaliacaoResultadoDto[]>([]);
  const [latest, setLatest] = useState<AvaliacaoResultadoDto | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await nutritionalAssessmentService.listAssessments().catch(() => [] as AvaliacaoResultadoDto[]);
        const last = list.length > 0 ? list[0] : null;
        setAssessments(list);
        setLatest(last);
        if (last) setExpanded(last.id);
      } catch {
        setError('FALHA AO CARREGAR AVALIAÇÕES CORPORAIS.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        <div className="pip-glow" style={{ fontSize: '1.1rem' }}>
          &gt;&gt; ANÁLISE CORPORAL
        </div>
        <a
          href="/avaliacoes/nova"
          className="pip-btn pip-btn-filled"
          style={{ padding: '5px 14px', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          [+ NOVA]
        </a>
      </div>

      {error && <div className="pip-alert">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
          <div className="pip-spinner" />
          <span className="pip-cursor">CARREGANDO DADOS BIOMÉTRICOS</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Vault Boy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Strong.gif" alt="vault boy" className="pip-vault-boy pip-vault-boy-md" />
            {latest && (
              <div style={{ fontSize: '0.75rem', textAlign: 'center', opacity: 0.7 }}>
                <div>{latest.pesoKg?.toFixed(1) ?? '-'} KG</div>
                <div>IMC {latest.imc?.toFixed(1) ?? '-'}</div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            {latest ? (
              <>
                <div className="pip-glow" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                  // ÚLTIMA AVALIAÇÃO — {format(new Date(latest.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR }).toUpperCase()}
                </div>
                {[
                  { l: 'PESO', v: latest.pesoKg ? `${latest.pesoKg.toFixed(1)} KG` : '-' },
                  { l: 'IMC', v: latest.imc ? latest.imc.toFixed(2) : '-' },
                  { l: '% GORDURA', v: latest.percentualGordura ? `${latest.percentualGordura.toFixed(1)}%` : '-' },
                  { l: 'MASSA MAGRA', v: latest.massaMagraKg ? `${latest.massaMagraKg.toFixed(1)} KG` : '-' },
                  { l: 'MASSA GORDA', v: latest.massaGordaKg ? `${latest.massaGordaKg.toFixed(1)} KG` : '-' },
                  { l: 'RCQ', v: latest.rcq ? latest.rcq.toFixed(2) : '-' },
                ].map(({ l, v }) => (
                  <div key={l} className="pip-row" style={{ fontSize: '0.9rem' }}>
                    <span className="pip-row-label">{l}</span>
                    <div className="pip-dots" />
                    <span className="pip-row-value">{v}</span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>
                NENHUMA AVALIAÇÃO REGISTRADA.
                <br /><br />
                <a href="/avaliacoes/nova" className="pip-btn" style={{ padding: '8px 20px', textDecoration: 'none', display: 'inline-block' }}>
                  INICIAR AVALIAÇÃO &gt;
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Histórico */}
      {assessments.length > 1 && (
        <div style={{ marginTop: '8px' }}>
          <div className="pip-glow" style={{ fontSize: '0.9rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '4px', marginBottom: '8px' }}>
            // HISTÓRICO ({assessments.length} AVALIAÇÕES)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {assessments.map((av, i) => {
              const isOpen = expanded === av.id;
              return (
                <div key={av.id} className="pip-card" style={{ padding: '8px 12px' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => setExpanded(isOpen ? null : av.id)}
                  >
                    <span style={{ opacity: 0.5, fontSize: '0.8rem', flexShrink: 0 }}>#{assessments.length - i}</span>
                    <span style={{ flex: 1 }}>
                      {format(new Date(av.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR }).toUpperCase()}
                    </span>
                    {av.pesoKg && <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>{av.pesoKg.toFixed(1)} KG</span>}
                    {av.imc && <span style={{ opacity: 0.6, fontSize: '0.8rem', marginLeft: '8px' }}>IMC {av.imc.toFixed(1)}</span>}
                    <span style={{ opacity: 0.4 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid rgba(0,179,0,0.2)', paddingTop: '6px' }}>
                      {[
                        { l: '% GORDURA', v: av.percentualGordura ? `${av.percentualGordura.toFixed(1)}%` : '-' },
                        { l: 'MASSA MAGRA', v: av.massaMagraKg ? `${av.massaMagraKg.toFixed(1)} KG` : '-' },
                      ].map(({ l, v }) => (
                        <div key={l} className="pip-row" style={{ fontSize: '0.85rem' }}>
                          <span className="pip-row-label">{l}</span>
                          <div className="pip-dots" />
                          <span className="pip-row-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
