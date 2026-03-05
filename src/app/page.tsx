/**
 * @fileoverview Página inicial (landing page) do Nutra.
 * 
 * Exibe:
 * - Hero section com call-to-action
 * - Funcionalidades principais
 * - Benefícios
 * - Call-to-action para login/cadastro
 */

import Link from 'next/link';
import {
  Target,
  Utensils,
  TrendingUp,
  Scale,
  Users,
  Smartphone,
  ChevronRight,
  Check,
} from 'lucide-react';
import { getButtonStyles } from '@/components/ui';

export default function HomePage() {
  const features = [
    {
      icon: Utensils,
      title: 'Diário Alimentar',
      description:
        'Registre suas refeições e acompanhe seu consumo de calorias e macros em tempo real.',
    },
    {
      icon: Target,
      title: 'Planos Personalizados',
      description:
        'Crie planos alimentares adaptados aos seus objetivos e preferências.',
    },
    {
      icon: Scale,
      title: 'Avaliações Nutricionais',
      description:
        'Acompanhe sua composição corporal com avaliações antropométricas completas.',
    },
    {
      icon: TrendingUp,
      title: 'Progresso Visual',
      description:
        'Visualize sua evolução com gráficos e métricas detalhadas.',
    },
    {
      icon: Users,
      title: 'Acompanhamento Profissional',
      description:
        'Conecte-se com nutricionistas para um acompanhamento personalizado.',
    },
    {
      icon: Smartphone,
      title: 'Acesso Mobile',
      description:
        'Acesse de qualquer lugar com nossa interface responsiva.',
    },
  ];

  const benefits = [
    'Banco de alimentos com milhares de opções',
    'Cálculo automático de macros e micronutrientes',
    'Sugestões inteligentes de refeições',
    'Relatórios detalhados de consumo',
    'Integração com profissionais de nutrição',
    'Lembretes e notificações personalizadas',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-text-primary">Nutra</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/auth/login"
                className="text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Entrar
              </Link>
              <Link href="/auth/login" className={getButtonStyles({ size: 'sm' })}>
                <span className="hidden xs:inline">Começar agora</span>
                <span className="xs:hidden">Começar</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-4 sm:mb-6">
            Sua jornada para uma{' '}
            <span className="text-primary">vida mais saudável</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto mb-6 sm:mb-10">
            Controle sua alimentação, acompanhe seu progresso e alcance seus
            objetivos nutricionais com o Nutra. Uma plataforma completa para
            cuidar da sua saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/auth/login" className={getButtonStyles({ size: 'lg' })}>
              Começar gratuitamente
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
            </Link>
            <Link href="#funcionalidades" className={getButtonStyles({ variant: 'outline', size: 'lg' })}>
              Conheça mais
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">10.000+</p>
              <p className="text-xs sm:text-sm text-text-muted">Alimentos cadastrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">5.000+</p>
              <p className="text-xs sm:text-sm text-text-muted">Usuários ativos</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">500+</p>
              <p className="text-xs sm:text-sm text-text-muted">Nutricionistas</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">4.9/5</p>
              <p className="text-xs sm:text-sm text-text-muted">Avaliação dos usuários</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-sm sm:text-lg text-text-secondary max-w-2xl mx-auto">
              Ferramentas completas para controlar sua alimentação e alcançar
              seus objetivos de saúde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-4 sm:p-6 rounded-xl border border-card-border hover:shadow-lg transition-shadow"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-4 sm:mb-6">
                Por que escolher o Nutra?
              </h2>
              <p className="text-sm sm:text-lg text-text-secondary mb-6 sm:mb-8">
                O Nutra foi desenvolvido com base em ciência nutricional e
                feedback de profissionais da área, garantindo uma experiência
                completa e confiável.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <span className="text-sm sm:text-base text-text-secondary">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-6 sm:p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">
                Comece sua jornada hoje
              </h3>
              <p className="text-emerald-100 mb-6">
                Cadastre-se gratuitamente e tenha acesso a todas as
                funcionalidades básicas. Upgrade para o plano premium quando
                quiser mais recursos.
              </p>
              <Link
                href="/auth/login"
                className={getButtonStyles({
                  variant: 'secondary',
                  size: 'lg',
                  className: 'bg-white text-emerald-600 hover:bg-emerald-50',
                })}
              >
                Criar conta gratuita
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para transformar sua saúde?
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 mb-6 sm:mb-8">
            Junte-se a milhares de pessoas que já estão alcançando seus
            objetivos com o Nutra. Comece agora e veja a diferença.
          </p>
          <Link href="/auth/login" className={getButtonStyles({ size: 'lg' })}>
            Começar gratuitamente
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Nutra</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 text-center">
              © {new Date().getFullYear()} Nutra. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-xs sm:text-sm text-slate-500 hover:text-white transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-xs sm:text-sm text-slate-500 hover:text-white transition-colors"
              >
                Termos
              </Link>
              <Link
                href="#"
                className="text-xs sm:text-sm text-slate-500 hover:text-white transition-colors"
              >
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
