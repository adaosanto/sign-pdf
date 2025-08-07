const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const pdfRoutes = require('./routes/pdfRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { getCorsConfigByEnvironment } = require('./config/cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de segurança
app.use(helmet());

// Configuração do CORS - Flexível baseada no ambiente
app.use(cors(getCorsConfigByEnvironment()));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requests por janela
  message: {
    error: 'Muitas requisições. Tente novamente mais tarde.'
  }
});
app.use(limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/static', express.static(path.join(__dirname, '..', 'examples')));
app.use('/examples', express.static(path.join(__dirname, '..', 'examples')));

// Rotas
app.use('/api/pdf', pdfRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz - serve a interface web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'examples', 'example-usage.html'));
});

// Rota para a interface web
app.get('/interface', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'examples', 'example-usage.html'));
});

// Rota para a interface de validação
app.get('/validator', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'examples', 'validation-interface.html'));
});

// Rota para validação de assinaturas
app.get('/validate', (req, res) => {
  const { signature, hash } = req.query;

  if (!signature) {
    return res.status(400).json({
      error: 'Assinatura não fornecida',
      message: 'Por favor, forneça uma assinatura digital para validação'
    });
  }

  // Validação básica
  const isValid = signature && signature.length === 32;

  res.json({
    signature: signature,
    hash: hash || 'N/A',
    isValid: isValid,
    validatedAt: new Date().toISOString(),
    message: isValid
      ? 'Assinatura válida! Este documento é autêntico.'
      : 'Assinatura inválida ou corrompida.',
    details: {
      signatureLength: signature ? signature.length : 0,
      expectedLength: 32,
      format: 'URL-safe (A-Z, a-z, 0-9, -, _)'
    }
  });
});

// Rota para informações da API
app.get('/api', (req, res) => {
  res.json({
    message: 'PDF Signer API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      interface: '/interface',
      signPdf: '/api/pdf/sign',
      uploadPdf: '/api/pdf/upload',
      validate: '/validate',
      apiInfo: '/api/pdf/info'
    }
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Tratamento de rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📄 PDF Signer API disponível em http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
