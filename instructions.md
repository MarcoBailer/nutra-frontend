# Nutra Frontend - Technical Documentation

## 1. Project Overview

Next.js 16.1.6 application with React 19.2.3, TypeScript, and Tailwind CSS 4 for nutritional tracking and management. Features a Fallout/Pip-Boy inspired UI theme. Integrates with:
- **nutra-api** (.NET 9) — REST API for food data, meal plans, assessments
- **shark-lock** (web-auth) — OpenID Connect identity provider

### Key Dependencies
- **next-auth** ^4.24.13 — Authentication
- **@tanstack/react-query** ^5.90.21 — Server state (configured, not heavily used yet)
- **axios** ^1.13.6 — HTTP client
- **zustand** ^5.0.11 — Client state (declared, not currently used)
- **redis** ^4.7.0 — Session storage backend
- **date-fns** ^4.1.0 — Date formatting
- **lucide-react** — Icons

---

## 2. Authentication Architecture

### NextAuth.js Configuration (`src/lib/auth.ts`)

**Provider**: OpenID Connect via `web-site-service`
- Discovery: `${OIDC_ISSUER}/.well-known/openid-configuration`
- Scopes: `openid profile email roles nutra-api offline_access`
- Security: PKCE + state checks enabled
- Profile mapping: extracts `sub`, `name`, `email`, `roles` from OIDC claims
- Custom pages: `/auth/login`, `/auth/logout`, `/auth/error`

### Why Redis Instead of JWT Cookies

OAuth tokens (access_token + refresh_token + user data + roles) exceed the 4096-byte HTTP cookie limit. This caused chunking errors and session inconsistencies.

**Solution**: Custom Redis adapter stores full session data server-side. The browser cookie contains only a small `sessionToken` reference (~100 bytes).

```
Browser Cookie: sessionToken (100 bytes)
    ↓
Redis: next-auth:session:{sessionToken} → full session data
Redis: next-auth:account:data:{accountId} → OAuth tokens (access_token, refresh_token, expires_at)
Redis: next-auth:user:{userId} → user profile
```

### Session Configuration
- **Strategy**: JWT (lightweight in cookie) + Redis (backend storage)
- **Max age**: 30 days
- **Update age**: 24 hours
- **Refetch interval**: 5 minutes (client-side via SessionProvider)
- **Refetch on window focus**: true

### Token Refresh Mechanism

Automatic refresh happens in the `session` callback, transparent to the frontend:

```
Session callback fires (every 5 min or on window focus)
    ↓
getValidAccessToken(userId)
    ↓
Read account data from Redis → check expires_at
    ↓
If expires_at <= now + 60 seconds:
    ↓
    refreshAccessToken(userId)
        → POST to OIDC token endpoint with refresh_token grant
        → Store new tokens in Redis
        → Return new access_token
    ↓
If refresh fails:
    → session.error = 'RefreshAccessTokenError'
    → Frontend should redirect to login
```

### Callback Chain

1. **signIn** — After OIDC login succeeds. Persists OAuth account data (access_token, refresh_token, expires_at) to Redis via `upsertOAuthAccountData()`. Returns `true` to continue.

2. **jwt** — On every session access. Populates the JWT token with `userId`, `roles`, `name`, `email` from the user object.

3. **session** — On every session read. Calls `getValidAccessToken()` which auto-refreshes if expired. Exposes `session.accessToken` and `session.user.roles` to the frontend.

4. **redirect** — Controls post-login redirect. Allows relative URLs and same-domain absolute URLs.

### Logout
The `signOut` event clears OAuth data from Redis (`deleteOAuthAccountData`), removing the stored tokens.

### Redis Adapter (`src/lib/adapters/redis.ts`)
Custom NextAuth adapter implementing the Adapter interface:
- User CRUD with email indexing
- Session management with automatic TTL (30 days)
- OAuth account linking and token persistence
- All data serialized as JSON in Redis

---

## 3. Server vs Client Components

### Server Components
- **Root layout** (`src/app/layout.tsx`): Renders HTML, metadata, wraps children with providers
- **API routes**: Use `getServerSession(authOptions)` for server-side token access

### Client Components
- **All page components**: Marked `'use client'` — fetch data via services + useEffect
- **Dashboard layout**: Uses `useSession()` for user data, renders Pip-Boy chrome (header, nav, macro bars footer)
- **Providers**: AuthSessionProvider, QueryProvider, ThemeProvider are `'use client'` components that wrap the server-rendered layout

### Provider Architecture
```
RootLayout (Server)
  └── ThemeProvider (Client)
      └── AuthSessionProvider (Client) ← SessionProvider with refetchInterval=5min
          └── QueryProvider (Client) ← QueryClient with staleTime=5min
              └── {children}
```

### Server-Side API Calls
For SSR or API routes that need to call nutra-api:
```typescript
const session = await getServerSession(authOptions);
// session.accessToken is already refreshed by the session callback
const response = await axios.get(NUTRA_API_URL + '/api/endpoint', {
  headers: { Authorization: `Bearer ${session.accessToken}` }
});
```

---

## 4. Middleware & Route Protection (`src/middleware.ts`)

NextAuth `withAuth` middleware wrapper. Routes are matched by prefix:

### Protected (requires authentication)
`/dashboard/*`, `/diario/*`, `/plano/*`, `/busca/*`, `/avaliacoes/*`, `/progresso/*`, `/perfil/*`, `/configuracoes/*`, `/onboarding/*`

### Role-Based
- `/pacientes/*`, `/clinicas/*` → requires `Nutricionista` or `Admin` role
- `/admin/*` → requires `Admin` role
- Unauthorized users redirected to `/dashboard`

### Public (no middleware)
`/`, `/auth/*`, `/api/auth/*`, `/_next/*`, static assets

---

## 5. API Service Layer

### Axios Client (`src/lib/api-client.ts`)

**Dual URL Strategy**:
- Server-side (SSR): `NUTRA_API_URL` — internal Docker URL (e.g., `http://nutra-api:8080`)
- Client-side (browser): `NEXT_PUBLIC_NUTRA_API_URL` — public URL through nginx

```typescript
const baseURL = typeof window === 'undefined'
  ? process.env.NUTRA_API_URL
  : process.env.NEXT_PUBLIC_NUTRA_API_URL;
```

**Request Interceptor**: Auto-injects Bearer token from NextAuth session. On client-side, fetches `/api/auth/session` to get the current `accessToken`.

**Response Interceptor**: Error handling by status code:
- `401` → Check if still logged in, redirect to `/auth/login`
- `403` → Access denied
- `404` → Return `data?.mensagem`
- `4xx` → Return error message
- `5xx` → "Server error, try again"

**Error Class**:
```typescript
class NutraApiError extends Error {
  status: number;
  data?: { sucesso: boolean; mensagem: string; erros?: string[] };
}
```

### Service Layer (8 Services)

All services in `src/services/` follow the same pattern: methods that return promises from Axios calls.

| Service | Key Operations |
|---------|---------------|
| **accountService** | getProfile, updateProfile, deactivateAccount, reactivateAccount, respondToInvite, listMyNutritionists |
| **userProfileService** | Nutritional profile CRUD, food preferences, biometric records, clinical history, food anamnesis |
| **foodSearchService** | searchAll (unified across 4 tables), searchById, searchTbca/Fabricantes/FastFood/Genericos (paginated) |
| **foodDiaryService** | registerConsumption (single/batch), daily diary, period diary, adherence reports, meal photos |
| **quickMealService** | Quick consumption registration, getDailyStatus |
| **mealPlanService** | Plan CRUD, meals, items, substitutions, diet models/templates, createPlanFromModel |
| **nutritionalAssessmentService** | Register assessment, list, compare two assessments, progress photos |
| **nutritionistService** | Professional registration/profile, clinics CRUD, patient management (invite/end bond), subscription |

---

## 6. State Management

### React Query (TanStack Query)
Configured with:
- `staleTime`: 5 minutes (data considered fresh)
- `gcTime`: 30 minutes (keep in cache)
- `retry`: 2 attempts
- `refetchOnWindowFocus`: true

Currently services return raw promises — they are not yet wrapped in `useQuery`/`useMutation` hooks. Components use `useState` + `useEffect` for data fetching.

### Zustand
Declared in package.json but not currently used. Available for future client-side state needs.

### Local State
Components use `useState` for UI state (loading, search queries, selected items).

---

## 7. Type System

### DTOs (`src/types/api.ts`)
TypeScript interfaces matching the .NET backend exactly:
- `NutraUser`, `PerfilNutricionalDto`, `AlimentoResumoDto`, `StatusDiarioDto`
- `CriarPlanoAlimentarDto`, `RefeicaoPlanoDto`, `ItemRefeicaoDto`
- `AvaliacaoResultadoDto`, `ComparacaoAvaliacoesDto`
- `RegistroConsumoDto`, `DiarioDiaDto`, `RelatorioAdesaoDto`
- Standard response: `RetornoPadrao<T> { sucesso: boolean; mensagem: string; dados?: T }`

### Enums (`src/types/enums.ts`)
Mirror the .NET enums:
- `ETipoTabela` — Tbca(0), Fabricante(1), FastFood(2), Generico(3)
- `ETipoRefeicao` — CafeDaManha(0), Almoco(2), Jantar(4), PosTreino(7), etc.
- `EGeneroBiologico` — Masculino(0), Feminino(1)
- `ENivelAtividadeFisica` — Sedentario(0) through ExtremamenteAtivo(4)
- `ETipoObjetivo` — PerdaDeGordura(0), Hipertrofia(1), Manutencao(2), etc.
- `EAlergico` — None(0), Leite(1), Ovos(2), Amendoim(3), etc.
- `EPlanoAssinatura` — Gratuito(0), Basico(1), Profissional(2), Premium(3)

Label maps (e.g., `TipoTabelaLabels`) provide Portuguese display names.

### NextAuth Type Extensions (`src/types/next-auth.d.ts`)
```typescript
Session { accessToken?: string; error?: string; user: { id, roles? } }
JWT { roles?, accessToken?, refreshToken?, expiresAt?, userId?, error? }
```

---

## 8. Route Organization

### Public Routes
- `/` — Landing page (Fallout-inspired hero, features, CTA)
- `/auth/login` — Triggers OIDC flow via `signIn('web-site-service')`
- `/auth/logout` — Triggers `signOut()`
- `/auth/error` — Auth failure page

### Dashboard Routes (Protected)
All under `/(dashboard)/` layout with shared Pip-Boy chrome (header, sidebar, macro bar footer):
- `/dashboard` — Main stats, daily macros, quick meal button
- `/diario` — Food diary, `/diario/registrar` — Log food consumption
- `/busca` — Search food databases
- `/plano` — Meal plans
- `/avaliacoes` — Nutritional assessments
- `/progresso` — Progress photos and body measurements
- `/perfil` — User profile editing
- `/configuracoes` — Account settings

### Onboarding Routes (Protected)
- `/onboarding/perfil` — Create nutritional profile (redirected from dashboard if missing)
- `/onboarding/nutricionista` — Nutritionist profile setup (for Nutricionista role)

### API Routes
- `/api/auth/[...nextauth]` — NextAuth endpoints (signin, callback, signout, session)
- `/api/auth/token` — Utility endpoint returning current user + accessToken

---

## 9. Custom Hooks

### useDebounce (`src/hooks/use-debounce.ts`)
```typescript
function useDebounce<T>(value: T, delay: number = 500): T
```
Delays value updates — used for search input optimization to avoid API calls on every keystroke.

---

## 10. Environment Variables

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>

# OIDC Provider (shark-lock)
OIDC_ISSUER=http://localhost:5085
OIDC_CLIENT_ID=nutra-http
OIDC_CLIENT_SECRET=<from web-auth admin panel>

# Nutra API
NEXT_PUBLIC_NUTRA_API_URL=http://localhost:5146    # Browser (client-side)
NUTRA_API_URL=http://localhost:5146                # Server-side (SSR)

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis-dev-password
```

---

## 11. Complete Authentication Flow

```
1. User visits /dashboard (protected route)
        ↓
2. Middleware: no sessionToken cookie → redirect to /auth/login
        ↓
3. /auth/login calls signIn('web-site-service')
        ↓
4. NextAuth fetches OIDC discovery → redirects browser to Authorization endpoint
   Params: client_id, redirect_uri, scope, state, nonce, code_challenge (PKCE)
        ↓
5. User authenticates on shark-lock (email/password or social login)
        ↓
6. shark-lock redirects to /api/auth/callback/web-site-service?code=AUTH_CODE&state=STATE
        ↓
7. NextAuth exchanges code for tokens at OIDC token endpoint
   Returns: access_token, refresh_token, id_token, expires_at
        ↓
8. signIn callback: persist tokens to Redis via upsertOAuthAccountData()
        ↓
9. jwt callback: populate token with userId, roles, name, email
        ↓
10. Session created: small sessionToken in cookie, full data in Redis
        ↓
11. Redirect to /dashboard
        ↓
12. Component: useSession() → session.accessToken available
        ↓
13. API call: service method → Axios interceptor adds Authorization: Bearer {accessToken}
        ↓
14. nutra-api validates JWT against shark-lock authority → processes request
        ↓
15. Every 5 minutes: SessionProvider refetches → session callback → getValidAccessToken()
    If token expired: auto-refresh via refresh_token → new tokens in Redis
```
