const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.replace(/\s+/g, '_');
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  }
});

// Filtro para validar apenas PDFs
const fileFilter = (req, file, cb) => {
  // Verificar extensão
  const allowedExtensions = ['.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error('Apenas arquivos PDF são permitidos'), false);
  }
  
  // Verificar MIME type
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Tipo de arquivo inválido. Apenas PDFs são aceitos'), false);
  }
  
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB padrão
    files: 1 // Apenas 1 arquivo por vez
  }
});

// Middleware para capturar erros do multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Arquivo muito grande',
        details: `O arquivo excede o tamanho máximo de ${(parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024) / (1024 * 1024)}MB`
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Muitos arquivos',
        details: 'Apenas um arquivo por vez é permitido'
      });
    }
    
    return res.status(400).json({
      error: 'Erro no upload',
      details: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      error: 'Erro no upload',
      details: err.message
    });
  }
  
  next();
};

module.exports = { upload, handleUploadError };
