'use client';

import { useState, useEffect } from 'react';
import { nutritionalAssessmentService, foodDiaryService } from '@/services';
import { AvaliacaoResultadoDto, RelatorioAdesaoDto } from '@/types/api';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProgressoPage() {
  const [assessments, setAssessments] = useState<AvaliacaoResultadoDto[]>([]);
  const [adherence, setAdherence] = useState<RelatorioAdesaoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [av, adh] = await Promise.all([
          nutritionalAssessmentService.listAssessments().catch(() => [] as AvaliacaoResultadoDto[]),
          foodDiaryService.getAdherenceReport(subDays(new Date(), 30), new Date()).catch(() => null),
        ]);
        setAssessments(av);
        setAdherence(adh);
      } catch {
        setError('FALHA AO CARREGAR DADOS DE PROGRESSO.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const first = assessments[assessments.length - 1];
  const last  = assessments[0];
  const difPeso = first && last ? (last.pesoKg - first.pesoKg) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="pip-glow" style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        &gt;&gt; RELATÓRIO DE PROGRESSO
      </div>

      {error && <div className="pip-alert">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="pip-spinner" /><span className="pip-cursor">CARREGANDO LOG</span>
        </div>
      ) : (
        <>
          {/* Tendência de peso */}
          {assessments.length >= 2 && difPeso !== null && (
            <div className="pip-card">
              <div className="pip-card-title">VARIAÇÃO DE PESO</div>
              <div className="pip-row" style={{ marginTop: '8px' }}>
                <span className="pip-row-label">INÍCIO</span><div className="pip-dots" />
                <span className="pip-row-value">{first.pesoKg.toFixed(1)} KG — {format(new Date(first.dataAvaliacao), 'dd/MM/yy', { locale: ptBR }).toUpperCase()}</span>
              </div>
              <div className="pip-row">
                <span className="pip-row-label">ATUAL</span><div className="pip-dots" />
                <span className="pip-row-value">{last.pesoKg.toFixed(1)} KG — {format(new Date(last.dataAvaliacao), 'dd/MM/yy', { locale: ptBR }).toUpperCase()}</span>
              </div>
              <div className="pip-row">
                <span className="pip-row-label">VARIAÇÃO</span><div className="pip-dots" />
                <span className="pip-row-value" style={{ color: difPeso < 0 ? 'var(--pip-green)' : difPeso > 0 ? 'var(--pip-amber)' : undefined }}>
                  {difPeso > 0 ? '+' : ''}{difPeso.toFixed(1)} KG
                </span>
              </div>
            </div>
          )}

          {/* Aderência */}
          {adherence && (
            <div className="pip-card">
              <div className="pip-card-title">ADERÊNCIA (30 DIAS)</div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '120px', fontSize: '0.85rem' }}>ADERÊNCIA</span>
                  <div className="pip-bar" style={{ height: '14px' }}>
                    <div className="pip-bar-fill" style={{ width: `${adherence.percentualAderenciaMedia ?? 0}%` }} />
                  </div>
                  <span style={{ fontSize: '0.8rem' }}>{(adherence.percentualAderenciaMedia ?? 0).toFixed(0)}%</span>
                </div>
              </div>
              <div className="pip-row" style={{ marginTop: '8px' }}>
                <span className="pip-row-label">DIAS REGISTRADOS</span><div className="pip-dots" />
                <span className="pip-row-value">{adherence.diasComRegistro ?? 0} / {adherence.diasTotais ?? 30}</span>
              </div>
            </div>
          )}

          {/* Histórico de avaliações */}
          {assessments.length === 0 && (
            <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>
              NENHUMA AVALIAÇÃO NO HISTÓRICO.{' '}
              <a href="/avaliacoes" className="pip-btn" style={{ padding: '4px 12px', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
                IR PARA AVALIAÇÕES &gt;
              </a>
            </div>
          )}

          {assessments.length > 0 && (
            <div className="pip-card">
              <div className="pip-card-title">HISTÓRICO DE AVALIAÇÕES ({assessments.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px' }}>
                {assessments.slice(0, 5).map((av, i) => (
                  <div key={av.id} className="pip-row" style={{ fontSize: '0.85rem' }}>
                    <span style={{ opacity: 0.5, width: '24px', flexShrink: 0 }}>#{i + 1}</span>
                    <span className="pip-row-label">{format(new Date(av.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR }).toUpperCase()}</span>
                    <div className="pip-dots" />
                    <span className="pip-row-value">{av.pesoKg.toFixed(1)} KG — IMC {av.imc.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
