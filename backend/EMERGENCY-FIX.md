# 🚨 CORREÇÃO DE EMERGÊNCIA - Rotas não encontradas

## ❌ Problema: Todas as rotas retornam "Rota não encontrada"

### 🔥 SOLUÇÃO RÁPIDA (Execute em ordem):

#### 1. **Diagnóstico Automático**
```bash
cd backend
node debug-server.js
```

#### 2. **Correção Automática**
```bash
cd backend
chmod +x fix-and-start.sh
./fix-and-start.sh
```

#### 3. **Se ainda não funcionar, correção manual:**
```bash
cd backend

# Parar todos os processos Node.js
pkill -f node

# Limpar tudo
rm -rf node_modules package-lock.json
rm -f .env

# Reinstalar
npm install

# Criar .env
cp env.example .env

# Criar diretórios
mkdir -p uploads test-files

# Iniciar servidor
npm run dev
```

### 🔍 **Verificação Rápida:**

#### Teste 1: Servidor está rodando?
```bash
curl http://localhost:3000/health
```

#### Teste 2: Processos na porta?
```bash
lsof -i :3000
```

#### Teste 3: Dependências instaladas?
```bash
ls -la node_modules/express
```

### 🚨 **Problemas Mais Comuns:**

#### 1. **Servidor não está rodando**
- **Sintoma**: Timeout ou "Connection refused"
- **Solução**: `npm run dev`

#### 2. **Dependências não instaladas**
- **Sintoma**: "Cannot find module"
- **Solução**: `npm install`

#### 3. **Porta ocupada**
- **Sintoma**: "EADDRINUSE"
- **Solução**: `lsof -i :3000 && kill -9 <PID>`

#### 4. **Arquivo .env faltando**
- **Sintoma**: Configurações padrão
- **Solução**: `cp env.example .env`

### 🎯 **Comandos de Emergência:**

```bash
# 1. Parar tudo
pkill -f node

# 2. Limpar tudo
cd backend
rm -rf node_modules package-lock.json .env

# 3. Reinstalar tudo
npm install
cp env.example .env

# 4. Iniciar
npm run dev
```

### 📞 **Se NADA funcionar:**

1. **Verificar Node.js:**
   ```bash
   node --version  # Deve ser 16+
   ```

2. **Verificar permissões:**
   ```bash
   ls -la
   chmod +x *.sh
   ```

3. **Usar Docker (alternativa):**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Verificar logs:**
   ```bash
   npm run dev 2>&1 | tee server.log
   ```

### 🔧 **Scripts Disponíveis:**

- `debug-server.js` - Diagnóstico completo
- `fix-and-start.sh` - Correção automática
- `test-server.js` - Teste de conectividade
- `check-and-start.sh` - Verificação e início

### ⚡ **Solução Mais Rápida:**

```bash
cd backend
./fix-and-start.sh
```

Este script fará tudo automaticamente:
- ✅ Parar processos conflitantes
- ✅ Limpar e reinstalar dependências
- ✅ Criar arquivos de configuração
- ✅ Iniciar o servidor

### 🎉 **Após a correção, teste:**

```bash
# Health check
curl http://localhost:3000/health

# Interface web
curl -I http://localhost:3000/

# API info
curl http://localhost:3000/api
```

### 📋 **Checklist Final:**

- [ ] Servidor rodando em http://localhost:3000
- [ ] Health check retorna status 200
- [ ] Interface web carrega
- [ ] API responde corretamente
- [ ] Upload de PDF funciona

Se ainda houver problemas, execute `node debug-server.js` e compartilhe a saída.
