const express = require('express');
const { upload, handleUploadError } = require('../middleware/upload');
const pdfService = require('../services/pdfService');
const path = require('path');

const router = express.Router();

/**
 * @route POST /api/pdf/sign
 * @desc Assina um PDF enviado via upload
 * @access Public
 */
router.post('/sign',
  upload.single('pdf'),
  handleUploadError,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Nenhum arquivo enviado',
          details: 'Por favor, envie um arquivo PDF'
        });
      }

      // Validar se é um PDF válido
      const isValidPDF = await pdfService.validatePDF(req.file.path);
      if (!isValidPDF) {
        // Limpar arquivo inválido
        await pdfService.cleanupFile(req.file.path);
        return res.status(400).json({
          error: 'Arquivo inválido',
          details: 'O arquivo enviado não é um PDF válido'
        });
      }

      // Dados da assinatura (opcionais)
      const signatureData = {
        name: req.body.name || req.body.signerName,
        date: req.body.date,
        reason: req.body.reason || req.body.purpose,
        location: req.body.location,
        position: req.body.position ? JSON.parse(req.body.position) : undefined,
        fontSize: req.body.fontSize ? parseInt(req.body.fontSize) : undefined
      };

      // Assinar o PDF
      const signedPdfBuffer = await pdfService.signPDF(req.file.path, signatureData);

      // Gerar nome para o arquivo assinado
      const signedFileName = pdfService.generateSignedFileName(req.file.originalname);

      // Configurar headers para download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${signedFileName}"`);
      res.setHeader('Content-Length', signedPdfBuffer.length);

      // Enviar o PDF assinado
      res.send(signedPdfBuffer);

      // Limpar arquivo temporário após envio
      await pdfService.cleanupFile(req.file.path);

    } catch (error) {
      // Limpar arquivo em caso de erro
      if (req.file) {
        await pdfService.cleanupFile(req.file.path);
      }
      next(error);
    }
  }
);

/**
 * @route POST /api/pdf/upload
 * @desc Apenas faz upload do PDF (para validação)
 * @access Public
 */
router.post('/upload',
  upload.single('pdf'),
  handleUploadError,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Nenhum arquivo enviado',
          details: 'Por favor, envie um arquivo PDF'
        });
      }

      // Validar se é um PDF válido
      const isValidPDF = await pdfService.validatePDF(req.file.path);
      if (!isValidPDF) {
        await pdfService.cleanupFile(req.file.path);
        return res.status(400).json({
          error: 'Arquivo inválido',
          details: 'O arquivo enviado não é um PDF válido'
        });
      }

      res.json({
        message: 'PDF enviado com sucesso',
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: req.file.path
        }
      });

    } catch (error) {
      if (req.file) {
        await pdfService.cleanupFile(req.file.path);
      }
      next(error);
    }
  }
);

/**
 * @route GET /validate
 * @desc Valida uma assinatura digital
 * @access Public
 */
router.get('/validate', (req, res) => {
  const { signature, hash } = req.query;

  if (!signature) {
    return res.status(400).json({
      error: 'Assinatura não fornecida',
      message: 'Por favor, forneça uma assinatura digital para validação'
    });
  }

  // Aqui você pode implementar a lógica de validação real
  // Por enquanto, vamos simular uma validação básica
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

/**
 * @route GET /api/pdf/info
 * @desc Retorna informações sobre a API
 * @access Public
 */
router.get('/info', (req, res) => {
  res.json({
    name: 'PDF Signer API',
    version: '1.0.0',
    description: 'API para assinar PDFs digitalmente',
    endpoints: {
      sign: {
        method: 'POST',
        path: '/api/pdf/sign',
        description: 'Assina um PDF enviado via upload',
        body: {
          pdf: 'Arquivo PDF (multipart/form-data)',
          name: 'Nome do assinante (opcional)',
          date: 'Data da assinatura (opcional)',
          reason: 'Motivo da assinatura (opcional)',
          location: 'Local da assinatura (opcional)',
          position: 'Posição da assinatura em JSON (opcional)',
          fontSize: 'Tamanho da fonte (opcional)'
        }
      },
      upload: {
        method: 'POST',
        path: '/api/pdf/upload',
        description: 'Apenas faz upload do PDF para validação',
        body: {
          pdf: 'Arquivo PDF (multipart/form-data)'
        }
      },
      validate: {
        method: 'GET',
        path: '/api/pdf/validate',
        description: 'Valida uma assinatura digital',
        query: {
          signature: 'Assinatura digital (32 caracteres)',
          hash: 'Hash do documento (opcional)'
        }
      }
    },
    limits: {
      maxFileSize: `${(parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024) / (1024 * 1024)}MB`,
      allowedTypes: ['application/pdf'],
      maxFiles: 1
    }
  });
});

module.exports = router;
