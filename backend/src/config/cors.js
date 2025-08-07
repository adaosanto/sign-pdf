/**
 * Configuração de CORS para o PDF Signer API
 */

// Configuração padrão
const defaultConfig = {
    // Permitir todas as origens em desenvolvimento
    allowAll: process.env.CORS_ALLOW_ALL === 'true' || process.env.NODE_ENV === 'development',

    // Origens específicas (usado quando allowAll = false)
    origins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:8000', 'http://localhost:3001', 'http://localhost:8080'],

    // Configurações de credenciais
    credentials: true,

    // Métodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],

    // Headers permitidos
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'X-File-Name'
    ],

    // Headers expostos
    exposedHeaders: [
        'Content-Length',
        'Content-Disposition'
    ],

    // Tempo máximo de cache para preflight requests
    maxAge: 86400 // 24 horas
};

// Função para obter configuração baseada no ambiente
function getCorsConfig() {
    if (defaultConfig.allowAll) {
        console.log('🔓 CORS: Permitindo todas as origens');
        return {
            origin: true,
            credentials: defaultConfig.credentials,
            methods: defaultConfig.methods,
            allowedHeaders: defaultConfig.allowedHeaders,
            exposedHeaders: defaultConfig.exposedHeaders,
            maxAge: defaultConfig.maxAge
        };
    } else {
        console.log(`🔒 CORS: Origens permitidas: ${defaultConfig.origins.join(', ')}`);
        return {
            origin: defaultConfig.origins,
            credentials: defaultConfig.credentials,
            methods: defaultConfig.methods,
            allowedHeaders: defaultConfig.allowedHeaders,
            exposedHeaders: defaultConfig.exposedHeaders,
            maxAge: defaultConfig.maxAge
        };
    }
}

// Configuração para desenvolvimento (muito permissiva)
const devConfig = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
    maxAge: 86400
};

// Configuração para produção (mais restritiva)
const prodConfig = {
    origin: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
        : ['https://yourdomain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Disposition'],
    maxAge: 86400
};

// Função para obter configuração baseada no ambiente
function getCorsConfigByEnvironment() {
    if (process.env.NODE_ENV === 'production') {
        console.log('🔒 CORS: Configuração de produção');
        return prodConfig;
    } else {
        console.log('🔓 CORS: Configuração de desenvolvimento');
        return devConfig;
    }
}

module.exports = {
    defaultConfig,
    devConfig,
    prodConfig,
    getCorsConfig,
    getCorsConfigByEnvironment
};
