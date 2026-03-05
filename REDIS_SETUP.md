# Configuração Redis Self-Hosted para NextAuth - Resolução do Problema de Cookie Grande

## 🔴 Problema Original

Ao tentar fazer login, a sessão era muito grande (5153 bytes) e excedia o limite de 4096 bytes para cookies HTTP. NextAuth tentava dividir em chunks, causando inconsistências e redirecionando de volta para login.

```
[next-auth][debug][CHUNKING_SESSION_COOKIE] {
  message: 'Session cookie exceeds allowed 4096 bytes.',
  valueSize: 5153,
  chunks: [ 4096, 1383 ]
}
```

## ✅ Solução Implementada

Migrar do armazenamento **JWT no Cookie** para **Custom Redis Adapter (self-hosted)**.

### Como Funciona?

**Antes (Problema):**
```
Navegador: ["sessionToken" + "5153 bytes de dados"] → Cookie HTTP
                          ↓
                    Excede 4096 bytes ❌
```

**Depois (Solução):**
```
Navegador: ["sessionToken" (~100 bytes)] → Cookie HTTP
                ↓
           Redis Server: Armazena dados completos da sessão
                ↓
             Seguro & Escalável & Open Source ✅
```

## 📋 Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  nutra-frontend  │      │  Redis Service   │        │
│  │  (Next.js + node_modules:                 │        │
│  │   redis client)  │◄────►│  redis:7-alpine  │        │
│  └──────────────────┘      │  :6379           │        │
│         port 3000          │  /data (volume)  │        │
│                            └──────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📋 Pré-requisitos

1. **Docker & Docker Compose instalados**
   - Windows: Docker Desktop
   - Linux: `docker` + `docker-compose`
   - Mac: Docker Desktop

2. **Ambiente local configurado:**
   - Node.js 18+ instalado
   - Arquivo `.env.local` com variáveis
   - Repositório `deploy/` com docker-compose.yml

## 🚀 Passo a Passo de Configuração

### 1️⃣ Adicionar Redis ao docker-compose.yml

Redis já foi adicionado ao `deploy/docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: redis-sessions
  restart: unless-stopped
  command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis-dev-password}
  volumes:
    - redis-data:/data
  ports:
    - "${REDIS_PORT:-6379}:6379"
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
```

### 2️⃣ Instalar Dependências

```bash
# No diretório nutra-frontend/
npm install

# Instala a nova dependência:
# - redis (cliente Node.js para Redis)
```

### 3️⃣ Configurar Variáveis de Ambiente

Na raiz de `nutra-frontend/`, crie `.env.local`:

```bash
# Redis - Configuração Local
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis-dev-password

# NextAuth Secret (gerar novo)
NEXTAUTH_SECRET=seu_secret_aleatorio_aqui

# Resto das variáveis (OIDC, etc)
OIDC_ISSUER=http://localhost:5085
OIDC_CLIENT_ID=projeto-b-http
OIDC_CLIENT_SECRET=FjI1kf4YC8iz0YZy2yqqnCQ7myIrc1xl2G5yyw97r4I

NEXTAUTH_URL=http://localhost:3000
```

**Gerar NEXTAUTH_SECRET:**

```bash
# Linux/Mac:
openssl rand -base64 32

# Windows (PowerShell):
[Convert]::ToBase64String((1..32 | % { Get-Random -Maximum 256 }) -as [byte[]])
```

### 4️⃣ Iniciar Redis Local

```bash
# No diretório deploy/
docker-compose up -d redis

# Verificar se está rodando:
docker ps | grep redis-sessions

# Ou conectar para testar:
docker exec -it redis-sessions redis-cli ping
# Resposta esperada: PONG
```

### 5️⃣ Iniciar NextAuth + Frontend

```bash
# No diretório nutra-frontend/
npm run dev

# Servidor iniciará em http://localhost:3000
```

## 🧪 Testar a Configuração

```bash
# 1. Acesse http://localhost:3000/auth/login
# 2. Clique em "Entrar"
# 3. Faça login com admin@sistema.local / superadmin

# ✅ Esperado:
# - Redirecionado para /dashboard
# - Nenhum erro de "CHUNKING_SESSION_COOKIE"
# - Sessão persiste ao recarregar a página
# - Cookie do navegador é PEQUENO (sessionToken referência)
```

## 🔍 Verificar Dados no Redis

```bash
# Conectar ao Redis
docker exec -it redis-sessions redis-cli

# Dentro do CLI:
AUTH redis-dev-password
KEYS next-auth:*
GET next-auth:session:seu_session_token_aqui
```

## 📊 Comparação: Antes vs. Depois

| Aspecto | Antes (JWT) | Depois (Redis Local) |
|---------|-----------|----------------------|
| Armazenamento | Cookie | Redis |
| Tamanho Cookie | 5153 bytes ❌ | ~100 bytes ✅ |
| Custo | N/a | Grátis (open source) |
| Escalabilidade | Limitada | Excelente |
| Complexidade | Média | Baixa |
| Compartilha sessão | Não | Sim (multi-server) |
| Segurança | Menor | Maior |

## 🎯 Detalhes técnicos

### Adapter Customizado (`lib/adapters/redis.ts`)

Implementação manual de um adapter NextAuth para Redis:

- ✅ `createUser()` - Criar novo usuário
- ✅ `getUser()` - Obter usuário por ID
- ✅ `getUserByEmail()` - Procurar por email
- ✅ `getUserByAccount()` - Lookup por OAuth provider
- ✅ `updateUser()` - Atualizar dados do usuário
- ✅ `createSession()` - Criar sessão com TTL automático
- ✅ `getSessionAndUser()` - Carregar sessão (mais usado)
- ✅ `updateSession()` - Renovar TTL da sessão
- ✅ `deleteSession()` - Remover sessão (logout)
- ✅ `linkAccount()` - Vincular conta OAuth
- ✅ `createVerificationToken()` - Tokens temporários
- ✅ `useVerificationToken()` - Consumir tokens

### Armazenamento em Redis

```
next-auth:user:{userId}                    → Objeto User
next-auth:user:email:{email}               → userId (index)
next-auth:account:{provider}:{accountId}   → Objeto Account
next-auth:session:{sessionToken}           → Objeto Session (com TTL)
next-auth:session:user:{userId}:{token}    → Referência (com TTL)
next-auth:verification:{id}:{token}        → Verification Token (com TTL)
```

## 🔧 Troubleshooting

### "Redis connection refused"

**Causa:** Redis não está rodando

```bash
# Verificar status:
docker ps | grep redis

# Se não está listado, iniciar:
docker-compose up -d redis

# Ver logs:
docker logs redis-sessions
```

### "Can't find module 'redis'"

**Causa:** Dependência não instalada

```bash
# Reinstalar:
rm -rf node_modules package-lock.json
npm install
```

### Sessão não persiste ao recarregar página

**Causa:** Possível problema com conexão Redis ou TTL

```bash
# Verificar conexão:
docker exec -it redis-sessions redis-cli PING

# Ver tamanho de dados:
docker exec -it redis-sessions redis-cli DBSIZE

# Limpar dados (se necessário):
docker exec -it redis-sessions redis-cli FLUSHDB
```

### Erro: "WRONGPASS invalid username-password pair"

**Causa:** Senha Redis incorreta em `.env.local`

```bash
# Verificar senha em docker-compose.yml:
grep REDIS_PASSWORD deploy/.env

# Usar a mesma em .env.local:
REDIS_PASSWORD=redis-dev-password
```

## 📈 Preparar para Produção

Quando for fazer deploy em produção:

1. **Mudar senha Redis:**
   ```bash
   # Gerar senha segura:
   openssl rand -hex 32
   
   # Adicionar em deploy/.env:
   REDIS_PASSWORD=sua_senha_segura_aqui
   ```

2. **Usar Redis Gerenciado (opcional):**
   - AWS ElastiCache
   - Google Cloud Memorystore
   - Azure Cache for Redis
   - DigitalOcean Managed Redis

3. **Aumentar Recursos:**
   ```yaml
   # docker-compose.yml
   redis:
     deploy:
       resources:
         limits:
           memory: 1G
           cpus: "2.0"
   ```

4. **Backup Automático:**
   ```bash
   # Habilitar append-only file (já ativado em docker-compose.yml)
   # Copiar arquivo RDB/AOF para backup externo
   docker cp redis-sessions:/data/. ./backups/
   ```

## 🎓 Referências

- [Redis Official Docs](https://redis.io/documentation)
- [NextAuth.js Adapters](https://next-auth.js.org/adapters/overview)
- [Redis Node.js Client](https://github.com/redis/node-redis)
- [Docker Redis Image](https://hub.docker.com/_/redis)

## ✨ Resumo da Mudança

| Componente | Mudança | Arquivo |
|-----------|---------|---------|
| **Adapter** | Criado novo adapter Redis customizado | `lib/adapters/redis.ts` |
| **Auth Config** | Usar `RedisAdapter()` | `lib/auth.ts` |
| **Docker** | Adicionado serviço Redis | `deploy/docker-compose.yml` |
| **Dependências** | Removido Upstash, adicionado redis | `package.json` |
| **Env Vars** | `REDIS_*` ao invés de `UPSTASH_*` | `.env.example` |

Agora o login funciona de forma escalável, open source e completamente controlado! 🚀

