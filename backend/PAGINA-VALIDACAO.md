# 📄 Página de Validação com QR Code

## 📋 Visão Geral

O PDF Signer agora adiciona automaticamente uma **nova página** ao final de cada PDF assinado, contendo:

- ✅ **Certificado de assinatura digital**
- ✅ **QR code para validação**
- ✅ **Link direto de validação**
- ✅ **Detalhes completos da assinatura**
- ✅ **Instruções de uso**

## 🎯 Conteúdo da Página de Validação

### 📊 Informações do Documento
- **Assinatura Digital**: 32 caracteres URL-safe
- **Hash do Documento**: SHA-256 completo
- **Data de Assinatura**: Data e hora da assinatura

### 👤 Informações do Assinante
- **Nome**: Nome do assinante
- **Motivo**: Razão da assinatura
- **Local**: Local da assinatura

### 🔍 QR Code e Validação
- **QR Code**: Contém link direto para validação
- **Link de Validação**: URL completa para verificação
- **Instruções**: Passo a passo para validar

## 🔧 Implementação Técnica

### Geração do QR Code
```javascript
// Gerar QR code com URL de validação
async generateQRCodeBuffer(data) {
  const qrCodeDataURL = await QRCode.toDataURL(data, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  // Converter para buffer
  const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}
```

### URL de Validação
```javascript
// Gerar URL de validação
generateValidationURL(signature, documentHash) {
  const baseURL = process.env.VALIDATION_BASE_URL || 'http://localhost:3000';
  return `${baseURL}/validate?signature=${signature}&hash=${documentHash.substring(0, 16)}`;
}
```

## 🧪 Testando a Funcionalidade

### 1. Assinar um PDF
```bash
curl -X POST http://localhost:3000/api/pdf/sign \
  -F "pdf=@documento.pdf" \
  -F "name=João Silva" \
  --output documento-assinado.pdf
```

### 2. Verificar a Página de Validação
1. Abra o PDF assinado
2. Navegue até a última página
3. Verifique se contém:
   - Título "CERTIFICADO DE ASSINATURA DIGITAL"
   - QR code
   - Link de validação
   - Informações completas

### 3. Testar Validação
```bash
# Via API
curl "http://localhost:3000/validate?signature=ASSINATURA&hash=HASH"

# Via interface web
# Acesse: http://localhost:3000/validator
```

## 🌐 Interface de Validação

### Acesso
- **URL**: http://localhost:3000/validator
- **Funcionalidade**: Interface web para validar assinaturas

### Como Usar
1. **Copie a assinatura** do PDF (32 caracteres)
2. **Cole no campo** da interface
3. **Clique em "Validar Assinatura"**
4. **Veja o resultado** da validação

## 📱 QR Code

### Funcionalidades
- **Escaneável**: Use qualquer app de QR code
- **Link direto**: Leva para a página de validação
- **Parâmetros automáticos**: Inclui assinatura e hash

### Exemplo de URL no QR Code
```
http://localhost:3000/validate?signature=aB3x9mK2pQ7vN8rT5wE1fG4hJ6sL9zX2c&hash=a1b2c3d4e5f6
```

## 🔐 Validação via API

### Endpoint
```http
GET /validate?signature=ASSINATURA&hash=HASH
```

### Resposta
```json
{
  "signature": "aB3x9mK2pQ7vN8rT5wE1fG4hJ6sL9zX2c",
  "hash": "a1b2c3d4e5f6",
  "isValid": true,
  "validatedAt": "2024-01-01T12:00:00.000Z",
  "message": "Assinatura válida! Este documento é autêntico.",
  "details": {
    "signatureLength": 32,
    "expectedLength": 32,
    "format": "URL-safe (A-Z, a-z, 0-9, -, _)"
  }
}
```

## ⚙️ Configuração

### Variáveis de Ambiente
```bash
# .env
VALIDATION_BASE_URL=http://localhost:3000
```

### Personalização
```javascript
// Alterar URL base de validação
process.env.VALIDATION_BASE_URL = 'https://seudominio.com';

// Alterar tamanho do QR code
width: 200,  // Largura em pixels
margin: 2,   // Margem em pixels
```

## 🎨 Layout da Página

### Estrutura
```
┌─────────────────────────────────────┐
│     CERTIFICADO DE ASSINATURA       │
│           DIGITAL                   │
├─────────────────────────────────────┤
│  INFORMAÇÕES DO DOCUMENTO           │
│  • Assinatura Digital: ...          │
│  • Hash do Documento: ...           │
│  • Data de Assinatura: ...          │
│                                     │
│  INFORMAÇÕES DO ASSINANTE           │
│  • Nome: ...                        │
│  • Motivo: ...                      │
│  • Local: ...                       │
│                                     │
│  QR CODE PARA VALIDAÇÃO             │
│  ┌─────────────┐                    │
│  │             │                    │
│  │    QR       │                    │
│  │   CODE      │                    │
│  │             │                    │
│  └─────────────┘                    │
│                                     │
│  LINK DE VALIDAÇÃO                  │
│  http://localhost:3000/validate?... │
│                                     │
│  INSTRUÇÕES DE VALIDAÇÃO            │
│  1. Escaneie o QR code...           │
│  2. Ou acesse o link...             │
│  3. Digite a assinatura...          │
│  4. O sistema confirmará...         │
└─────────────────────────────────────┘
```

## 🔄 Fluxo Completo

### 1. Assinatura
```
PDF Original → Assinatura → PDF com Página de Validação
```

### 2. Validação
```
QR Code/Link → Interface → API → Resultado
```

### 3. Verificação
```
Assinatura → Validação → Confirmação de Autenticidade
```

## 📞 Suporte

Para dúvidas sobre a página de validação:

1. **Teste a funcionalidade**: `node test/test.js`
2. **Verifique a interface**: http://localhost:3000/validator
3. **Teste a API**: `curl "http://localhost:3000/validate?signature=TESTE"`
4. **Consulte os logs**: Verifique se há erros no servidor

## 🎯 Vantagens

- ✅ **Facilidade**: QR code para validação rápida
- ✅ **Acessibilidade**: Interface web amigável
- ✅ **Segurança**: Validação via API
- ✅ **Rastreabilidade**: Informações completas
- ✅ **Portabilidade**: Funciona em qualquer dispositivo
