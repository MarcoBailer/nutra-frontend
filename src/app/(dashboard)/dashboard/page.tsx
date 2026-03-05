/**
 * @fileoverview Página principal do dashboard.
 * 
 * Exibe um resumo do status nutricional do dia:
 * - Progresso de calorias e macros
 * - Refeições do dia
 * - Atalhos rápidos
 * - Resumo do plano alimentar
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Utensils,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Search,
  ChevronRight,
  Droplets,
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
  Skeleton,
} from '@/components/ui';
import { quickMealService, mealPlanService } from '@/services';
import { StatusDiarioDto, PlanoAlimentarResultadoDto } from '@/types/api';
import { TipoRefeicaoLabels, ETipoRefeicao } from '@/types/enums';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dailyStatus, setDailyStatus] = useState<StatusDiarioDto | null>(null);
  const [activePlan, setActivePlan] = useState<PlanoAlimentarResultadoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Carregar dados em paralelo
        const [statusData, planData] = await Promise.all([
          quickMealService.getDailyStatus().catch(() => null),
          mealPlanService.getActivePlan().catch(() => null),
        ]);

        setDailyStatus(statusData);
        setActivePlan(planData);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <PageLoading message="Carregando seu dashboard..." />;
  }

  const userName = session?.user?.name?.split(' ')[0] ?? 'Usuário';
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  // Dados padrão se não houver status
  const stats = dailyStatus ?? {
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

  const caloriesPercentage = stats.caloriasAlvo > 0
    ? Math.round((stats.caloriasConsumidas / stats.caloriasAlvo) * 100)
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            Olá, {userName}! 👋
          </h1>
          <p className="text-text-muted text-sm sm:text-base capitalize">{today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/busca"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary-background transition-all duration-200"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Buscar alimento
          </Link>
          <Link
            href="/diario/registrar"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Registrar refeição
          </Link>
        </div>
      </div>

      {/* Alerta de erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorias */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Resumo do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              {/* Círculo de calorias */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    className="stroke-background-tertiary"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={caloriesPercentage > 100 ? 'var(--error)' : 'var(--primary)'}
                    strokeWidth="12"
                    strokeDasharray={`${Math.min(caloriesPercentage, 100) * 2.8} 280`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-text-primary">
                    {stats.caloriasConsumidas.toFixed(0)}
                  </span>
                  <span className="text-xs sm:text-sm text-text-muted">
                    / {stats.caloriasAlvo.toFixed(0)} kcal
                  </span>
                </div>
              </div>

              {/* Macros */}
              <div className="flex-1 w-full space-y-4">
                <MacroProgress
                  label="Proteína"
                  current={stats.proteinaConsumidaG}
                  target={stats.proteinaAlvoG}
                  unit="g"
                  color="blue"
                />
                <MacroProgress
                  label="Carboidratos"
                  current={stats.carboidratoConsumidoG}
                  target={stats.carboidratoAlvoG}
                  unit="g"
                  color="amber"
                />
                <MacroProgress
                  label="Gorduras"
                  current={stats.gorduraConsumidaG}
                  target={stats.gorduraAlvoG}
                  unit="g"
                  color="purple"
                />
                <MacroProgress
                  label="Fibras"
                  current={stats.fibraConsumidaG}
                  target={stats.fibraAlvoG}
                  unit="g"
                  color="emerald"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidratação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              Hidratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-accent-background rounded-b-3xl rounded-t-lg border-2 border-accent overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent to-info transition-all duration-500"
                  style={{
                    height: `${Math.min((stats.aguaConsumidaL / stats.aguaAlvoL) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-text-primary">
                {stats.aguaConsumidaL.toFixed(1)}L
              </p>
              <p className="text-xs sm:text-sm text-text-muted">
                Meta: {stats.aguaAlvoL.toFixed(1)}L
              </p>
              <Button variant="outline" size="sm" className="mt-3 sm:mt-4 w-full">
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Adicionar água
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas e plano */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Refeições do dia */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Refeições de Hoje
            </CardTitle>
            <Link
              href="/diario"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center"
            >
              Ver todas
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {activePlan ? (
              <div className="space-y-2 sm:space-y-3">
                {activePlan.refeicoes.slice(0, 4).map((refeicao) => (
                  <Link
                    key={refeicao.id}
                    href={`/diario/registrar?refeicao=${refeicao.tipoRefeicao}`}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base text-text-primary">
                          {TipoRefeicaoLabels[refeicao.tipoRefeicao as ETipoRefeicao]}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted">
                          {refeicao.horarioSugerido ?? 'Horário livre'} •{' '}
                          {refeicao.totalEnergiaKcal.toFixed(0)} kcal
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-text-muted" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Utensils className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-3" />
                <p className="text-sm sm:text-base text-text-secondary mb-4">
                  Você ainda não tem um plano alimentar ativo.
                </p>
                <Link
                  href="/plano/criar"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  Criar plano alimentar
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atalhos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Link
                href="/diario/registrar"
                className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary text-center">
                  Registrar Refeição
                </span>
              </Link>

              <Link
                href="/busca"
                className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-info/10 hover:bg-info/20 transition-colors"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-info" />
                <span className="text-xs sm:text-sm font-medium text-info text-center">
                  Buscar Alimento
                </span>
              </Link>

              <Link
                href="/avaliacoes/nova"
                className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
              >
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                <span className="text-xs sm:text-sm font-medium text-purple-500 text-center">
                  Nova Avaliação
                </span>
              </Link>

              <Link
                href="/progresso"
                className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-warning/10 hover:bg-warning/20 transition-colors"
              >
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
                <span className="text-xs sm:text-sm font-medium text-warning text-center">
                  Ver Progresso
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico recente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Atividade Recente
          </CardTitle>
          <Link
            href="/diario"
            className="text-xs sm:text-sm text-primary hover:underline flex items-center"
          >
            Ver histórico
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8 text-text-secondary">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-3" />
            <p className="text-sm sm:text-base">Comece a registrar suas refeições para ver seu histórico aqui.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
