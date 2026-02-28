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
import { Button } from '@/components/ui';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Nutra</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Entrar
              </Link>
              <Button as={Link} href="/auth/login" size="sm">
                Começar agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Sua jornada para uma{' '}
            <span className="text-emerald-600">vida mais saudável</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Controle sua alimentação, acompanhe seu progresso e alcance seus
            objetivos nutricionais com o Nutra. Uma plataforma completa para
            cuidar da sua saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as={Link} href="/auth/login" size="lg">
              Começar gratuitamente
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <Button as={Link} href="#funcionalidades" variant="outline" size="lg">
              Conheça mais
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl font-bold text-emerald-600">10.000+</p>
              <p className="text-sm text-slate-500">Alimentos cadastrados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">5.000+</p>
              <p className="text-sm text-slate-500">Usuários ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">500+</p>
              <p className="text-sm text-slate-500">Nutricionistas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">4.9/5</p>
              <p className="text-sm text-slate-500">Avaliação dos usuários</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ferramentas completas para controlar sua alimentação e alcançar
              seus objetivos de saúde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Por que escolher o Nutra?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                O Nutra foi desenvolvido com base em ciência nutricional e
                feedback de profissionais da área, garantindo uma experiência
                completa e confiável.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Comece sua jornada hoje
              </h3>
              <p className="text-emerald-100 mb-6">
                Cadastre-se gratuitamente e tenha acesso a todas as
                funcionalidades básicas. Upgrade para o plano premium quando
                quiser mais recursos.
              </p>
              <Button
                as={Link}
                href="/auth/login"
                variant="secondary"
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50"
              >
                Criar conta gratuita
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para transformar sua saúde?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Junte-se a milhares de pessoas que já estão alcançando seus
            objetivos com o Nutra. Comece agora e veja a diferença.
          </p>
          <Button as={Link} href="/auth/login" size="lg">
            Começar gratuitamente
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nutra</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Nutra. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                Termos
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-500 hover:text-white transition-colors"
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
