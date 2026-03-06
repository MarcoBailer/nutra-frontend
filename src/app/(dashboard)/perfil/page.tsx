'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { accountService, userProfileService } from '@/services';
import { NutraUser, PerfilNutricionalDto } from '@/types/api';
import { ObjetivoLabels, NivelAtividadeLabels, GeneroLabels } from '@/types/enums';
import { format } from 'date-fns';

export default function PerfilPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<NutraUser | null>(null);
  const [nutProfile, setNutProfile] = useState<PerfilNutricionalDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nomeCompleto: '', telefone: '' });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [userData, np] = await Promise.all([
          accountService.getProfile(),
          userProfileService.getProfile().catch(() => null),
        ]);
        setProfile(userData);
        setNutProfile(np);
        setForm({ nomeCompleto: userData.nomeCompleto ?? '', telefone: userData.telefone ?? '' });
      } catch {
        setError('FALHA AO CARREGAR DADOS DO VAULT.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      await accountService.updateProfile(form);
      setProfile(prev => prev ? { ...prev, ...form } : prev);
      setEditing(false);
      setSuccess('DADOS ATUALIZADOS COM SUCESSO!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('FALHA AO SALVAR DADOS.');
    }
  };

  const idade = profile?.dataNascimento
    ? Math.floor((Date.now() - new Date(profile.dataNascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '6px' }}>
        <div className="pip-glow" style={{ fontSize: '1.1rem' }}>
          &gt;&gt; FICHA DO AGENTE
        </div>
        {!editing ? (
          <button className="pip-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => setEditing(true)}>
            [EDITAR]
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="pip-btn pip-btn-filled" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={handleSave}>
              [SALVAR]
            </button>
            <button className="pip-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => setEditing(false)}>
              [CANCELAR]
            </button>
          </div>
        )}
      </div>

      {error && <div className="pip-alert">{error}</div>}
      {success && <div className="pip-alert" style={{ borderColor: 'var(--pip-green)', color: 'var(--pip-green)' }}>{success}</div>}

      {loading ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
          <div className="pip-spinner" />
          <span className="pip-cursor">CARREGANDO FICHA</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Vault Boy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sleeping.gif"
              alt="vault boy"
              className="pip-vault-boy pip-vault-boy-md"
              style={{ display: 'block' }}
            />
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{session?.user?.name?.toUpperCase() ?? 'AGENTE'}</span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="pip-glow" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>// DADOS PESSOAIS</div>

            {editing ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px 10px', alignItems: 'center' }}>
                  <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>NOME:</span>
                  <input
                    className="pip-input"
                    value={form.nomeCompleto}
                    onChange={e => setForm({ ...form, nomeCompleto: e.target.value })}
                  />
                  <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>TELEFONE:</span>
                  <input
                    className="pip-input"
                    value={form.telefone}
                    onChange={e => setForm({ ...form, telefone: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                {[
                  { l: 'NOME', v: profile?.nomeCompleto ?? '-' },
                  { l: 'E-MAIL', v: profile?.email ?? '-' },
                  { l: 'TELEFONE', v: profile?.telefone ?? '-' },
                  { l: 'NASCIMENTO', v: profile?.dataNascimento ? format(new Date(profile.dataNascimento), 'dd/MM/yyyy') : '-' },
                  { l: 'IDADE', v: idade ? `${idade} ANOS` : '-' },
                  { l: 'MEMBRO DESDE', v: profile?.criadoEm ? format(new Date(profile.criadoEm), 'dd/MM/yyyy') : '-' },
                ].map(({ l, v }) => (
                  <div key={l} className="pip-row" style={{ fontSize: '0.9rem' }}>
                    <span className="pip-row-label">{l}</span>
                    <div className="pip-dots" />
                    <span className="pip-row-value" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Perfil nutricional */}
      {nutProfile && !loading && (
        <div style={{ marginTop: '8px' }}>
          <div className="pip-glow" style={{ fontSize: '0.9rem', borderBottom: '1px solid var(--pip-dim)', paddingBottom: '4px', marginBottom: '8px' }}>
            // PERFIL NUTRICIONAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {[
              { l: 'OBJETIVO', v: nutProfile.objetivo != null ? (ObjetivoLabels[nutProfile.objetivo] ?? '-') : '-' },
              { l: 'NÍVEL ATIVIDADE', v: nutProfile.nivelAtividade != null ? (NivelAtividadeLabels[nutProfile.nivelAtividade] ?? '-') : '-' },
              { l: 'GÊNERO', v: nutProfile.genero != null ? (GeneroLabels[nutProfile.genero] ?? '-') : '-' },
              { l: 'PESO ATUAL', v: nutProfile.pesoAtualKg ? `${nutProfile.pesoAtualKg.toFixed(1)} KG` : '-' },
              { l: 'ALTURA', v: nutProfile.alturaCm ? `${nutProfile.alturaCm} CM` : '-' },
            ].map(({ l, v }) => (
              <div key={l} className="pip-row" style={{ fontSize: '0.9rem' }}>
                <span className="pip-row-label">{l}</span>
                <div className="pip-dots" />
                <span className="pip-row-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
