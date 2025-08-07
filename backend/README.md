# PDF Signer API

Uma API Node.js para assinar PDFs digitalmente com assinaturas visuais e hash de integridade.

## 🚀 Funcionalidades

- ✅ Upload de arquivos PDF
- ✅ Validação de PDFs
- ✅ Assinatura digital com dados personalizáveis
- ✅ **Assinatura digital URL-safe de 32 caracteres em todas as páginas**
- ✅ **Nova página com certificado de assinatura, QR code e link de validação**
- ✅ **Sistema de validação de assinaturas via API e interface web**
- ✅ Hash SHA-256 para verificação de integridade
- ✅ Limpeza automática de arquivos temporários
- ✅ Rate limiting e segurança
- ✅ CORS configurado
- ✅ Tratamento de erros robusto

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e navegue para o diretório backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
```

4. **Edite o arquivo .env com suas configurações:**
```env
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🚀 Executando a aplicação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

### 🌐 Interface Web
- **Interface principal**: http://localhost:3000
- **Interface alternativa**: http://localhost:3000/interface
- **Validador de assinaturas**: http://localhost:3000/validator
- **Arquivos estáticos**: http://localhost:3000/examples/

## 📚 Endpoints da API

### 1. Interface Web
```http
GET /
GET /interface
```

### 2. Health Check
```http
GET /health
```

### 3. Informações da API
```http
GET /api
GET /api/pdf/info
```

### 4. Validação de Assinaturas
```http
GET /validate?signature=ASSINATURA&hash=HASH
GET /validator
```

### 5. Upload e Assinatura de PDF
```http
POST /api/pdf/sign
Content-Type: multipart/form-data

Body:
- pdf: arquivo PDF
- name: nome do assinante (opcional)
- date: data da assinatura (opcional)
- reason: motivo da assinatura (opcional)
- location: local da assinatura (opcional)
- position: posição da assinatura em JSON (opcional)
- fontSize: tamanho da fonte (opcional)
```

### 6. Apenas Upload (validação)
```http
POST /api/pdf/upload
Content-Type: multipart/form-data

Body:
- pdf: arquivo PDF
```

## 🔧 Exemplos de Uso

### Usando cURL

**Assinar um PDF:**
```bash
curl -X POST http://localhost:3000/api/pdf/sign \
  -F "pdf=@documento.pdf" \
  -F "name=João Silva" \
  -F "reason=Aprovação do documento" \
  -F "location=São Paulo, SP" \
  --output documento-assinado.pdf
```

**Apenas validar upload:**
```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -F "pdf=@documento.pdf"
```

### Usando JavaScript/Fetch

```javascript
// Assinar PDF
const formData = new FormData();
formData.append('pdf', pdfFile);
formData.append('name', 'João Silva');
formData.append('reason', 'Aprovação do documento');

const response = await fetch('http://localhost:3000/api/pdf/sign', {
  method: 'POST',
  body: formData
});

if (response.ok) {
  const signedPdfBlob = await response.blob();
  // Fazer download do PDF assinado
  const url = window.URL.createObjectURL(signedPdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'documento-assinado.pdf';
  a.click();
}
```

## 🛡️ Segurança

- **Helmet.js**: Headers de segurança
- **Rate Limiting**: Limite de requisições por IP
- **CORS**: Configuração de origens permitidas
- **Validação de arquivos**: Apenas PDFs são aceitos
- **Limpeza automática**: Arquivos temporários são removidos
- **Hash de integridade**: SHA-256 para verificação

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── server.js          # Servidor principal
│   ├── routes/
│   │   └── pdfRoutes.js   # Rotas da API
│   ├── services/
│   │   └── pdfService.js  # Lógica de manipulação de PDFs
│   └── middleware/
│       ├── errorHandler.js # Tratamento de erros
│       └── upload.js      # Configuração de upload
├── uploads/               # Diretório de uploads (criado automaticamente)
├── package.json
├── .env                   # Variáveis de ambiente
├── .gitignore
└── README.md
```

## 🔧 Configurações

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente (development/production) | development |
| `MAX_FILE_SIZE` | Tamanho máximo do arquivo (bytes) | 10485760 (10MB) |
| `UPLOAD_PATH` | Diretório de uploads | ./uploads |
| `RATE_LIMIT_WINDOW_MS` | Janela do rate limit (ms) | 900000 (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requisições por janela | 100 |

## 🧪 Testes

```bash
npm test
```

## 📦 Dependências Principais

- **express**: Framework web
- **pdf-lib**: Manipulação de PDFs
- **multer**: Upload de arquivos
- **crypto**: Geração de hash
- **helmet**: Segurança
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.
