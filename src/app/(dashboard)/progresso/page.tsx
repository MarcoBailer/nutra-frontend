/**
 * @fileoverview Página de progresso do usuário.
 * 
 * Exibe:
 * - Gráficos de evolução
 * - Histórico de peso
 * - Comparativo de avaliações
 * - Fotos de progresso
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Camera,
  Scale,
  Target,
  Activity,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  PageLoading,
  Alert,
} from '@/components/ui';
import { nutritionalAssessmentService, foodDiaryService } from '@/services';
import { AvaliacaoResultadoDto, RelatorioAdesaoDto } from '@/types/api';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProgressoPage() {
  const [assessments, setAssessments] = useState<AvaliacaoResultadoDto[]>([]);
  const [report, setReport] = useState<RelatorioAdesaoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [assessmentData, reportData] = await Promise.all([
          nutritionalAssessmentService.listAssessments().catch(() => []),
          foodDiaryService
            .getAdherenceReport(subDays(new Date(), 30), new Date())
            .catch(() => null),
        ]);

        setAssessments(assessmentData);
        setReport(reportData);
      } catch (err) {
        console.error('Erro ao carregar progresso:', err);
        setError('Não foi possível carregar os dados de progresso.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const latest = assessments[0];
  const first = assessments[assessments.length - 1];

  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (!previous) return <Minus className="h-4 w-4 text-slate-400" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const calculateDiff = (current: number, previous: number | undefined): string => {
    if (!previous) return '-';
    const diff = current - previous;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}`;
  };

  if (loading) {
    return <PageLoading message="Carregando progresso..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meu Progresso</h1>
          <p className="text-slate-500">
            Acompanhe sua evolução ao longo do tempo
          </p>
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
            href="/avaliacoes/nova"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
          >
            <Scale className="h-4 w-4" />
            Nova Avaliação
          </Link>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Resumo geral */}
      {latest && first && (
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-lg font-medium text-emerald-100 mb-1">
                  Progresso Total
                </h3>
                <p className="text-sm text-emerald-200">
                  De {format(new Date(first.dataAvaliacao), 'dd/MM/yyyy')} até{' '}
                  {format(new Date(latest.dataAvaliacao), 'dd/MM/yyyy')}
                </p>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {calculateDiff(latest.pesoKg, first.pesoKg)} kg
                  </p>
                  <p className="text-sm text-emerald-200">Peso</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {calculateDiff(
                      latest.percentualGordura ?? 0,
                      first.percentualGordura
                    )}
                    %
                  </p>
                  <p className="text-sm text-emerald-200">% Gordura</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {calculateDiff(
                      latest.massaMagraKg ?? 0,
                      first.massaMagraKg
                    )}{' '}
                    kg
                  </p>
                  <p className="text-sm text-emerald-200">Massa Magra</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Peso atual */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Scale className="h-8 w-8 text-emerald-600" />
              {latest &&
                assessments[1] &&
                getTrendIcon(latest.pesoKg, assessments[1].pesoKg)}
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {latest?.pesoKg.toFixed(1) ?? '-'} kg
            </p>
            <p className="text-sm text-slate-500">Peso atual</p>
          </CardContent>
        </Card>

        {/* IMC */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
              {latest &&
                assessments[1] &&
                getTrendIcon(latest.imc ?? 0, assessments[1].imc)}
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {latest?.imc?.toFixed(1) ?? '-'}
            </p>
            <p className="text-sm text-slate-500">IMC</p>
          </CardContent>
        </Card>

        {/* % Gordura */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-amber-600" />
              {latest &&
                assessments[1] &&
                getTrendIcon(
                  latest.percentualGordura ?? 0,
                  assessments[1].percentualGordura
                )}
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {latest?.percentualGordura?.toFixed(1) ?? '-'}%
            </p>
            <p className="text-sm text-slate-500">% Gordura</p>
          </CardContent>
        </Card>

        {/* Massa Magra */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-purple-600" />
              {latest &&
                assessments[1] &&
                getTrendIcon(
                  latest.massaMagraKg ?? 0,
                  assessments[1].massaMagraKg
                )}
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {latest?.massaMagraKg?.toFixed(1) ?? '-'} kg
            </p>
            <p className="text-sm text-slate-500">Massa Magra</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de evolução */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Evolução do Peso
          </CardTitle>
          <Link
            href="/avaliacoes"
            className="text-sm text-emerald-600 hover:underline flex items-center"
          >
            Ver avaliações
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {assessments.length >= 2 ? (
            <div className="h-64 flex items-center justify-center">
              {/* Visualização simplificada do gráfico */}
              <div className="w-full relative h-full">
                <div className="absolute inset-0 flex items-end justify-between gap-2 px-4 pb-8">
                  {assessments
                    .slice()
                    .reverse()
                    .slice(-7)
                    .map((assessment, index) => {
                      const minWeight = Math.min(
                        ...assessments.map((a) => a.pesoKg)
                      );
                      const maxWeight = Math.max(
                        ...assessments.map((a) => a.pesoKg)
                      );
                      const range = maxWeight - minWeight || 10;
                      const height =
                        ((assessment.pesoKg - minWeight) / range) * 150 + 20;

                      return (
                        <div
                          key={assessment.id}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full max-w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all"
                            style={{ height: `${height}px` }}
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            {format(
                              new Date(assessment.dataAvaliacao),
                              'dd/MM'
                            )}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Dados insuficientes
              </h3>
              <p className="text-slate-500 mb-6">
                É necessário ter pelo menos 2 avaliações para ver a evolução
              </p>
              <Link
                href="/avaliacoes/nova"
                className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Fazer avaliação
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relatório de consumo */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Consumo nos Últimos 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">
                  {report.mediaCaloriasDiarias?.toFixed(0) ?? '-'}
                </p>
                <p className="text-sm text-slate-500">Calorias/dia (média)</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {report.diasDentroMeta ?? '-'}
                </p>
                <p className="text-sm text-slate-500">Dias dentro da meta</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">
                  {report.percentualAderenciaMedia?.toFixed(0) ?? '-'}%
                </p>
                <p className="text-sm text-slate-500">Aderência ao plano</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {report.diasComRegistro ?? '-'}
                </p>
                <p className="text-sm text-slate-500">Dias registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fotos de progresso */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            Fotos de Progresso
          </CardTitle>
          <Link
            href="/diario/fotos"
            className="text-sm text-emerald-600 hover:underline flex items-center"
          >
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhuma foto registrada
            </h3>
            <p className="text-slate-500 mb-6">
              Registre fotos para acompanhar visualmente seu progresso
            </p>
            <Link
              href="/diario/fotos/adicionar"
              className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
            >
              <Camera className="h-4 w-4" />
              Adicionar foto
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
