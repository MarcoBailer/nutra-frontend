'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { quickMealService, userProfileService } from '@/services';
import { StatusDiarioDto, PerfilNutricionalDto } from '@/types/api';
import {
  ETipoObjetivo,
  ENivelAtividadeFisica,
  EGeneroBiologico,
  NivelAtividadeInfo,
} from '@/types/enums';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ObjetivoLabels: Record<ETipoObjetivo, string> = {
  [ETipoObjetivo.PerdaDeGordura]:       'PERDA DE GORDURA',
  [ETipoObjetivo.Hipertrofia]:          'HIPERTROFIA',
  [ETipoObjetivo.Manutencao]:           'MANUTENÇÃO',
  [ETipoObjetivo.RecomposicaoCorporal]: 'RECOMPOSIÇÃO',
  [ETipoObjetivo.SaudeMetabolica]:      'SAÚDE METABÓLICA',
  [ETipoObjetivo.PerformanceEsportiva]: 'PERFORMANCE',
  [ETipoObjetivo.GanhoDeEnergia]:       'GANHO DE ENERGIA',
};

function calcIMC(peso: number, alturaCm: number) {
  const altM = alturaCm / 100;
  return peso / (altM * altM);
}

function calcIdade(dataNascimento: string) {
  const diff = Date.now() - new Date(dataNascimento).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function vaultBoyGif(objetivo: ETipoObjetivo | undefined) {
  if (objetivo === ETipoObjetivo.Hipertrofia)
    return '/Strong.gif';
  if (objetivo === ETipoObjetivo.Manutencao || objetivo === ETipoObjetivo.SaudeMetabolica || objetivo === ETipoObjetivo.RecomposicaoCorporal)
    return '/garden-of-eden.gif';
  return '/vaultboy.gif';
}

type SubTab = 'GERAL' | 'DETALHES';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [daily, setDaily] = useState<StatusDiarioDto | null>(null);
  const [perfil, setPerfil] = useState<PerfilNutricionalDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<SubTab>('GERAL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setMounted(true);
    Promise.all([
      quickMealService.getDailyStatus().catch(() => null),
      userProfileService.getProfile().catch(() => null),
    ]).then(([d, p]) => {
      console.log('Status Diário:', d);
      setDaily(d);
      console.log('Perfil:', p);
      setPerfil(p);
      setLoading(false);
    });
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <div className="pip-spinner" />
        <div className="pip-glow pip-cursor" style={{ fontSize: '1.1rem' }}>INICIALIZANDO</div>
      </div>
    );
  }

  const userName = session?.user?.name?.toUpperCase() ?? 'USUÁRIO';
  const hoje = format(new Date(), "EEEE, d 'DE' MMMM 'DE' yyyy", { locale: ptBR }).toUpperCase();

  const defaultStats = {
    caloriasConsumidas: 0, 
    caloriasAlvo: 2000,
    proteinaConsumidaG: 0, 
    proteinaAlvoG: 150,
    carboidratoConsumidoG: 0, 
    carboidratoAlvoG: 250,
    gorduraConsumidaG: 0, 
    gorduraAlvoG: 65,
    fibraConsumidaG: 0, 
    fibraAlvoG: 25,
    aguaConsumidaL: 0, 
    aguaAlvoL: 3,
    percentualAderencia: 0,
    refeicoesRegistradas: 0, 
    refeicoesPlaneadas: 6,
  };

  const stats = { ...defaultStats, ...daily };
  console.log('Stats para renderização:', stats);

  const imc = perfil ? calcIMC(perfil.pesoAtualKg, perfil.alturaCm) : null;
  const idade = perfil?.dataNascimento ? calcIdade(perfil.dataNascimento) : null;
  const objetivo = perfil?.objetivo;
  const gifSrc = vaultBoyGif(objetivo);
  const aderPct = stats.percentualAderencia;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>

      {/* Sub-tabs */}
      <div className="pip-sub-tabs">
        {(['GERAL', 'DETALHES'] as SubTab[]).map(t => (
          <div
            key={t}
            className={`pip-sub-tab ${subTab === t ? 'pip-sub-tab-active' : ''}`}
            onClick={() => setSubTab(t)}
          >
            {subTab === t ? `> ${t}` : t}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.5 }}>{hoje}</div>
      </div>

      {subTab === 'GERAL' ? (
        /* â”€â”€ GERAL: Vault Boy + Macros â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: 1 }}>

          {/* Coluna Vault Boy */}
          <div style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            paddingRight: '20px',
            borderRight: '1px dashed rgba(0,179,0,0.4)',
            minWidth: '160px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifSrc}
              alt="Vault Boy"
              className="pip-vault-boy pip-vault-boy-md"
              style={{ maxWidth: '180px' }}
            />
            <div className="pip-glow" style={{ fontSize: '0.9rem', textAlign: 'center' }}>
              {objetivo !== undefined ? ObjetivoLabels[objetivo] : 'CONFIGURE SEU PERFIL'}
            </div>
            {perfil && (
              <div style={{ fontSize: '0.8rem', opacity: 0.65, textAlign: 'center' }}>
                PESO: {perfil.pesoAtualKg} KG
              </div>
            )}
            <Link href="/diario/registrar" className="pip-btn pip-btn-filled" style={{ fontSize: '0.85rem', padding: '6px 14px', marginTop: '8px' }}>
              + REGISTRAR
            </Link>
          </div>

          {/* Coluna Stats */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '200px' }}>

            {/* Macronutrientes */}
            <div className="pip-card">
              <div className="pip-card-title">&gt; MACRONUTRIENTES DO DIA</div>
              <div className="pip-macro-grid">
                <div className="pip-macro-item">
                  <span>PROT</span>
                  <span>{stats.proteinaConsumidaG.toFixed(0)}g / {stats.proteinaAlvoG.toFixed(0)}g</span>
                </div>
                <div className="pip-macro-item">
                  <span>CARB</span>
                  <span>{stats.carboidratoConsumidoG.toFixed(0)}g / {stats.carboidratoAlvoG.toFixed(0)}g</span>
                </div>
                <div className="pip-macro-item">
                  <span>GORD</span>
                  <span>{stats.gorduraConsumidaG.toFixed(0)}g / {stats.gorduraAlvoG.toFixed(0)}g</span>
                </div>
                <div className="pip-macro-item">
                  <span>FIBRA</span>
                  <span>{stats.fibraConsumidaG.toFixed(0)}g / {stats.fibraAlvoG.toFixed(0)}g</span>
                </div>
              </div>
            </div>

            {/* Aderência */}
            <div className="pip-card">
              <div className="pip-card-title">&gt; MISSÃO DO DIA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '90px', fontSize: '0.9rem', flexShrink: 0 }}>HP (KCAL)</span>
                  <div className="pip-bar">
                    <div
                      className="pip-bar-fill"
                      style={{ width: mounted ? `${Math.min((stats.caloriasConsumidas / stats.caloriasAlvo) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', minWidth: '70px' }}>
                    {stats.caloriasConsumidas.toFixed(0)} / {stats.caloriasAlvo.toFixed(0)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '90px', fontSize: '0.9rem', flexShrink: 0, color: 'var(--pip-amber)' }}>AP (H2O)</span>
                  <div className="pip-bar">
                    <div
                      className="pip-bar-fill-amber"
                      style={{ width: mounted ? `${Math.min((stats.aguaConsumidaL / stats.aguaAlvoL) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', minWidth: '70px', color: 'var(--pip-amber)' }}>
                    {stats.aguaConsumidaL.toFixed(1)}L / {stats.aguaAlvoL.toFixed(1)}L
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '90px', fontSize: '0.9rem', flexShrink: 0, color: 'var(--pip-blue)' }}>ADERÊNCIA</span>
                  <div className="pip-bar">
                    <div
                      className="pip-bar-fill-blue"
                      style={{ width: mounted ? `${aderPct}%` : '0%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', minWidth: '70px', color: 'var(--pip-blue)' }}>
                    {aderPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Refeições */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
              <span>REFEIÇÕES: {stats.refeicoesRegistradas} / {stats.refeicoesPlaneadas}</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <Link href="/diario" style={{ color: 'var(--pip-green)', textDecoration: 'none' }}>
                VER DIÁRIO &gt;
              </Link>
              <span style={{ opacity: 0.4 }}>|</span>
              <Link href="/plano" style={{ color: 'var(--pip-green)', textDecoration: 'none' }}>
                VER PLANO &gt;
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* â”€â”€ DETALHES: Atributos do personagem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: 1 }}>

          {/* Lista de atributos */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div className="pip-glow" style={{ fontSize: '1.2rem', marginBottom: '16px', letterSpacing: '0.1em' }}>
              STATUS SPECIAL PERKS
            </div>

            {[
              { label: 'USUÁRIO',       value: userName },
              { label: 'OBJETIVO',      value: objetivo !== undefined ? ObjetivoLabels[objetivo] : 'N/A' },
              { label: 'PESO',          value: perfil ? `${perfil.pesoAtualKg} KG` : 'N/A' },
              { label: 'ALTURA',        value: perfil ? `${perfil.alturaCm} CM` : 'N/A' },
              { label: 'IDADE',         value: idade !== null ? `${idade} ANOS` : 'N/A' },
              { label: 'IMC',           value: imc !== null ? imc.toFixed(1) : 'N/A' },
              { label: '% GORDURA',     value: perfil?.percentualGorduraCorporal ? `${perfil.percentualGorduraCorporal}%` : 'N/A' },
              { label: 'GÊNERO',        value: perfil ? (perfil.genero === EGeneroBiologico.Masculino ? 'MASCULINO' : 'FEMININO') : 'N/A' },
              { label: 'ATIVIDADE',     value: perfil ? NivelAtividadeInfo[perfil.nivelAtividade]?.label.toUpperCase() ?? 'N/A' : 'N/A' },
              { label: 'ADERÊNCIA',     value: `${aderPct.toFixed(0)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="pip-row">
                <span className="pip-row-label" style={{ minWidth: '120px', fontSize: '0.9rem' }}>{label}</span>
                <div className="pip-dots" />
                <span className="pip-row-value pip-glow-sm" style={{ fontSize: '0.95rem' }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/perfil" className="pip-btn" style={{ fontSize: '0.8rem' }}>
                EDITAR PERFIL
              </Link>
              <Link href="/avaliacoes" className="pip-btn" style={{ fontSize: '0.8rem' }}>
                AVALIAÇÃO CORPORAL
              </Link>
            </div>
          </div>

          {/* Vault Boy grande + descrição */}
          <div style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '20px',
            borderLeft: '1px dashed rgba(0,179,0,0.4)',
            maxWidth: '220px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifSrc}
              alt="Vault Boy"
              className="pip-vault-boy pip-vault-boy-lg"
            />
            <div style={{ fontSize: '0.8rem', opacity: 0.65, textAlign: 'center', lineHeight: '1.4' }}>
              OBJETIVO É A MEDIDA DO SEU PLANO DE CONDICIONAMENTO FÍSICO.
              ELE AFETA SUA META DE CALORIAS, DISTRIBUIÇÃO DE MACROS E
              INTENSIDADE DOS TREINOS RECOMENDADOS.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

