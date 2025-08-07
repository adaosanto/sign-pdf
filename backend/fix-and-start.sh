#!/bin/bash

echo "🔧 Correção automática do PDF Signer..."
echo "========================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Navegue para o diretório backend/"
    exit 1
fi

echo "✅ Diretório correto detectado"

# 1. Parar qualquer processo na porta 3000
echo "🛑 Parando processos na porta 3000..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
sleep 2

# Verificar se ainda há processos
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Ainda há processos na porta 3000. Tentando forçar parada..."
    PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# 2. Limpar e reinstalar dependências
echo "🧹 Limpando dependências antigas..."
rm -rf node_modules package-lock.json
echo "📦 Reinstalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# 3. Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo .env..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ .env criado baseado no exemplo"
    else
        echo "⚠️ env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
        echo "✅ .env básico criado"
    fi
else
    echo "✅ Arquivo .env já existe"
fi

# 4. Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p uploads
mkdir -p test-files
echo "✅ Diretórios criados"

# 5. Dar permissões aos scripts
echo "🔐 Configurando permissões..."
chmod +x *.sh 2>/dev/null
echo "✅ Permissões configuradas"

# 6. Verificar se tudo está correto
echo "🔍 Verificação final..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules ainda não existe"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "❌ .env ainda não existe"
    exit 1
fi

if [ ! -f "src/server.js" ]; then
    echo "❌ server.js não encontrado"
    exit 1
fi

echo "✅ Todas as verificações passaram"

# 7. Teste básico
echo "🧪 Executando teste básico..."
if npm run test:basic >/dev/null 2>&1; then
    echo "✅ Teste básico passou"
else
    echo "⚠️ Teste básico falhou, mas continuando..."
fi

# 8. Iniciar servidor
echo ""
echo "🚀 Iniciando servidor PDF Signer..."
echo "========================================"
echo "📄 Interface web: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/health"
echo "📚 API info: http://localhost:3000/api"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Aguardar um pouco antes de iniciar
sleep 2

# Iniciar o servidor
npm run dev
