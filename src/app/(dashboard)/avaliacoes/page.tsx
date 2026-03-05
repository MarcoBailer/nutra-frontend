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
    if (!previous) return <Minus className="h-4 w-4 text-text-muted" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-error" />;
    return <Minus className="h-4 w-4 text-text-muted" />;
  };

  const latest = assessments[0];
  const previous = assessments[1];

  if (loading) {
    return <PageLoading message="Carregando avaliações..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Avaliações Nutricionais</h1>
          <p className="text-text-muted">
            Acompanhe sua composição corporal e evolução
          </p>
        </div>
        <Link
          href="/avaliacoes/nova"
          className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-all duration-200"
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
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
              Última Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-text-muted mb-4">
              {format(new Date(latest.dataAvaliacao), "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Peso */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  {getTrendIcon(latest.pesoKg, previous?.pesoKg)}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary">
                  {latest.pesoKg.toFixed(1)} kg
                </p>
                <p className="text-xs sm:text-sm text-text-muted">Peso</p>
              </div>

              {/* Altura */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <Ruler className="h-4 w-4 sm:h-5 sm:w-5 text-info" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary">
                  {latest.alturaCm.toFixed(0)} cm
                </p>
                <p className="text-xs sm:text-sm text-text-muted">Altura</p>
              </div>

              {/* IMC */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  {getTrendIcon(latest.imc ?? 0, previous?.imc)}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary">
                  {latest.imc?.toFixed(1) ?? '-'}
                </p>
                <p className="text-xs sm:text-sm text-text-muted">IMC</p>
              </div>

              {/* Gordura corporal */}
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
                  {getTrendIcon(
                    latest.percentualGordura ?? 0,
                    previous?.percentualGordura
                  )}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary">
                  {latest.percentualGordura?.toFixed(1) ?? '-'}%
                </p>
                <p className="text-xs sm:text-sm text-text-muted">% Gordura</p>
              </div>
            </div>

            {/* Botão ver detalhes */}
            <div className="mt-6 flex justify-end">
              <Link
                href={`/avaliacoes/${latest.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 text-base font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-200"
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
          <CardContent className="py-8 sm:py-12 text-center">
            <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">
              Nenhuma avaliação registrada
            </h3>
            <p className="text-text-muted mb-6">
              Realize sua primeira avaliação nutricional
            </p>
            <Link
              href="/avaliacoes/nova"
              className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-all duration-200"
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
                  <tr className="border-b border-card-border">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      Data
                    </th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      Peso (kg)
                    </th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      IMC
                    </th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      % Gordura
                    </th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      Massa Magra (kg)
                    </th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-text-muted">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment, index) => (
                    <tr
                      key={assessment.id}
                      className="border-b border-card-border/50 hover:bg-background-secondary"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-text-muted" />
                          <span className="text-xs sm:text-sm text-text-primary">
                            {format(
                              new Date(assessment.dataAvaliacao),
                              'dd/MM/yyyy'
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-xs sm:text-sm font-medium text-text-primary">
                          {assessment.pesoKg.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-xs sm:text-sm font-medium text-text-primary">
                          {assessment.imc?.toFixed(1) ?? '-'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-xs sm:text-sm font-medium text-text-primary">
                          {assessment.percentualGordura?.toFixed(1) ?? '-'}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="text-xs sm:text-sm font-medium text-text-primary">
                          {assessment.massaMagraKg?.toFixed(1) ?? '-'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <Link
                          href={`/avaliacoes/${assessment.id}`}
                          className="text-primary hover:underline text-xs sm:text-sm"
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
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Evolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-text-muted">
              <p>Gráfico de evolução disponível em breve...</p>
              <Link
                href="/progresso"
                className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-base font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-200"
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
