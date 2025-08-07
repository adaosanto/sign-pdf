#!/bin/bash

echo "🚀 Iniciando PDF Signer API..."

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

# Verificar se o arquivo package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Certifique-se de estar no diretório correto."
    exit 1
fi

# Verificar se node_modules existe, se não, instalar dependências
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências."
        exit 1
    fi
fi

# Verificar se o arquivo .env existe, se não, criar baseado no exemplo
if [ ! -f ".env" ]; then
    echo "⚙️  Criando arquivo de configuração .env..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Arquivo .env criado baseado no exemplo."
    else
        echo "⚠️  Arquivo env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
EOF
    fi
fi

# Criar diretório de uploads se não existir
if [ ! -d "uploads" ]; then
    echo "📁 Criando diretório de uploads..."
    mkdir -p uploads
fi

# Executar teste básico
echo "🧪 Executando teste básico..."
npm run test:basic

# Iniciar o servidor
echo "🚀 Iniciando servidor..."
echo "📄 API estará disponível em: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/health"
echo "📚 Documentação: http://localhost:3000/api/pdf/info"
echo "🌐 Interface de exemplo: abra examples/example-usage.html no navegador"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev
