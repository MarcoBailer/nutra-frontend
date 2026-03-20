'use client';

import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    icon: 'XP',
    label: 'MISSOES DIARIAS',
    desc: 'OBJETIVOS CURTOS PARA BATER META DE AGUA, CALORIAS E CONSISTENCIA.',
  },
  {
    icon: 'HP',
    label: 'BARRAS EM TEMPO REAL',
    desc: 'MACROS E CONSUMO DO DIA ANIMADOS COM FEEDBACK VISUAL IMEDIATO.',
  },
  {
    icon: 'AP',
    label: 'PLANO ADAPTATIVO',
    desc: 'ROTINAS PERSONALIZADAS CONFORME META, NIVEL E DISPONIBILIDADE.',
  },
  {
    icon: 'LOG',
    label: 'DIARIO GAMEFICADO',
    desc: 'REGISTRO RAPIDO DE REFEICOES COM PROGRESSO DE EVOLUCAO.',
  },
  {
    icon: 'AI',
    label: 'ASSISTENCIA PROFISSIONAL',
    desc: 'INTEGRACAO COM NUTRICIONISTA E ACOMPANHAMENTO DE PERFIL.',
  },
  {
    icon: 'CRT',
    label: 'INTERFACE IMERSIVA',
    desc: 'ESTETICA FALLOUT MODERNA, CLARA E RESPONSIVA EM QUALQUER TELA.',
  },
];

const navItems = [
  { label: 'INICIO', href: '#' },
  { label: 'MODULOS', href: '#features' },
  { label: 'GAME LOOP', href: '#game-loop' },
  { label: 'ENTRAR', href: '/auth/login' },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="vault-page">
      <header className="vault-header">
        <div className="flex items-center gap-3">
          <span className="vault-chip">VAULT MODE</span>
          <span className="text-sm sm:text-base tracking-[0.2em] text-[#9dffbe] font-semibold">NUTRA 3000</span>
        </div>

        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden pip-btn"
          aria-label="Abrir menu"
        >
          MENU
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="pip-btn"
              style={{ textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/auth/login" className="pip-btn pip-btn-filled" style={{ textDecoration: 'none' }}>
            INICIAR
          </Link>
        </nav>
      </header>

      {menuOpen && (
        <div className="md:hidden px-4 pt-2 relative z-20">
          <div className="vault-panel p-3 flex flex-col gap-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="pip-btn"
                style={{ textDecoration: 'none', textAlign: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="relative z-10 px-4 sm:px-6 lg:px-10 pb-16">
        <section className="max-w-6xl mx-auto pt-12 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <div className="vault-panel p-6 sm:p-8 vault-reveal">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="vault-chip">FALLOUT INSPIRED</span>
                <span className="vault-chip">UI MODERNA</span>
                <span className="vault-chip">TOTALMENTE RESPONSIVA</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-widest text-[#d9ffe5] leading-tight">
                NUTRICAO COM CARA DE JOGO,
                <br />
                EXPERIENCIA DE PRODUTO PREMIUM.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-[#9ed7b2] leading-relaxed max-w-xl">
                A proposta combina o DNA do Pip-Boy com um layout limpo, atual e focado em engajamento.
                O cliente sente progresso a cada acao com missoes, barras animadas, recompensas e leitura facil.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth/login" className="pip-btn pip-btn-filled" style={{ textDecoration: 'none' }}>
                  COMECAR AGORA
                </Link>
                <a href="#features" className="pip-btn" style={{ textDecoration: 'none' }}>
                  VER MODULOS
                </a>
              </div>
            </div>

            <div className="vault-panel p-5 sm:p-6 flex flex-col gap-4 vault-reveal" style={{ animationDelay: '0.12s' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.14em] text-[#98ffc2]">PAINEL DE ENGAJAMENTO</span>
                <span className="text-xs text-[#ffd36b]">SEASON 01</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="vault-feature-card">
                  <p className="text-xs text-[#9ad2ae]">STREAK</p>
                  <p className="text-xl mt-1 text-[#c5ffd8]">14 DIAS</p>
                </div>
                <div className="vault-feature-card">
                  <p className="text-xs text-[#9ad2ae]">XP DIARIA</p>
                  <p className="text-xl mt-1 text-[#c5ffd8]">+240 XP</p>
                </div>
                <div className="vault-feature-card col-span-2">
                  <p className="text-xs text-[#9ad2ae]">MISSAO ATUAL</p>
                  <p className="text-base mt-1 text-[#d8ffe7]">COMPLETAR 5 REGISTROS DE REFEICAO</p>
                  <div className="pip-bar mt-3">
                    <div className="pip-bar-fill" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vaultboy.gif" alt="Vault Boy" className="pip-vault-boy pip-vault-boy-md vault-float" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sun.gif" alt="Vault Boy no sol" className="pip-vault-boy" style={{ width: '128px' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto mt-8 sm:mt-10 vault-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl tracking-[0.12em] text-[#c5ffda]">MODULOS DO ECOSSISTEMA</h2>
            <span className="vault-chip">UI GAMEFICADA + CLEAN</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((item, index) => (
              <article key={item.label} className="vault-feature-card vault-reveal" style={{ animationDelay: `${index * 0.06}s` }}>
                <div className="text-xs text-[#ffd36b] tracking-[0.12em]">{item.icon}</div>
                <h3 className="mt-2 text-sm sm:text-base text-[#deffea] tracking-[0.08em]">{item.label}</h3>
                <p className="mt-2 text-xs text-[#9ad2ae] leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="game-loop" className="max-w-6xl mx-auto mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { src: '/Strong.gif', label: 'EVOLUCAO', text: 'A CADA CHECK-IN, O CLIENTE SENTE O PROGRESSO NA TELA.' },
            { src: '/sleeping.gif', label: 'DESCANSO', text: 'ROTINA SUSTENTAVEL COM ALERTAS DE RITMO E ADERENCIA.' },
            { src: '/garden-of-eden.gif', label: 'CONSISTENCIA', text: 'A EXPERIENCIA PREMIA O COMPORTAMENTO CERTO NO LONGO PRAZO.' },
          ].map(card => (
            <article key={card.label} className="vault-panel p-4 sm:p-5">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt={card.label} className="pip-vault-boy" style={{ width: '82px' }} />
                <div>
                  <p className="text-xs tracking-[0.12em] text-[#ffd36b]">{card.label}</p>
                  <p className="text-xs text-[#9dd7b2] mt-1 leading-relaxed">{card.text}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="max-w-4xl mx-auto mt-10 sm:mt-12 text-center vault-panel p-6 sm:p-8">
          <p className="text-xs tracking-[0.15em] text-[#9cffc1]">PRONTO PARA GANHAR O CLIENTE COM EXPERIENCIA?</p>
          <h3 className="mt-3 text-2xl sm:text-3xl tracking-widest text-[#deffeb]">ATIVE O MODO NUTRA 3000</h3>
          <div className="mt-5 flex justify-center flex-wrap gap-3">
            <Link href="/auth/login" className="pip-btn pip-btn-filled" style={{ textDecoration: 'none' }}>
              ACESSAR PAINEL
            </Link>
            <a href="#" className="pip-btn" style={{ textDecoration: 'none' }}>
              VOLTAR AO TOPO
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
