'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accountService, nutritionistService } from '@/services';
import { CadastroNutricionistaDto } from '@/types/api';

const CRN_REGIOES: { value: number; label: string }[] = [
  { value: 1,  label: 'CRN-1 (Centro-Oeste e Norte)' },
  { value: 2,  label: 'CRN-2 (Bahia e Sergipe)' },
  { value: 3,  label: 'CRN-3 (São Paulo e Mato Grosso do Sul)' },
  { value: 4,  label: 'CRN-4 (Rio de Janeiro e Espírito Santo)' },
  { value: 5,  label: 'CRN-5 (Rio Grande do Sul)' },
  { value: 6,  label: 'CRN-6 (Minas Gerais)' },
  { value: 7,  label: 'CRN-7 (Pernambuco e Alagoas)' },
  { value: 8,  label: 'CRN-8 (Paraná e Santa Catarina)' },
  { value: 9,  label: 'CRN-9 (Maranhão, Piauí, Ceará, RN e Paraíba)' },
  { value: 10, label: 'CRN-10 (Pará, Amazonas, Roraima, Amapá, Acre e Rondônia)' },
  { value: 11, label: 'CRN-11 (Mato Grosso e Goiás)' },
];

export default function OnboardingNutricionistaPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CadastroNutricionistaDto>({
    nomeCompleto: '',
    email: '',
    cpf: '',
    crn: '',
    crnRegiao: 3,
    especialidade: '',
    bioProfissional: '',
    anosExperiencia: undefined,
    telefone: '',
  });

  // Pre-fill from account data
  useEffect(() => {
    accountService.getProfile().then(user => {
      setForm(f => ({
        ...f,
        nomeCompleto: user.nomeCompleto ?? '',
        email: user.email ?? '',
        cpf: user.cpf ?? '',
        telefone: user.telefone ?? '',
      }));
    }).catch(() => null);
  }, []);

  const set = <K extends keyof CadastroNutricionistaDto>(key: K, value: CadastroNutricionistaDto[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const canSubmit =
    form.nomeCompleto.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.cpf.trim().length > 0 &&
    form.crn.trim().length > 0 &&
    form.crnRegiao >= 1 && form.crnRegiao <= 11;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await nutritionistService.register(form);
      router.push('/dashboard');
    } catch {
      setError('FALHA AO REGISTRAR PERFIL PROFISSIONAL. VERIFIQUE OS DADOS E TENTE NOVAMENTE.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; CADASTRO PROFISSIONAL — NUTRICIONISTA</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
        Para ativar sua conta como nutricionista, preencha seus dados profissionais.
      </div>

      {/* Dados pessoais (pré-preenchidos) */}
      <div style={{ borderBottom: '1px solid var(--pip-dim)', paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.08em' }}>DADOS PESSOAIS</div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="pip-field" style={{ flex: 2 }}>
            <label className="pip-label">Nome Completo *</label>
            <input
              className="pip-input"
              value={form.nomeCompleto}
              onChange={e => set('nomeCompleto', e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="pip-field" style={{ flex: 1 }}>
            <label className="pip-label">CPF *</label>
            <input
              className="pip-input"
              value={form.cpf}
              onChange={e => set('cpf', e.target.value)}
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="pip-field" style={{ flex: 2 }}>
            <label className="pip-label">E-mail *</label>
            <input
              type="email"
              className="pip-input"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div className="pip-field" style={{ flex: 1 }}>
            <label className="pip-label">Telefone</label>
            <input
              className="pip-input"
              value={form.telefone ?? ''}
              onChange={e => set('telefone', e.target.value)}
              maxLength={20}
            />
          </div>
        </div>
      </div>

      {/* Dados profissionais */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.08em' }}>DADOS PROFISSIONAIS</div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="pip-field" style={{ flex: 1 }}>
            <label className="pip-label">CRN * (somente números)</label>
            <input
              className="pip-input"
              value={form.crn}
              onChange={e => set('crn', e.target.value)}
              maxLength={20}
              placeholder="ex: 12345"
            />
          </div>
          <div className="pip-field" style={{ flex: 2 }}>
            <label className="pip-label">Região do CRN *</label>
            <select
              className="pip-input"
              value={form.crnRegiao}
              onChange={e => set('crnRegiao', parseInt(e.target.value))}
            >
              {CRN_REGIOES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="pip-field" style={{ flex: 2 }}>
            <label className="pip-label">Especialidade (opcional)</label>
            <input
              className="pip-input"
              value={form.especialidade ?? ''}
              onChange={e => set('especialidade', e.target.value)}
              maxLength={200}
              placeholder="ex: Nutrição Esportiva, Nutrição Clínica..."
            />
          </div>
          <div className="pip-field" style={{ flex: 1 }}>
            <label className="pip-label">Anos de Experiência</label>
            <input
              type="number"
              className="pip-input"
              min="0"
              max="60"
              value={form.anosExperiencia ?? ''}
              onChange={e => set('anosExperiencia', e.target.value === '' ? undefined : parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="pip-field">
          <label className="pip-label">Bio Profissional (opcional)</label>
          <textarea
            className="pip-input"
            rows={4}
            value={form.bioProfissional ?? ''}
            onChange={e => set('bioProfissional', e.target.value)}
            maxLength={2000}
            style={{ resize: 'vertical' }}
            placeholder="Descreva sua experiência, abordagem e especialidades..."
          />
        </div>
      </div>

      {error && <div className="pip-alert">{error}</div>}

      <button
        className="pip-btn pip-btn-filled"
        style={{ padding: '10px', fontSize: '1rem', marginTop: '8px' }}
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
      >
        {submitting ? '[REGISTRANDO...]' : '[ATIVAR CONTA PROFISSIONAL]'}
      </button>
    </div>
  );
}
