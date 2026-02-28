# Nutra Frontend

Frontend Next.js para o sistema nutricional Nutra. Consome a API .NET Nutra e integra autenticação via OpenID Connect com o web_site_service.

## Tecnologias

- **Next.js 16.x** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **NextAuth.js** - Autenticação OAuth/OIDC
- **React Query** - Gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado do cliente
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## Estrutura do Projeto

```
src/
├── app/                          # App Router pages
│   ├── (dashboard)/              # Rotas protegidas com layout
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── busca/                # Busca de alimentos
│   │   ├── plano/                # Planos alimentares
│   │   ├── diario/               # Diário alimentar
│   │   ├── avaliacoes/           # Avaliações nutricionais
│   │   ├── progresso/            # Acompanhamento de progresso
│   │   ├── perfil/               # Perfil do usuário
│   │   └── configuracoes/        # Configurações
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login/
│   │   ├── logout/
│   │   └── error/
│   └── api/auth/                 # API routes do NextAuth
├── components/
│   ├── ui/                       # Componentes de UI reutilizáveis
│   ├── layout/                   # Sidebar, Header
│   └── providers/                # Context providers
├── services/                     # Camada de serviços (API calls)
├── types/                        # Tipos TypeScript e DTOs
├── hooks/                        # Custom hooks
└── lib/                          # Utilitários (auth, api-client)
```

## Autenticação

### Fluxo de Autenticação (OpenID Connect)

O sistema utiliza OpenID Connect para autenticação federada com o `web_site_service`:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌────────────┐
│   Browser    │────▶│ Nutra Front  │────▶│ web_site_service │────▶│  Nutra API │
│   (User)     │◀────│  (NextAuth)  │◀────│   (Identity)     │◀────│            │
└──────────────┘     └──────────────┘     └──────────────────┘     └────────────┘
```

1. **Usuário acessa rota protegida** → Middleware redireciona para `/auth/login`
2. **Login inicia** → NextAuth redireciona para o Authorization Server (web_site_service)
3. **Usuário autentica** → web_site_service autentica e redireciona de volta com code
4. **Troca de tokens** → NextAuth troca code por access_token e id_token
5. **Sessão criada** → Tokens são armazenados na sessão/JWT do NextAuth
6. **Requisições à API** → access_token é incluído no header Authorization

### Configuração NextAuth

O arquivo `src/lib/auth.ts` contém a configuração completa:

```typescript
// Fluxo de tokens
callbacks: {
  jwt: async ({ token, account, user }) => {
    // Primeiro login - armazena tokens do OIDC provider
    if (account && user) {
      token.accessToken = account.access_token;
      token.refreshToken = account.refresh_token;
      token.idToken = account.id_token;
      token.expiresAt = account.expires_at;
      token.roles = user.roles ?? [];
    }
    
    // Verifica expiração e renova se necessário
    if (Date.now() < (token.expiresAt ?? 0) * 1000) {
      return token;
    }
    
    return await refreshAccessToken(token);
  },
  session: async ({ session, token }) => {
    // Disponibiliza token e roles na sessão
    session.accessToken = token.accessToken;
    session.user.roles = token.roles;
    session.error = token.error;
    return session;
  }
}
```

### Proteção de Rotas

O middleware (`src/middleware.ts`) protege rotas automaticamente:

```typescript
export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Rotas de nutricionista
      if (req.nextUrl.pathname.startsWith('/pacientes')) {
        return token?.roles?.includes('Nutricionista');
      }
      // Qualquer usuário autenticado
      return !!token;
    }
  }
});
```

### Uso nos Componentes

```typescript
// Client component
'use client';
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  
  // Acessar token
  const token = session?.accessToken;
  
  // Verificar roles
  const isNutricionista = session?.user?.roles?.includes('Nutricionista');
}
```

```typescript
// Server component
import { auth } from '@/lib/auth';

async function ServerComponent() {
  const session = await auth();
  const user = session?.user;
}
```

## Serviços da API

Cada service corresponde a um controller da API Nutra:

| Serviço | Arquivo | Endpoints |
|---------|---------|-----------|
| Account | `account.service.ts` | Perfil, ativar/desativar conta |
| User Profile | `user-profile.service.ts` | Perfil nutricional, preferências, biometria |
| Food Search | `food-search.service.ts` | Busca em TBCA, Fabricantes, FastFood |
| Meal Plan | `meal-plan.service.ts` | CRUD planos, refeições, itens |
| Food Diary | `food-diary.service.ts` | Registro diário, fotos, relatórios |
| Nutritional Assessment | `nutritional-assessment.service.ts` | Avaliações antropométricas |
| Quick Meal | `quick-meal.service.ts` | Refeições rápidas, status diário |

### Uso dos Serviços

```typescript
import { mealPlanService, foodSearchService } from '@/services';

// Buscar plano ativo
const plan = await mealPlanService.getActivePlan();

// Buscar alimentos
const foods = await foodSearchService.search('arroz', ETipoTabela.TBCA);
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```bash
# ==============================================
# NUTRA FRONTEND - VARIÁVEIS DE AMBIENTE
# ==============================================
# Copie este arquivo para .env.local e preencha os valores

# URL da API Nutra
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# URL interna da API (para SSR)
API_URL=http://nutra-api:5000/api

# ==============================================
# AUTENTICAÇÃO (OpenID Connect)
# ==============================================
# URL base da aplicação
NEXTAUTH_URL=http://localhost:3000

# Secret para criptografia de cookies/JWT (gerar com: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here

# Client ID registrado no web_site_service
OIDC_CLIENT_ID=nutra-frontend

# Client Secret
OIDC_CLIENT_SECRET=your-client-secret

# URL do Authorization Server (web_site_service)
OIDC_ISSUER=https://auth.yourdomain.com

# ==============================================
# GITHUB ACTIONS SECRETS (para CI/CD)
# ==============================================
# Configure estes valores no GitHub Secrets:
# - NEXT_PUBLIC_API_URL
# - API_URL
# - NEXTAUTH_URL
# - NEXTAUTH_SECRET
# - OIDC_CLIENT_ID
# - OIDC_CLIENT_SECRET
# - OIDC_ISSUER
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
```

## Docker

```dockerfile
# Build
docker build -t nutra-frontend .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api.example.com/api \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e OIDC_CLIENT_ID=nutra-frontend \
  -e OIDC_CLIENT_SECRET=secret \
  -e OIDC_ISSUER=https://auth.example.com \
  nutra-frontend
```

## Principais Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública |
| `/auth/login` | Página de login (redireciona para OIDC) |
| `/dashboard` | Dashboard principal com resumo do dia |
| `/busca` | Busca de alimentos |
| `/plano` | Gerenciamento de planos alimentares |
| `/diario` | Diário alimentar diário |
| `/avaliacoes` | Avaliações nutricionais |
| `/progresso` | Acompanhamento de evolução |
| `/perfil` | Perfil do usuário |
| `/configuracoes` | Configurações da conta |

## Componentes UI

O projeto inclui componentes reutilizáveis em `src/components/ui/`:

- **Button** - Botão com variantes (primary, secondary, outline, ghost, danger)
- **Card** - Container com header, content, footer
- **Input** - Campo de entrada com label e validação
- **MacroProgress** - Barra de progresso para macronutrientes
- **Alert** - Mensagens de feedback
- **Loading** - Spinners e skeletons

## Contribuição

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure `.env.local`
4. Rode o dev server: `npm run dev`

## Licença

Projeto privado - Todos os direitos reservados.
