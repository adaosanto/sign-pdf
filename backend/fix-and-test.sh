#!/bin/bash

echo "🔧 Corrigindo e testando PDF Signer..."
echo "======================================"

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# 2. Verificar se o qrcode foi instalado
echo "🔍 Verificando dependência qrcode..."
if ! node -e "require('qrcode')" 2>/dev/null; then
    echo "❌ Dependência qrcode não encontrada"
    echo "📦 Instalando qrcode..."
    npm install qrcode
fi

echo "✅ Dependência qrcode verificada"

# 3. Executar teste rápido
echo "🧪 Executando teste rápido..."
node test-quick.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCESSO! O erro foi corrigido!"
    echo "✅ PDF Signer está funcionando corretamente"
    echo "📄 Verifique o arquivo test-quick-signed.pdf"
    echo ""
    echo "🚀 Para iniciar o servidor:"
    echo "   npm run dev"
    echo ""
    echo "🌐 Acesse:"
    echo "   http://localhost:3000 (interface principal)"
    echo "   http://localhost:3000/validator (validador)"
else
    echo ""
    echo "❌ ERRO! Ainda há problemas"
    echo "🔍 Verifique os logs acima"
    exit 1
fi
