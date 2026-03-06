'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mealPlanService } from '@/services';
import { PlanoAlimentarResultadoDto } from '@/types/api';
import { TipoRefeicaoLabels } from '@/types/enums';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PlanoPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanoAlimentarResultadoDto[]>([]);
  const [activePlan, setActivePlan] = useState<PlanoAlimentarResultadoDto | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [all, active] = await Promise.all([
          mealPlanService.listPlans(),
          mealPlanService.getActivePlan().catch(() => null),
        ]);
        setPlans(all);
        setActivePlan(active);
        if (active) setExpanded(active.id);
      } catch {
        setError('FALHA AO CARREGAR PLANOS ALIMENTARES.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activate = async (id: number) => {
    try {
      await mealPlanService.activatePlan(id);
      const [all, active] = await Promise.all([
        mealPlanService.listPlans(),
        mealPlanService.getActivePlan().catch(() => null),
      ]);
      setPlans(all);
      setActivePlan(active);
    } catch {
      setError('FALHA AO ATIVAR PLANO.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px', flex: 1 }}>
          &gt;&gt; PLANOS ALIMENTARES
        </div>
        <button
          className="pip-btn pip-btn-filled"
          style={{ marginLeft: '12px', padding: '6px 14px', fontSize: '0.85rem', flexShrink: 0 }}
          onClick={() => router.push('/plano/criar')}
        >
          [+ NOVO]
        </button>
      </div>

      {error && <div className="pip-alert">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
          <div className="pip-spinner" />
          <span className="pip-cursor">CARREGANDO DADOS DE MISSÃƒO</span>
        </div>
      ) : plans.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px 0', opacity: 0.65 }}>
          <div>NENHUM PLANO ALIMENTAR REGISTRADO.</div>
          <button
            className="pip-btn"
            style={{ width: 'fit-content', padding: '8px 20px' }}
            onClick={() => router.push('/plano/criar')}
          >
            CRIAR PRIMEIRO PLANO &gt;
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {plans.map(plan => {
            const isActive = activePlan?.id === plan.id;
            const isOpen = expanded === plan.id;
            return (
              <div key={plan.id} className="pip-card" style={{ border: isActive ? '1px solid var(--pip-green)' : '1px solid var(--pip-dim)' }}>
                {/* CabeÃ§alho do plano */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : plan.id)}
                >
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    border: `1px solid ${isActive ? 'var(--pip-green)' : 'var(--pip-dim)'}`,
                    color: isActive ? 'var(--pip-green)' : 'var(--pip-dim)',
                    flexShrink: 0,
                  }}>
                    {isActive ? 'ATIVO' : 'INATIVO'}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                    {(plan.nome ?? 'PLANO ALIMENTAR').toUpperCase()}
                  </span>
                  <span style={{ opacity: 0.6, fontSize: '0.8rem', flexShrink: 0 }}>
                    {format(new Date(plan.criadoEm), 'dd/MM/yy', { locale: ptBR })}
                  </span>
                  <span style={{ opacity: 0.5, fontSize: '0.9rem', flexShrink: 0 }}>{isOpen ? 'â–²' : 'â–¼'}</span>
                </div>

                {/* Resumo rÃ¡pido */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.8rem', opacity: 0.7 }}>
                  <span>{plan.refeicoes.length} REFEIÃ‡Ã•ES</span>
                  <span>{plan.metasDiarias.caloriasKcal.toFixed(0)} KCAL/DIA</span>
                  <span>P:{plan.metasDiarias.proteinaG.toFixed(0)}G C:{plan.metasDiarias.carboidratoG.toFixed(0)}G G:{plan.metasDiarias.gorduraG.toFixed(0)}G</span>
                </div>

                {/* Detalhes expansÃ­veis */}
                {isOpen && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid rgba(0,179,0,0.2)', paddingTop: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {plan.refeicoes.map(refeicao => (
                        <div key={refeicao.id} className="pip-row" style={{ fontSize: '0.85rem' }}>
                          <span className="pip-row-label">
                            {(TipoRefeicaoLabels[refeicao.tipoRefeicao] ?? `REFEIÃ‡ÃƒO ${refeicao.ordem + 1}`).toUpperCase()}
                          </span>
                          <div className="pip-dots" />
                          <span className="pip-row-value">
                            {refeicao.totalEnergiaKcal.toFixed(0)} KCAL
                          </span>
                          <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '0.75rem' }}>
                            ({refeicao.itens.length} ITEM)
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      {!isActive && (
                        <button
                          className="pip-btn pip-btn-filled"
                          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                          onClick={() => activate(plan.id)}
                        >
                          [ATIVAR]
                        </button>
                      )}
                      <button
                        className="pip-btn"
                        style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                        onClick={() => router.push(`/plano/${plan.id}`)}
                      >
                        VER DETALHES &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
