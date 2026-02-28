/**
 * @fileoverview Página do perfil do usuário.
 * 
 * Permite visualizar e editar:
 * - Informações pessoais
 * - Perfil nutricional
 * - Preferências alimentares
 * - Biometria
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  Target,
  Utensils,
  Activity,
  Heart,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  PageLoading,
  Alert,
} from '@/components/ui';
import { accountService, userProfileService } from '@/services';
import { NutraUser, PerfilNutricionalDto } from '@/types/api';
import {
  ObjetivoLabels,
  GeneroLabels,
  NivelAtividadeLabels,
  PreferenciaAlimentarLabels,
} from '@/types/enums';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PerfilPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<NutraUser | null>(null);
  const [nutritionalProfile, setNutritionalProfile] = useState<PerfilNutricionalDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const [userData, nutProfile] = await Promise.all([
          accountService.getProfile(),
          userProfileService.getProfile().catch(() => null),
        ]);

        setProfile(userData);
        setNutritionalProfile(nutProfile);
        setEditForm({
          nome: userData.nomeCompleto ?? '',
          email: userData.email ?? '',
          telefone: userData.telefone ?? '',
        });
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Não foi possível carregar seu perfil.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      await accountService.updateProfile(editForm);

      setProfile((prev) =>
        prev ? { ...prev, ...editForm } : prev
      );
      setIsEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Não foi possível atualizar o perfil.');
    }
  };

  if (loading) {
    return <PageLoading message="Carregando perfil..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-500">Gerencie suas informações pessoais</p>
      </div>

      {/* Alertas */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Informações pessoais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Informações Pessoais
          </CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                value={editForm.nome}
                onChange={(e) =>
                  setEditForm({ ...editForm, nome: e.target.value })
                }
              />
              <Input
                label="E-mail"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
              <Input
                label="Telefone"
                value={editForm.telefone}
                onChange={(e) =>
                  setEditForm({ ...editForm, telefone: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Nome</p>
                  <p className="font-medium text-slate-900">
                    {profile?.nomeCompleto ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">E-mail</p>
                  <p className="font-medium text-slate-900">
                    {profile?.email ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telefone</p>
                  <p className="font-medium text-slate-900">
                    {profile?.telefone ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Data de nascimento</p>
                  <p className="font-medium text-slate-900">
                    {profile?.dataNascimento
                      ? format(new Date(profile.dataNascimento), 'dd/MM/yyyy')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Perfil nutricional */}
      {nutritionalProfile && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Perfil Nutricional
            </CardTitle>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Objetivo */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">
                    Objetivo
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {nutritionalProfile.objetivo
                    ? ObjetivoLabels[nutritionalProfile.objetivo]
                    : '-'}
                </p>
              </div>

              {/* Nível de atividade */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Atividade Física
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {nutritionalProfile.nivelAtividade
                    ? NivelAtividadeLabels[nutritionalProfile.nivelAtividade]
                    : '-'}
                </p>
              </div>

              {/* Gênero */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Gênero Biológico
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {nutritionalProfile.genero
                    ? GeneroLabels[nutritionalProfile.genero]
                    : '-'}
                </p>
              </div>
            </div>

            {/* Dados físicos */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-4">
                Dados Físicos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">
                    {nutritionalProfile.pesoAtualKg.toFixed(1)}
                  </p>
                  <p className="text-sm text-slate-500">Peso (kg)</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {nutritionalProfile.alturaCm.toFixed(0)}
                  </p>
                  <p className="text-sm text-slate-500">Altura (cm)</p>
                </div>
                {nutritionalProfile.pesoDesejadoKg && (
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">
                      {nutritionalProfile.pesoDesejadoKg.toFixed(1)}
                    </p>
                    <p className="text-sm text-slate-500">Peso desejado (kg)</p>
                  </div>
                )}
                {nutritionalProfile.percentualGorduraCorporal && (
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {nutritionalProfile.percentualGorduraCorporal.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500">Gordura corporal</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferência de dieta */}
      {nutritionalProfile?.preferenciaDieta && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              Preferências Alimentares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                {PreferenciaAlimentarLabels[nutritionalProfile.preferenciaDieta] ?? nutritionalProfile.preferenciaDieta}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alergias/Restrições */}
      {nutritionalProfile?.restricoesIds &&
        nutritionalProfile.restricoesIds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Alergias e Restrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {nutritionalProfile.restricoesIds.map((restricao) => (
                  <span
                    key={restricao}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {restricao}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Botão criar perfil se não existir */}
      {!nutritionalProfile && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Complete seu perfil nutricional
            </h3>
            <p className="text-slate-500 mb-6">
              Para melhores recomendações, preencha seu perfil nutricional
            </p>
            <Button>Preencher Perfil</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
