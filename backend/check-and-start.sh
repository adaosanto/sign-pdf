#!/bin/bash

echo "🔍 Verificando configuração do PDF Signer..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Certifique-se de estar no diretório backend/"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências."
        exit 1
    fi
else
    echo "✅ Dependências já instaladas"
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo de configuração .env..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Arquivo .env criado baseado no exemplo."
    else
        echo "⚠️ Arquivo env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
EOF
    fi
else
    echo "✅ Arquivo .env encontrado"
fi

# Criar diretório de uploads se não existir
if [ ! -d "uploads" ]; then
    echo "📁 Criando diretório de uploads..."
    mkdir -p uploads
else
    echo "✅ Diretório de uploads encontrado"
fi

# Verificar se a porta 3000 está livre
echo "🔍 Verificando se a porta 3000 está livre..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Porta 3000 já está em uso. Tentando parar processo existente..."
    PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    kill -9 $PID 2>/dev/null
    sleep 2
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Não foi possível liberar a porta 3000. Por favor, pare o processo manualmente."
        echo "   Processo usando a porta: $(lsof -Pi :3000 -sTCP:LISTEN -t)"
        exit 1
    else
        echo "✅ Porta 3000 liberada"
    fi
else
    echo "✅ Porta 3000 está livre"
fi

# Executar teste básico
echo "🧪 Executando teste básico..."
npm run test:basic

# Iniciar o servidor
echo ""
echo "🚀 Iniciando servidor PDF Signer..."
echo "📄 Interface web: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/health"
echo "📚 API info: http://localhost:3000/api"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Iniciar o servidor
npm run dev
