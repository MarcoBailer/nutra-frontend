'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userProfileService } from '@/services';
import { PerfilNutricionalDto, HistoricoClinicoDto } from '@/types/api';
import {
  EGeneroBiologico,
  ENivelAtividadeFisica,
  ETipoObjetivo,
  EPreferenciaAlimentar,
  ENivelHabilidadeCulinaria,
  EOrcamentoMensalEstimado,
  EAlergico,
  EEquipamentoDisponivel,
  ECondicaoClinica,
  NivelAtividadeInfo,
  TipoObjetivoLabels,
  PreferenciaAlimentarLabels,
  AlergicoLabels,
  EquipamentoLabels,
  CondicaoClinicaLabels,
} from '@/types/enums';

// ── Tipos parciais por step ─────────────────────────────────────────────────

type StepId =
  | 'pessoal'
  | 'medidas'
  | 'estilo'
  | 'saude'
  | 'objetivos'
  | 'alimentacao'
  | 'restricoes'
  | 'equipamentos'
  | 'revisao';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'pessoal',      label: '1.PESSOAL'    },
  { id: 'medidas',      label: '2.MEDIDAS'    },
  { id: 'estilo',       label: '3.ESTILO'     },
  { id: 'saude',        label: '4.SAÚDE'      },
  { id: 'objetivos',    label: '5.OBJETIVO'   },
  { id: 'alimentacao',  label: '6.DIETA'      },
  { id: 'restricoes',   label: '7.RESTRIÇÕES' },
  { id: 'equipamentos', label: '8.EQUIP.'     },
  { id: 'revisao',      label: '9.REVISÃO'    },
];

// ── Estado inicial do formulário ────────────────────────────────────────────

const initialForm: PerfilNutricionalDto = {
  alturaCm: 0,
  pesoAtualKg: 0,
  percentualGorduraCorporal: undefined,
  circunferenciaCinturaCm: undefined,
  circunferenciaQuadrilCm: undefined,
  circunferenciaBracoCm: undefined,
  fatorAtividade: 1.2,
  nivelAtividade: ENivelAtividadeFisica.Sedentario,
  ocupacaoProfissional: '',
  habilidadeCulinaria: ENivelHabilidadeCulinaria.Intermediario,
  orcamentoMensal: EOrcamentoMensalEstimado.Medio,
  possuiDoencasPreExistentes: false,
  descricaoCondicoesMedicas: '',
  fumante: false,
  qualidadeSono: undefined,
  horasSonoPorNoite: undefined,
  pesoDesejadoKg: undefined,
  refeicoesPorDiaDesejadas: 3,
  tempoDisponivelPreparoMinutos: 30,
  dataNascimento: '',
  genero: EGeneroBiologico.Masculino,
  objetivo: ETipoObjetivo.ManterPeso,
  preferenciaDieta: EPreferenciaAlimentar.SemRestricao,
  restricoesIds: [],
  preferencias: [],
  equipamentosIds: [],
  historicoClinicos: [],
};

// ── Modal de condição clínica ───────────────────────────────────────────────

interface CondicaoModalProps {
  onAdd: (c: HistoricoClinicoDto) => void;
  onClose: () => void;
}

function CondicaoModal({ onAdd, onClose }: CondicaoModalProps) {
  const [form, setForm] = useState<HistoricoClinicoDto>({
    condicao: ECondicaoClinica.Diabetes,
    ativaAtualmente: true,
  });

  const condicoes = Object.entries(CondicaoClinicaLabels) as [string, string][];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#1c1c1c',
          border: '2px solid var(--pip-green)',
          borderRadius: '12px',
          padding: '20px',
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div className="pip-glow" style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
          + ADICIONAR CONDIÇÃO CLÍNICA
        </div>

        <div className="pip-field">
          <label className="pip-label">Condição</label>
          <select
            className="pip-input"
            value={form.condicao}
            onChange={e => setForm(f => ({ ...f, condicao: Number(e.target.value) as ECondicaoClinica }))}
          >
            {condicoes.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {form.condicao === ECondicaoClinica.Outro && (
          <div className="pip-field">
            <label className="pip-label">Descreva a condição</label>
            <input
              className="pip-input"
              value={form.descricaoOutra ?? ''}
              onChange={e => setForm(f => ({ ...f, descricaoOutra: e.target.value }))}
              maxLength={500}
            />
          </div>
        )}

        <div className="pip-field">
          <label className="pip-label">Data do diagnóstico (opcional)</label>
          <input
            type="date"
            className="pip-input"
            value={form.dataDiagnostico ?? ''}
            onChange={e => setForm(f => ({ ...f, dataDiagnostico: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label className="pip-label" style={{ marginBottom: 0 }}>Condição ativa atualmente?</label>
          <button
            className={`pip-btn ${form.ativaAtualmente ? 'pip-btn-filled' : ''}`}
            style={{ padding: '2px 10px', fontSize: '0.8rem' }}
            onClick={() => setForm(f => ({ ...f, ativaAtualmente: !f.ativaAtualmente }))}
          >
            {form.ativaAtualmente ? '[SIM]' : '[NÃO]'}
          </button>
        </div>

        <div className="pip-field">
          <label className="pip-label">Medicamentos em uso (opcional)</label>
          <input
            className="pip-input"
            value={form.medicamentosEmUso ?? ''}
            onChange={e => setForm(f => ({ ...f, medicamentosEmUso: e.target.value }))}
            maxLength={1000}
          />
        </div>

        <div className="pip-field">
          <label className="pip-label">Observações (opcional)</label>
          <textarea
            className="pip-input"
            rows={2}
            value={form.observacoes ?? ''}
            onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
            maxLength={2000}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button className="pip-btn" style={{ padding: '4px 14px' }} onClick={onClose}>[CANCELAR]</button>
          <button
            className="pip-btn pip-btn-filled"
            style={{ padding: '4px 14px' }}
            onClick={() => { onAdd(form); onClose(); }}
          >
            [ADICIONAR]
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────────────────

export default function OnboardingPerfilPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<PerfilNutricionalDto>(initialForm);
  const [showCondicaoModal, setShowCondicaoModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex].id;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  // helpers
  const set = <K extends keyof PerfilNutricionalDto>(key: K, value: PerfilNutricionalDto[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const toggleInArray = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const nivelAtividadeOptions = Object.values(ENivelAtividadeFisica).filter(v => typeof v === 'number') as ENivelAtividadeFisica[];
  const objetivoOptions = Object.values(ETipoObjetivo).filter(v => typeof v === 'number') as ETipoObjetivo[];
  const preferenciaDietaOptions = Object.values(EPreferenciaAlimentar).filter(v => typeof v === 'number') as EPreferenciaAlimentar[];
  const alergicoOptions = Object.values(EAlergico).filter(v => typeof v === 'number' && v !== EAlergico.None) as EAlergico[];
  const equipamentoOptions = Object.values(EEquipamentoDisponivel).filter(v => typeof v === 'number' && v !== EEquipamentoDisponivel.Nenhum) as EEquipamentoDisponivel[];

  // ── Navegação ────────────────────────────────────────────────────────────

  const canNext = (): boolean => {
    switch (currentStep) {
      case 'pessoal':
        return !!form.dataNascimento && form.dataNascimento !== '';
      case 'medidas':
        return form.alturaCm > 0 && form.pesoAtualKg > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isLast) setStepIndex(i => i + 1);
  };

  const handleBack = () => {
    if (!isFirst) setStepIndex(i => i - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // Derive fatorAtividade from nivelAtividade
      const payload: PerfilNutricionalDto = {
        ...form,
        fatorAtividade: NivelAtividadeInfo[form.nivelAtividade].fator,
      };
      await userProfileService.createProfile(payload);
      router.push('/dashboard');
    } catch {
      setError('FALHA AO CRIAR PERFIL. VERIFIQUE OS DADOS E TENTE NOVAMENTE.');
      setSubmitting(false);
    }
  };

  // ── Renderização de cada step ─────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {

      // ── Step 1: Dados Pessoais ──────────────────────────────────────────
      case 'pessoal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; DADOS PESSOAIS</div>

            <div className="pip-field">
              <label className="pip-label">Data de Nascimento *</label>
              <input
                type="date"
                className="pip-input"
                value={form.dataNascimento}
                onChange={e => set('dataNascimento', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="pip-field">
              <label className="pip-label">Gênero Biológico *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[EGeneroBiologico.Masculino, EGeneroBiologico.Feminino].map(g => (
                  <button
                    key={g}
                    className={`pip-btn ${form.genero === g ? 'pip-btn-filled' : ''}`}
                    style={{ flex: 1, padding: '6px' }}
                    onClick={() => set('genero', g)}
                  >
                    [{g === EGeneroBiologico.Masculino ? 'MASCULINO' : 'FEMININO'}]
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 2: Medidas Corporais ───────────────────────────────────────
      case 'medidas':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; MEDIDAS CORPORAIS</div>

            {([ 
              ['alturaCm',                   'Altura (cm) *',                  'number'],
              ['pesoAtualKg',                'Peso Atual (kg) *',              'number'],
              ['percentualGorduraCorporal',  '% Gordura Corporal (opcional)',  'number'],
              ['circunferenciaCinturaCm',    'Circ. Cintura cm (opcional)',     'number'],
              ['circunferenciaQuadrilCm',    'Circ. Quadril cm (opcional)',    'number'],
              ['circunferenciaBracoCm',      'Circ. Braço cm (opcional)',      'number'],
            ] as [keyof PerfilNutricionalDto, string, string][]).map(([key, label]) => (
              <div key={key as string} className="pip-field">
                <label className="pip-label">{label}</label>
                <input
                  type="number"
                  className="pip-input"
                  step="0.1"
                  min="0"
                  value={(form[key] as number | undefined) ?? ''}
                  onChange={e => set(key, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        );

      // ── Step 3: Estilo de Vida ──────────────────────────────────────────
      case 'estilo':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; ESTILO DE VIDA</div>

            <div className="pip-field">
              <label className="pip-label">Nível de Atividade Física</label>
              <select
                className="pip-input"
                value={form.nivelAtividade}
                onChange={e => set('nivelAtividade', Number(e.target.value) as ENivelAtividadeFisica)}
              >
                {nivelAtividadeOptions.map(n => (
                  <option key={n} value={n}>{NivelAtividadeInfo[n].label}</option>
                ))}
              </select>
            </div>

            <div className="pip-field">
              <label className="pip-label">Ocupação Profissional</label>
              <input
                className="pip-input"
                value={form.ocupacaoProfissional ?? ''}
                onChange={e => set('ocupacaoProfissional', e.target.value)}
                maxLength={300}
              />
            </div>

            <div className="pip-field">
              <label className="pip-label">Habilidade Culinária</label>
              <select
                className="pip-input"
                value={form.habilidadeCulinaria}
                onChange={e => set('habilidadeCulinaria', Number(e.target.value) as ENivelHabilidadeCulinaria)}
              >
                <option value={ENivelHabilidadeCulinaria.Iniciante}>Iniciante</option>
                <option value={ENivelHabilidadeCulinaria.Intermediario}>Intermediário</option>
                <option value={ENivelHabilidadeCulinaria.Avancado}>Avançado</option>
                <option value={ENivelHabilidadeCulinaria.Chef}>Chef</option>
              </select>
            </div>

            <div className="pip-field">
              <label className="pip-label">Orçamento Mensal para Alimentação</label>
              <select
                className="pip-input"
                value={form.orcamentoMensal}
                onChange={e => set('orcamentoMensal', Number(e.target.value) as EOrcamentoMensalEstimado)}
              >
                <option value={EOrcamentoMensalEstimado.Economico}>Até R$ 300 (Econômico)</option>
                <option value={EOrcamentoMensalEstimado.Medio}>R$ 300–R$ 600 (Médio)</option>
                <option value={EOrcamentoMensalEstimado.Alto}>R$ 600–R$ 1000 (Alto)</option>
                <option value={EOrcamentoMensalEstimado.Premium}>Acima de R$ 1000 (Premium)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="pip-field" style={{ flex: 1 }}>
                <label className="pip-label">Horas de Sono / noite</label>
                <input
                  type="number"
                  className="pip-input"
                  min="0"
                  max="24"
                  step="0.5"
                  value={form.horasSonoPorNoite ?? ''}
                  onChange={e => set('horasSonoPorNoite', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </div>
              <div className="pip-field" style={{ flex: 1 }}>
                <label className="pip-label">Qualidade do Sono (1–5)</label>
                <input
                  type="number"
                  className="pip-input"
                  min="1"
                  max="5"
                  value={form.qualidadeSono ?? ''}
                  onChange={e => set('qualidadeSono', e.target.value === '' ? undefined : parseInt(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="pip-label" style={{ marginBottom: 0 }}>Fumante?</label>
              <button
                className={`pip-btn ${form.fumante ? 'pip-btn-filled' : ''}`}
                style={{ padding: '2px 12px', fontSize: '0.8rem' }}
                onClick={() => set('fumante', !form.fumante)}
              >
                {form.fumante ? '[SIM]' : '[NÃO]'}
              </button>
            </div>
          </div>
        );

      // ── Step 4: Saúde ───────────────────────────────────────────────────
      case 'saude':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; HISTÓRICO DE SAÚDE</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="pip-label" style={{ marginBottom: 0 }}>Possui doenças pré-existentes?</label>
              <button
                className={`pip-btn ${form.possuiDoencasPreExistentes ? 'pip-btn-filled' : ''}`}
                style={{ padding: '2px 12px', fontSize: '0.8rem' }}
                onClick={() => set('possuiDoencasPreExistentes', !form.possuiDoencasPreExistentes)}
              >
                {form.possuiDoencasPreExistentes ? '[SIM]' : '[NÃO]'}
              </button>
            </div>

            {form.possuiDoencasPreExistentes && (
              <div className="pip-field">
                <label className="pip-label">Descreva suas condições médicas</label>
                <textarea
                  className="pip-input"
                  rows={3}
                  value={form.descricaoCondicoesMedicas}
                  onChange={e => set('descricaoCondicoesMedicas', e.target.value)}
                  maxLength={2000}
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>CONDIÇÕES CLÍNICAS</span>
                <button
                  className="pip-btn"
                  style={{ padding: '2px 10px', fontSize: '0.75rem' }}
                  onClick={() => setShowCondicaoModal(true)}
                >
                  [+ ADICIONAR]
                </button>
              </div>
              {form.historicoClinicos.length === 0 ? (
                <div style={{ fontSize: '0.75rem', opacity: 0.4, padding: '8px 0' }}>
                  Nenhuma condição adicionada.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {form.historicoClinicos.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        border: '1px solid var(--pip-dim)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span>{CondicaoClinicaLabels[c.condicao]}{c.ativaAtualmente ? '' : ' (inativa)'}</span>
                      <button
                        className="pip-btn"
                        style={{ padding: '1px 8px', fontSize: '0.7rem' }}
                        onClick={() => set('historicoClinicos', form.historicoClinicos.filter((_, idx) => idx !== i))}
                      >
                        [X]
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showCondicaoModal && (
              <CondicaoModal
                onAdd={c => set('historicoClinicos', [...form.historicoClinicos, c])}
                onClose={() => setShowCondicaoModal(false)}
              />
            )}
          </div>
        );

      // ── Step 5: Objetivos ───────────────────────────────────────────────
      case 'objetivos':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; OBJETIVOS</div>

            <div className="pip-field">
              <label className="pip-label">Qual seu objetivo principal?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {objetivoOptions.map(obj => (
                  <button
                    key={obj}
                    className={`pip-btn ${form.objetivo === obj ? 'pip-btn-filled' : ''}`}
                    style={{ padding: '8px 6px', fontSize: '0.78rem', textAlign: 'center' }}
                    onClick={() => set('objetivo', obj)}
                  >
                    [{TipoObjetivoLabels[obj].toUpperCase()}]
                  </button>
                ))}
              </div>
            </div>

            <div className="pip-field">
              <label className="pip-label">Peso Desejado (kg) — opcional</label>
              <input
                type="number"
                className="pip-input"
                step="0.1"
                min="0"
                value={form.pesoDesejadoKg ?? ''}
                onChange={e => set('pesoDesejadoKg', e.target.value === '' ? undefined : parseFloat(e.target.value))}
              />
            </div>
          </div>
        );

      // ── Step 6: Alimentação ─────────────────────────────────────────────
      case 'alimentacao':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; PREFERÊNCIAS ALIMENTARES</div>

            <div className="pip-field">
              <label className="pip-label">Tipo de Dieta</label>
              <select
                className="pip-input"
                value={form.preferenciaDieta}
                onChange={e => set('preferenciaDieta', Number(e.target.value) as EPreferenciaAlimentar)}
              >
                {preferenciaDietaOptions.map(p => (
                  <option key={p} value={p}>{PreferenciaAlimentarLabels[p]}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="pip-field" style={{ flex: 1 }}>
                <label className="pip-label">Refeições por dia (3–7)</label>
                <input
                  type="number"
                  className="pip-input"
                  min="3"
                  max="7"
                  value={form.refeicoesPorDiaDesejadas}
                  onChange={e => set('refeicoesPorDiaDesejadas', Math.max(3, Math.min(7, parseInt(e.target.value) || 3)))}
                />
              </div>
              <div className="pip-field" style={{ flex: 1 }}>
                <label className="pip-label">Tempo para preparo (min)</label>
                <input
                  type="number"
                  className="pip-input"
                  min="5"
                  max="180"
                  step="5"
                  value={form.tempoDisponivelPreparoMinutos}
                  onChange={e => set('tempoDisponivelPreparoMinutos', parseInt(e.target.value) || 30)}
                />
              </div>
            </div>
          </div>
        );

      // ── Step 7: Restrições ──────────────────────────────────────────────
      case 'restricoes':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; ALERGIAS E INTOLERÂNCIAS</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
              Selecione todas que se aplicam (deixe vazio se não houver).
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alergicoOptions.map(alergico => {
                const checked = form.restricoesIds.includes(alergico);
                return (
                  <label
                    key={alergico}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      border: `1px solid ${checked ? 'var(--pip-green)' : 'var(--pip-dim)'}`,
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                    }}
                    onClick={() => set('restricoesIds', toggleInArray(form.restricoesIds, alergico))}
                  >
                    <span style={{
                      width: '14px',
                      height: '14px',
                      border: '1px solid var(--pip-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                    }}>
                      {checked ? '✓' : ''}
                    </span>
                    {AlergicoLabels[alergico]}
                  </label>
                );
              })}
            </div>
          </div>
        );

      // ── Step 8: Equipamentos ────────────────────────────────────────────
      case 'equipamentos':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; EQUIPAMENTOS DISPONÍVEIS</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
              Selecione os equipamentos que você tem em casa para preparo de refeições.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {equipamentoOptions.map(eq => {
                const checked = form.equipamentosIds.includes(eq);
                return (
                  <label
                    key={eq}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: '8px',
                      border: `1px solid ${checked ? 'var(--pip-green)' : 'var(--pip-dim)'}`,
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                    onClick={() => set('equipamentosIds', toggleInArray(form.equipamentosIds, eq))}
                  >
                    <span style={{
                      width: '14px',
                      height: '14px',
                      border: '1px solid var(--pip-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                    }}>
                      {checked ? '✓' : ''}
                    </span>
                    {EquipamentoLabels[eq]}
                  </label>
                );
              })}
            </div>
          </div>
        );

      // ── Step 9 (Final): Revisão ─────────────────────────────────────────
      case 'revisao': {
        const idade = form.dataNascimento
          ? Math.floor((Date.now() - new Date(form.dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : '?';

        const rows: [string, string][] = [
          ['Data Nascimento', form.dataNascimento ? new Date(form.dataNascimento + 'T00:00').toLocaleDateString('pt-BR') : '—'],
          ['Idade aprox.', `${idade} anos`],
          ['Gênero', form.genero === EGeneroBiologico.Masculino ? 'Masculino' : 'Feminino'],
          ['Altura', `${form.alturaCm} cm`],
          ['Peso', `${form.pesoAtualKg} kg`],
          ['Nível Atividade', NivelAtividadeInfo[form.nivelAtividade].label],
          ['Objetivo', TipoObjetivoLabels[form.objetivo]],
          ['Dieta', PreferenciaAlimentarLabels[form.preferenciaDieta]],
          ['Refeições/dia', String(form.refeicoesPorDiaDesejadas)],
          ['Tempo preparo', `${form.tempoDisponivelPreparoMinutos} min`],
          ['Fumante', form.fumante ? 'Sim' : 'Não'],
          ['Alergias', form.restricoesIds.length > 0 ? form.restricoesIds.map(a => AlergicoLabels[a]).join(', ') : 'Nenhuma'],
          ['Equipamentos', form.equipamentosIds.length > 0 ? form.equipamentosIds.map(e => EquipamentoLabels[e]).join(', ') : 'Nenhum selecionado'],
          ['Cond. clínicas', form.historicoClinicos.length > 0 ? form.historicoClinicos.map(c => CondicaoClinicaLabels[c.condicao]).join(', ') : 'Nenhuma'],
        ];

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="pip-glow" style={{ fontSize: '1rem' }}>&gt;&gt; REVISÃO DOS DADOS</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
              Revise as informações antes de criar seu perfil.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    borderBottom: '1px solid rgba(80,255,100,0.08)',
                    fontSize: '0.8rem',
                    gap: '10px',
                  }}
                >
                  <span style={{ opacity: 0.6, flexShrink: 0 }}>{label}</span>
                  <span style={{ textAlign: 'right', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="pip-alert" style={{ marginTop: '4px' }}>{error}</div>
            )}

            <button
              className="pip-btn pip-btn-filled"
              style={{ padding: '10px', fontSize: '1rem', marginTop: '8px' }}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? '[CALCULANDO METAS...]' : '[CONFIRMAR E CRIAR PERFIL]'}
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      {/* Progress bar / step indicator */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '4px',
          flexShrink: 0,
        }}
      >
        {STEPS.map((step, idx) => (
          <div
            key={step.id}
            style={{
              padding: '3px 6px',
              fontSize: '0.6rem',
              border: `1px solid ${idx <= stepIndex ? 'var(--pip-green)' : 'var(--pip-dim)'}`,
              borderRadius: '3px',
              color: idx === stepIndex ? 'var(--pip-green)' : idx < stepIndex ? 'rgba(80,255,100,0.5)' : 'var(--pip-dim)',
              whiteSpace: 'nowrap',
              cursor: idx < stepIndex ? 'pointer' : 'default',
              background: idx === stepIndex ? 'rgba(80,255,100,0.1)' : 'transparent',
            }}
            onClick={() => { if (idx < stepIndex) setStepIndex(idx); }}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* Step content (scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {renderStep()}
      </div>

      {/* Navigation */}
      {!isLast && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderTop: '1px solid var(--pip-dim)',
            paddingTop: '12px',
          }}
        >
          <button
            className="pip-btn"
            style={{ padding: '6px 16px' }}
            disabled={isFirst}
            onClick={handleBack}
          >
            [&lt; VOLTAR]
          </button>
          <button
            className="pip-btn pip-btn-filled"
            style={{ padding: '6px 16px' }}
            disabled={!canNext()}
            onClick={handleNext}
          >
            [PRÓXIMO &gt;]
          </button>
        </div>
      )}
      {isLast && !isFirst && (
        <div
          style={{
            flexShrink: 0,
            borderTop: '1px solid var(--pip-dim)',
            paddingTop: '12px',
          }}
        >
          <button
            className="pip-btn"
            style={{ padding: '6px 16px' }}
            onClick={handleBack}
          >
            [&lt; VOLTAR E EDITAR]
          </button>
        </div>
      )}
    </div>
  );
}
