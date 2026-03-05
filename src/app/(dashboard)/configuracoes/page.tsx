/**
 * @fileoverview Página de configurações do usuário.
 * 
 * Permite configurar:
 * - Preferências de notificação
 * - Unidades de medida
 * - Tema
 * - Privacidade
 */

'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Trash2,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
} from '@/components/ui';
import { accountService } from '@/services';

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    daily: true,
    weekly: false,
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeactivateAccount = async () => {
    if (
      !confirm(
        'Tem certeza que deseja desativar sua conta? Você poderá reativá-la depois.'
      )
    ) {
      return;
    }

    try {
      setDeactivating(true);
      setError(null);

      await accountService.deactivateAccount();

      // Fazer logout
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Erro ao desativar conta:', err);
      setError('Não foi possível desativar a conta.');
      setDeactivating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Configurações</h1>
        <p className="text-text-muted">Personalize sua experiência</p>
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

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Notificações por e-mail</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Receba atualizações importantes por e-mail
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleToggle('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Notificações push</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Receba lembretes no navegador
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleToggle('push')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Resumo diário</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Receba um resumo do seu progresso todos os dias
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.daily}
                onChange={() => handleToggle('daily')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Relatório semanal</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Receba um relatório semanal por e-mail
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weekly}
                onChange={() => handleToggle('weekly')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-primary bg-primary/10'
                  : 'border-card-border hover:border-text-muted'
              }`}
            >
              <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              <span className="text-xs sm:text-sm font-medium">Claro</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10'
                  : 'border-card-border hover:border-text-muted'
              }`}
            >
              <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-text-secondary" />
              <span className="text-xs sm:text-sm font-medium">Escuro</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                theme === 'system'
                  ? 'border-primary bg-primary/10'
                  : 'border-card-border hover:border-text-muted'
              }`}
            >
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-info" />
              <span className="text-xs sm:text-sm font-medium">Sistema</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Privacidade e Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Perfil público</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Permitir que nutricionistas vejam seu perfil
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-primary">Dados anônimos</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Contribuir com dados anônimos para pesquisa
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-card-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Zona de perigo */}
      <Card className="border-error/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error">
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-error/10 rounded-lg">
            <div>
              <p className="font-medium text-error">Desativar conta</p>
              <p className="text-xs sm:text-sm text-error/80">
                Sua conta será desativada temporariamente
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeactivateAccount}
              disabled={deactivating}
            >
              {deactivating ? 'Desativando...' : 'Desativar'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 bg-background-secondary rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Sair da conta</p>
              <p className="text-xs sm:text-sm text-text-muted">
                Encerrar sessão neste dispositivo
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
