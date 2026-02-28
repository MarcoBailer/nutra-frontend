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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diário Alimentar</h1>
          <p className="text-slate-500">Acompanhe seu consumo diário</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/diario/fotos"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
          >
            <Camera className="h-4 w-4" />
            Fotos
          </Link>
          <Link
            href="/diario/registrar"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
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
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-slate-600" />
            </button>

            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">
                {isToday
                  ? 'Hoje'
                  : format(selectedDate, "EEEE", { locale: ptBR })}
              </p>
              <p className="text-sm text-slate-500">
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            <button
              onClick={handleNextDay}
              disabled={isToday}
              className={`p-2 rounded-lg transition-colors ${
                isToday
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorias */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo Nutricional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Círculo de calorias */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="none"
                    stroke={caloriesPercentage > 100 ? '#ef4444' : '#10b981'}
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(caloriesPercentage, 100) * 4.02} 402`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">
                    {totais.caloriasKcal.toFixed(0)}
                  </span>
                  <span className="text-xs text-slate-500">
                    / {metas.caloriasKcal.toFixed(0)} kcal
                  </span>
                </div>
              </div>

              {/* Macros */}
              <div className="flex-1 w-full space-y-3">
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
            <CardTitle>Aderência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke={caloriesPercentage >= 80 ? '#10b981' : '#f59e0b'}
                    strokeWidth="10"
                    strokeDasharray={`${Math.min(caloriesPercentage, 100) * 3.14} 314`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-slate-900">
                  {caloriesPercentage}%
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                {refeicoes.length} refeições registradas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de refeições */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-600" />
            Refeições do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {refeicoes.length > 0 ? (
            <div className="space-y-4">
              {refeicoes.map((refeicao, index) => (
                <div
                  key={`${refeicao.tipoRefeicao}-${index}`}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  {/* Header da refeição */}
                  <div className="flex items-center justify-between p-4 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {TipoRefeicaoLabels[refeicao.tipoRefeicao] ?? 'Refeição'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {refeicao.horarioPlanejado ?? ''}{' '}
                          • {refeicao.consumido.energiaKcal.toFixed(0)} kcal
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Itens da refeição */}
                  {refeicao.registros && refeicao.registros.length > 0 && (
                    <div className="divide-y divide-slate-100">
                      {refeicao.registros.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 hover:bg-slate-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {item.nomeAlimento}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.quantidadeConsumidaG}g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">
                              {item.energiaKcal.toFixed(0)} kcal
                            </p>
                            <p className="text-xs text-slate-500">
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
            <div className="text-center py-12">
              <Utensils className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Nenhuma refeição registrada
              </h3>
              <p className="text-slate-500 mb-6">
                Registre o que você comeu hoje
              </p>
              <Link
                href="/diario/registrar"
                className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
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
