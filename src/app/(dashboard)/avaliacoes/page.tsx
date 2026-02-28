/**
 * @fileoverview Página de avaliações nutricionais.
 * 
 * Exibe o histórico de avaliações antropométricas:
 * - Lista de avaliações
 * - Comparativo entre avaliações
 * - Opção de criar nova avaliação
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ClipboardList,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Scale,
  Ruler,
  Activity,
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
import { nutritionalAssessmentService } from '@/services';
import { AvaliacaoResultadoDto } from '@/types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AvaliacoesPage() {
  const [assessments, setAssessments] = useState<AvaliacaoResultadoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        setError(null);

        const data = await nutritionalAssessmentService.listAssessments();
        setAssessments(data);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        setError('Não foi possível carregar as avaliações.');
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);

  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (!previous) return <Minus className="h-4 w-4 text-slate-400" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const latest = assessments[0];
  const previous = assessments[1];

  if (loading) {
    return <PageLoading message="Carregando avaliações..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Avaliações Nutricionais</h1>
          <p className="text-slate-500">
            Acompanhe sua composição corporal e evolução
          </p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Nova Avaliação
        </Link>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Última avaliação */}
      {latest && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <ClipboardList className="h-5 w-5" />
              Última Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">
              {format(new Date(latest.dataAvaliacao), "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Peso */}
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <Scale className="h-5 w-5 text-emerald-600" />
                  {getTrendIcon(latest.pesoKg, previous?.pesoKg)}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {latest.pesoKg.toFixed(1)} kg
                </p>
                <p className="text-sm text-slate-500">Peso</p>
              </div>

              {/* Altura */}
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <Ruler className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {latest.alturaCm.toFixed(0)} cm
                </p>
                <p className="text-sm text-slate-500">Altura</p>
              </div>

              {/* IMC */}
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  {getTrendIcon(latest.imc ?? 0, previous?.imc)}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {latest.imc?.toFixed(1) ?? '-'}
                </p>
                <p className="text-sm text-slate-500">IMC</p>
              </div>

              {/* Gordura corporal */}
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  {getTrendIcon(
                    latest.percentualGordura ?? 0,
                    previous?.percentualGordura
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {latest.percentualGordura?.toFixed(1) ?? '-'}%
                </p>
                <p className="text-sm text-slate-500">% Gordura</p>
              </div>
            </div>

            {/* Botão ver detalhes */}
            <div className="mt-6 flex justify-end">
              <Link
                href={`/avaliacoes/${latest.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 text-base font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Ver detalhes
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de avaliações */}
      {assessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhuma avaliação registrada
            </h3>
            <p className="text-slate-500 mb-6">
              Realize sua primeira avaliação nutricional
            </p>
            <Link
              href="/avaliacoes/nova"
              className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nova Avaliação
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      Data
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      Peso (kg)
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      IMC
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      % Gordura
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      Massa Magra (kg)
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment, index) => (
                    <tr
                      key={assessment.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-900">
                            {format(
                              new Date(assessment.dataAvaliacao),
                              'dd/MM/yyyy'
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {assessment.pesoKg.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {assessment.imc?.toFixed(1) ?? '-'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {assessment.percentualGordura?.toFixed(1) ?? '-'}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {assessment.massaMagraKg?.toFixed(1) ?? '-'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <Link
                          href={`/avaliacoes/${assessment.id}`}
                          className="text-emerald-600 hover:underline text-sm"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparativo */}
      {assessments.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Evolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <p>Gráfico de evolução disponível em breve...</p>
              <Link
                href="/progresso"
                className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-base font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Ver progresso completo
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
