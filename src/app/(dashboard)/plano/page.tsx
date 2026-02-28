/**
 * @fileoverview Página de listagem de planos alimentares.
 * 
 * Exibe todos os planos alimentares do usuário:
 * - Plano ativo destacado
 * - Histórico de planos
 * - Opção de criar novo plano
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Calendar,
  Target,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
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
import { mealPlanService } from '@/services';
import { PlanoAlimentarResultadoDto } from '@/types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TipoRefeicaoLabels } from '@/types/enums';

export default function PlanoPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanoAlimentarResultadoDto[]>([]);
  const [activePlan, setActivePlan] = useState<PlanoAlimentarResultadoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);

        const [allPlans, active] = await Promise.all([
          mealPlanService.listPlans(),
          mealPlanService.getActivePlan().catch(() => null),
        ]);

        setPlans(allPlans);
        setActivePlan(active);
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
        setError('Não foi possível carregar os planos alimentares.');
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  const handleActivatePlan = async (planId: number) => {
    try {
      await mealPlanService.activatePlan(planId);
      // Recarregar lista
      const [allPlans, active] = await Promise.all([
        mealPlanService.listPlans(),
        mealPlanService.getActivePlan().catch(() => null),
      ]);
      setPlans(allPlans);
      setActivePlan(active);
    } catch (err) {
      console.error('Erro ao ativar plano:', err);
      setError('Não foi possível ativar o plano.');
    }
  };

  const getStatusBadge = (plan: PlanoAlimentarResultadoDto) => {
    const isActive = activePlan?.id === plan.id;
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
        <Clock className="h-3 w-3" />
        Inativo
      </span>
    );
  };

  if (loading) {
    return <PageLoading message="Carregando planos alimentares..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planos Alimentares</h1>
          <p className="text-slate-500">
            Gerencie seus planos de alimentação personalizados
          </p>
        </div>
        <Link
          href="/plano/criar"
          className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Novo Plano
        </Link>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Plano ativo */}
      {activePlan && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Target className="h-5 w-5" />
              Plano Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {activePlan.nome ?? 'Plano Alimentar'}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(activePlan.criadoEm), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="h-4 w-4" />
                    {activePlan.refeicoes.length} refeições
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {activePlan.metasDiarias.caloriasKcal.toFixed(0)} kcal/dia
                  </span>
                </div>
              </div>
              <Link
                href={`/plano/${activePlan.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Ver detalhes
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Resumo das refeições */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {activePlan.refeicoes.map((refeicao) => (
                <div
                  key={refeicao.id}
                  className="bg-white p-3 rounded-lg border border-emerald-200 text-center"
                >
                  <p className="text-sm font-medium text-slate-900 mb-1 truncate">
                    {TipoRefeicaoLabels[refeicao.tipoRefeicao] ?? `Refeição ${refeicao.ordem + 1}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {refeicao.totalEnergiaKcal.toFixed(0)} kcal
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de planos */}
      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Utensils className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum plano alimentar
            </h3>
            <p className="text-slate-500 mb-6">
              Crie seu primeiro plano alimentar personalizado
            </p>
            <Link
              href="/plano/criar"
              className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Criar Plano
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Todos os Planos ({plans.length})
          </h2>
          
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/plano/${plan.id}`)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Utensils className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-900">
                            {plan.nome ?? 'Plano Alimentar'}
                          </h3>
                          {getStatusBadge(plan)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>
                            {format(new Date(plan.criadoEm), 'dd/MM/yyyy')}
                          </span>
                          <span>{plan.refeicoes.length} refeições</span>
                          <span>{plan.metasDiarias.caloriasKcal.toFixed(0)} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {activePlan?.id !== plan.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivatePlan(plan.id);
                          }}
                        >
                          Ativar
                        </Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
