const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message
    });
  }

  // Erro de arquivo não encontrado
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'Arquivo não encontrado',
      details: err.message
    });
  }

  // Erro de tipo de arquivo inválido
  if (err.message && err.message.includes('tipo de arquivo')) {
    return res.status(400).json({
      error: 'Tipo de arquivo inválido',
      details: err.message
    });
  }

  // Erro de tamanho de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      details: 'O arquivo excede o tamanho máximo permitido'
    });
  }

  // Erro de PDF inválido
  if (err.message && err.message.includes('PDF')) {
    return res.status(400).json({
      error: 'PDF inválido',
      details: err.message
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
