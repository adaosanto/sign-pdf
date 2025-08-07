const http = require('http');

// Teste simples para verificar se o servidor está rodando
function testServer() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Status: ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('📄 Resposta:', response);

                if (res.statusCode === 200) {
                    console.log('🎉 Servidor está funcionando corretamente!');
                } else {
                    console.log('⚠️ Servidor respondeu, mas com status inesperado');
                }
            } catch (error) {
                console.log('📄 Resposta (texto):', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Erro ao conectar com o servidor:', error.message);
        console.log('\n🔧 Possíveis soluções:');
        console.log('1. Verifique se o servidor está rodando: npm run dev');
        console.log('2. Verifique se a porta 3000 está livre: lsof -i :3000');
        console.log('3. Verifique se as dependências estão instaladas: npm install');
    });

    req.setTimeout(5000, () => {
        console.error('❌ Timeout ao conectar com o servidor');
        console.log('🔧 O servidor pode não estar rodando ou estar demorando para responder');
    });

    req.end();
}

// Teste da API principal
function testAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`\n📡 Testando API principal...`);
        console.log(`✅ Status: ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('📄 Endpoints disponíveis:', response.endpoints);
            } catch (error) {
                console.log('📄 Resposta (texto):', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Erro ao testar API:', error.message);
    });

    req.end();
}

// Teste da interface web
function testInterface() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`\n🌐 Testando interface web...`);
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📄 Content-Type: ${res.headers['content-type']}`);

        if (res.statusCode === 200) {
            console.log('🎉 Interface web está funcionando!');
        }
    });

    req.on('error', (error) => {
        console.error('❌ Erro ao testar interface:', error.message);
    });

    req.end();
}

// Executar testes
console.log('🧪 Testando servidor PDF Signer...\n');

testServer();

// Aguardar um pouco e testar outros endpoints
setTimeout(() => {
    testAPI();
}, 1000);

setTimeout(() => {
    testInterface();
}, 2000);
