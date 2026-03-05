/**
 * @fileoverview Página do diário alimentar.
 * 
 * Exibe o consumo diário do usuário:
 * - Resumo do dia (calorias, macros)
 * - Lista de refeições consumidas
 * - Opções para editar/remover itens
 * - Navegação entre dias
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Utensils,
  Edit2,
  Trash2,
  Camera,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  MacroProgress,
  PageLoading,
  Alert,
} from '@/components/ui';
import { foodDiaryService } from '@/services';
import { DiarioDiaDto } from '@/types/api';
import { TipoRefeicaoLabels, ETipoRefeicao } from '@/types/enums';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DiarioPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryData, setDiaryData] = useState<DiarioDiaDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDiary() {
      try {
        setLoading(true);
        setError(null);

        const data = await foodDiaryService.getDailyDiary(selectedDate);
        setDiaryData(data);
      } catch (err) {
        console.error('Erro ao carregar diário:', err);
        setError('Não foi possível carregar o diário alimentar.');
        setDiaryData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDiary();
  }, [selectedDate]);

  const isToday = isSameDay(selectedDate, new Date());

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    if (!isToday) {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  // Metas e totais - acessando estrutura do DiarioDiaDto
  const metas = diaryData?.metasDoDia ?? {
    caloriasKcal: 2000,
    proteinaG: 150,
    carboidratoG: 250,
    gorduraG: 65,
    fibraG: 25,
    aguaL: 2,
  };

  const totais = diaryData?.totalConsumido ?? {
    caloriasKcal: 0,
    proteinaG: 0,
    carboidratoG: 0,
    gorduraG: 0,
    fibraG: 0,
    aguaL: 0,
  };

  const refeicoes = diaryData?.refeicoes ?? [];

  const caloriesPercentage =
    metas.caloriasKcal > 0
      ? Math.round((totais.caloriasKcal / metas.caloriasKcal) * 100)
      : 0;

  if (loading) {
    return <PageLoading message="Carregando diário..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Diário Alimentar</h1>
          <p className="text-sm sm:text-base text-text-secondary">Acompanhe seu consumo diário</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/diario/fotos"
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            Fotos
          </Link>
          <Link
            href="/diario/registrar"
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-200"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            Registrar
          </Link>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Seletor de data */}
      <Card>
        <CardContent className="py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="p-1.5 sm:p-2 hover:bg-background-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-text-secondary" />
            </button>

            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-text-primary">
                {isToday
                  ? 'Hoje'
                  : format(selectedDate, "EEEE", { locale: ptBR })}
              </p>
              <p className="text-xs sm:text-sm text-text-muted">
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <button
              onClick={handleNextDay}
              disabled={isToday}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isToday
                  ? 'text-text-muted cursor-not-allowed'
                  : 'hover:bg-background-secondary text-text-secondary'
              }`}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calorias */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Resumo Nutricional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              {/* Círculo de calorias */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={caloriesPercentage > 100 ? 'var(--error)' : 'var(--primary)'}
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(caloriesPercentage, 100) * 2.83} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-text-primary">
                    {totais.caloriasKcal.toFixed(0)}
                  </span>
                  <span className="text-xs text-text-muted">
                    / {metas.caloriasKcal.toFixed(0)} kcal
                  </span>
                </div>
              </div>

              {/* Macros */}
              <div className="flex-1 w-full space-y-2 sm:space-y-3">
                <MacroProgress
                  label="Proteína"
                  current={totais.proteinaG}
                  target={metas.proteinaG}
                  unit="g"
                  color="blue"
                />
                <MacroProgress
                  label="Carboidratos"
                  current={totais.carboidratoG}
                  target={metas.carboidratoG}
                  unit="g"
                  color="amber"
                />
                <MacroProgress
                  label="Gorduras"
                  current={totais.gorduraG}
                  target={metas.gorduraG}
                  unit="g"
                  color="purple"
                />
                <MacroProgress
                  label="Fibras"
                  current={totais.fibraG}
                  target={metas.fibraG}
                  unit="g"
                  color="emerald"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso diário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Aderência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={caloriesPercentage >= 80 ? 'var(--success)' : 'var(--warning)'}
                    strokeWidth="10"
                    strokeDasharray={`${Math.min(caloriesPercentage, 100) * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl sm:text-2xl font-bold text-text-primary">
                  {caloriesPercentage}%
                </span>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-text-secondary">
                {refeicoes.length} refeições registradas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de refeições */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Refeições do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {refeicoes.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {refeicoes.map((refeicao, index) => (
                <div
                  key={`${refeicao.tipoRefeicao}-${index}`}
                  className="border border-card-border rounded-lg overflow-hidden"
                >
                  {/* Header da refeição */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background-secondary">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm sm:text-base text-text-primary">
                          {TipoRefeicaoLabels[refeicao.tipoRefeicao] ?? 'Refeição'}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted">
                          {refeicao.horarioPlanejado ?? ''}{' '}
                          • {refeicao.consumido.energiaKcal.toFixed(0)} kcal
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 sm:gap-1">
                      <button className="p-1.5 sm:p-2 hover:bg-card rounded-lg transition-colors">
                        <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-text-muted" />
                      </button>
                      <button className="p-1.5 sm:p-2 hover:bg-error/10 rounded-lg transition-colors">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-error" />
                      </button>
                    </div>
                  </div>

                  {/* Itens da refeição */}
                  {refeicao.registros && refeicao.registros.length > 0 && (
                    <div className="divide-y divide-card-border">
                      {refeicao.registros.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 sm:p-3 hover:bg-background-secondary"
                        >
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-text-primary">
                              {item.nomeAlimento}
                            </p>
                            <p className="text-xs text-text-muted">
                              {item.quantidadeConsumidaG}g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs sm:text-sm font-medium text-text-primary">
                              {item.energiaKcal.toFixed(0)} kcal
                            </p>
                            <p className="text-xs text-text-muted hidden xs:block">
                              P: {item.proteinaG.toFixed(0)}g | C:{' '}
                              {item.carboidratoG.toFixed(0)}g | G:{' '}
                              {item.gorduraG.toFixed(0)}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Utensils className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">
                Nenhuma refeição registrada
              </h3>
              <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6">
                Registre o que você comeu hoje
              </p>
              <Link
                href="/diario/registrar"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Registrar Refeição
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
