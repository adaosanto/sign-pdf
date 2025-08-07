# 🔓 Configuração de CORS - PDF Signer

## 📋 Visão Geral

O CORS (Cross-Origin Resource Sharing) controla quais domínios podem acessar sua API. Aqui estão as diferentes configurações disponíveis.

## ⚙️ Configurações Disponíveis

### 1. **Permitir Todas as Origens (Desenvolvimento)**

```javascript
// Configuração mais permissiva - APENAS para desenvolvimento
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### 2. **Origens Específicas (Recomendado para Produção)**

```javascript
// Configuração restritiva - para produção
app.use(cors({
  origin: ['https://seudominio.com', 'https://app.seudominio.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### 3. **Configuração via Variáveis de Ambiente**

```bash
# .env
CORS_ALLOW_ALL=true                    # Permitir todas as origens
CORS_ORIGINS=https://app1.com,https://app2.com  # Origens específicas
NODE_ENV=development                   # Ambiente
```

## 🔧 Configurações Atuais

### Desenvolvimento (NODE_ENV=development)
- ✅ **Permite todas as origens**
- ✅ **Todos os métodos HTTP**
- ✅ **Todos os headers**
- ✅ **Credenciais habilitadas**

### Produção (NODE_ENV=production)
- 🔒 **Apenas origens específicas**
- 🔒 **Métodos limitados**
- 🔒 **Headers específicos**
- ✅ **Credenciais habilitadas**

## 🚀 Como Usar

### Opção 1: Configuração Automática (Recomendada)
```bash
# Desenvolvimento - permite tudo
NODE_ENV=development npm run dev

# Produção - restritivo
NODE_ENV=production npm start
```

### Opção 2: Configuração Manual via .env
```bash
# Permitir todas as origens
CORS_ALLOW_ALL=true

# Ou especificar origens
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://meuapp.com
```

### Opção 3: Configuração Direta no Código
```javascript
// Em src/server.js
app.use(cors({
  origin: true,  // Permite todas as origens
  credentials: true
}));
```

## 🛡️ Configurações de Segurança

### Para Desenvolvimento (Permissivo)
```javascript
const devConfig = {
  origin: true,                    // Todas as origens
  credentials: true,               // Credenciais habilitadas
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['*'],           // Todos os headers
  exposedHeaders: ['*'],           // Todos os headers expostos
  maxAge: 86400                    // Cache de 24h
};
```

### Para Produção (Restritivo)
```javascript
const prodConfig = {
  origin: ['https://seudominio.com'],  // Apenas domínios específicos
  credentials: true,                   // Credenciais habilitadas
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Disposition'],
  maxAge: 86400                        // Cache de 24h
};
```

## 🧪 Testando CORS

### Teste 1: Verificar Headers CORS
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/pdf/sign
```

### Teste 2: Teste de Origem Permitida
```bash
curl -H "Origin: http://localhost:3000" \
     http://localhost:3000/health
```

### Teste 3: Teste de Origem Bloqueada
```bash
curl -H "Origin: http://evil.com" \
     http://localhost:3000/health
```

## 🔍 Debugging CORS

### Verificar Configuração Atual
```javascript
// Adicione este middleware para debug
app.use((req, res, next) => {
  console.log('🌐 CORS Debug:');
  console.log('  Origin:', req.headers.origin);
  console.log('  Method:', req.method);
  console.log('  Headers:', req.headers);
  next();
});
```

### Logs de CORS
```bash
# Ver logs do servidor
npm run dev

# Ou com debug
DEBUG=cors npm run dev
```

## ⚠️ Avisos de Segurança

### ❌ NUNCA use em produção:
```javascript
// PERIGOSO - permite qualquer origem
app.use(cors({
  origin: '*',
  credentials: false
}));
```

### ✅ SEMPRE use em produção:
```javascript
// SEGURO - origens específicas
app.use(cors({
  origin: ['https://seudominio.com'],
  credentials: true
}));
```

## 🎯 Configuração Recomendada

### Para Desenvolvimento
```bash
# .env
NODE_ENV=development
CORS_ALLOW_ALL=true
```

### Para Produção
```bash
# .env
NODE_ENV=production
CORS_ORIGINS=https://app.seudominio.com,https://admin.seudominio.com
```

## 🔄 Atualizando Configuração

1. **Edite o arquivo `.env`:**
   ```bash
   CORS_ALLOW_ALL=true
   ```

2. **Ou edite `src/config/cors.js`:**
   ```javascript
   const devConfig = {
     origin: true,  // Permite todas as origens
     // ... outras configurações
   };
   ```

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## 📞 Suporte

Se você encontrar problemas de CORS:

1. Verifique os logs do servidor
2. Teste com `curl` para verificar headers
3. Use o modo de debug: `DEBUG=cors npm run dev`
4. Consulte a documentação do Express CORS
