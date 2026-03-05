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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Meu Perfil</h1>
        <p className="text-sm sm:text-base text-text-secondary">Gerencie suas informações pessoais</p>
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
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Informações Pessoais
          </CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          ) : (
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Cancelar</span>
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Salvar</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-background-secondary flex items-center justify-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-text-muted">Nome</p>
                  <p className="text-sm sm:text-base font-medium text-text-primary">
                    {profile?.nomeCompleto ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-background-secondary flex items-center justify-center">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-text-muted">E-mail</p>
                  <p className="text-sm sm:text-base font-medium text-text-primary">
                    {profile?.email ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-background-secondary flex items-center justify-center">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-text-muted">Telefone</p>
                  <p className="text-sm sm:text-base font-medium text-text-primary">
                    {profile?.telefone ?? '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-background-secondary flex items-center justify-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-text-muted">Data de nascimento</p>
                  <p className="text-sm sm:text-base font-medium text-text-primary">
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Perfil Nutricional
            </CardTitle>
            <Button variant="outline" size="sm">
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Editar</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
              {/* Objetivo */}
              <div className="bg-primary/10 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">
                    Objetivo
                  </span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-text-primary">
                  {nutritionalProfile.objetivo
                    ? ObjetivoLabels[nutritionalProfile.objetivo]
                    : '-'}
                </p>
              </div>

              {/* Nível de atividade */}
              <div className="bg-info/10 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-info" />
                  <span className="text-xs sm:text-sm font-medium text-info">
                    Atividade Física
                  </span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-text-primary">
                  {nutritionalProfile.nivelAtividade
                    ? NivelAtividadeLabels[nutritionalProfile.nivelAtividade]
                    : '-'}
                </p>
              </div>

              {/* Gênero */}
              <div className="bg-purple-500/10 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium text-purple-500">
                    Gênero Biológico
                  </span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-text-primary">
                  {nutritionalProfile.genero
                    ? GeneroLabels[nutritionalProfile.genero]
                    : '-'}
                </p>
              </div>
            </div>

            {/* Dados físicos */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-card-border">
              <h4 className="text-xs sm:text-sm font-medium text-text-secondary mb-3 sm:mb-4">
                Dados Físicos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-background-secondary rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {nutritionalProfile.pesoAtualKg.toFixed(1)}
                  </p>
                  <p className="text-xs sm:text-sm text-text-muted">Peso (kg)</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-background-secondary rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-info">
                    {nutritionalProfile.alturaCm.toFixed(0)}
                  </p>
                  <p className="text-xs sm:text-sm text-text-muted">Altura (cm)</p>
                </div>
                {nutritionalProfile.pesoDesejadoKg && (
                  <div className="text-center p-2 sm:p-3 bg-background-secondary rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-warning">
                      {nutritionalProfile.pesoDesejadoKg.toFixed(1)}
                    </p>
                    <p className="text-xs sm:text-sm text-text-muted">Peso desejado (kg)</p>
                  </div>
                )}
                {nutritionalProfile.percentualGorduraCorporal && (
                  <div className="text-center p-2 sm:p-3 bg-background-secondary rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-purple-500">
                      {nutritionalProfile.percentualGorduraCorporal.toFixed(1)}%
                    </p>
                    <p className="text-xs sm:text-sm text-text-muted">Gordura corporal</p>
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Preferências Alimentares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm">
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
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-error" />
                Alergias e Restrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {nutritionalProfile.restricoesIds.map((restricao) => (
                  <span
                    key={restricao}
                    className="px-2 sm:px-3 py-1 bg-error/10 text-error rounded-full text-xs sm:text-sm"
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
          <CardContent className="py-8 sm:py-12 text-center">
            <Target className="h-10 w-10 sm:h-12 sm:w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">
              Complete seu perfil nutricional
            </h3>
            <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6">
              Para melhores recomendações, preencha seu perfil nutricional
            </p>
            <Button>Preencher Perfil</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
