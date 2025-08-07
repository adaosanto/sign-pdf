const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 Diagnóstico completo do PDF Signer...\n');

// 1. Verificar estrutura de arquivos
console.log('📁 Verificando estrutura de arquivos...');
const requiredFiles = [
    'package.json',
    'src/server.js',
    'src/routes/pdfRoutes.js',
    'src/services/pdfService.js',
    'src/middleware/errorHandler.js',
    'src/middleware/upload.js',
    'examples/example-usage.html'
];

let missingFiles = [];
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - NÃO ENCONTRADO`);
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.log(`\n⚠️ Arquivos faltando: ${missingFiles.length}`);
    missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
    console.log('\n✅ Todos os arquivos necessários encontrados');
}

// 2. Verificar dependências
console.log('\n📦 Verificando dependências...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules encontrado');

    // Verificar dependências críticas
    const criticalDeps = ['express', 'pdf-lib', 'multer'];
    criticalDeps.forEach(dep => {
        const depPath = path.join('node_modules', dep);
        if (fs.existsSync(depPath)) {
            console.log(`✅ ${dep} instalado`);
        } else {
            console.log(`❌ ${dep} NÃO INSTALADO`);
        }
    });
} else {
    console.log('❌ node_modules NÃO ENCONTRADO - Execute: npm install');
}

// 3. Verificar arquivo de configuração
console.log('\n⚙️ Verificando configuração...');
if (fs.existsSync('.env')) {
    console.log('✅ Arquivo .env encontrado');
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log('📄 Conteúdo do .env:');
    console.log(envContent);
} else {
    console.log('❌ Arquivo .env NÃO ENCONTRADO');
    if (fs.existsSync('env.example')) {
        console.log('✅ env.example encontrado - Copie para .env');
    } else {
        console.log('❌ env.example também não encontrado');
    }
}

// 4. Verificar se o servidor pode ser carregado
console.log('\n🚀 Testando carregamento do servidor...');
try {
    // Tentar carregar o servidor
    const serverPath = path.join(__dirname, 'src', 'server.js');
    if (fs.existsSync(serverPath)) {
        console.log('✅ Arquivo server.js encontrado');

        // Verificar sintaxe básica
        const serverCode = fs.readFileSync(serverPath, 'utf8');
        if (serverCode.includes('express') && serverCode.includes('app.listen')) {
            console.log('✅ Sintaxe do servidor parece correta');
        } else {
            console.log('❌ Problemas na sintaxe do servidor');
        }
    } else {
        console.log('❌ server.js não encontrado');
    }
} catch (error) {
    console.log('❌ Erro ao verificar servidor:', error.message);
}

// 5. Verificar porta
console.log('\n🔌 Verificando porta 3000...');
const net = require('net');
const server = net.createServer();
server.listen(3000, () => {
    console.log('✅ Porta 3000 está livre');
    server.close();
});
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('❌ Porta 3000 já está em uso');
        console.log('🔧 Execute: lsof -i :3000 para ver qual processo está usando');
    } else {
        console.log('❌ Erro ao verificar porta:', err.message);
    }
});

// 6. Teste de conectividade
console.log('\n🌐 Testando conectividade...');
const testOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET',
    timeout: 3000
};

const testReq = http.request(testOptions, (res) => {
    console.log(`✅ Servidor respondeu com status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('📄 Resposta:', response);
        } catch (e) {
            console.log('📄 Resposta (texto):', data);
        }
    });
});

testReq.on('error', (error) => {
    console.log('❌ Servidor não está rodando ou não responde');
    console.log('🔧 Erro:', error.message);
});

testReq.on('timeout', () => {
    console.log('❌ Timeout - servidor não respondeu em 3 segundos');
});

testReq.end();

// 7. Instruções de correção
setTimeout(() => {
    console.log('\n🔧 INSTRUÇÕES DE CORREÇÃO:');
    console.log('1. Se dependências estão faltando: npm install');
    console.log('2. Se .env não existe: cp env.example .env');
    console.log('3. Se porta está em uso: lsof -i :3000 && kill -9 <PID>');
    console.log('4. Para iniciar o servidor: npm run dev');
    console.log('5. Para teste completo: ./check-and-start.sh');
    console.log('\n🎯 Execute: ./check-and-start.sh para correção automática');
}, 4000);
