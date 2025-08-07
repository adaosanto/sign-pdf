# Endpoint GET para Geração de PDF

## Visão Geral

O endpoint `/generate-pdf` permite gerar um PDF assinado digitalmente diretamente via parâmetros GET na URL, retornando o conteúdo do PDF para exibição no navegador.

## URL Base

```
GET /generate-pdf
```

## Parâmetros

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `name` | string | Não | "Assinatura Digital" | Nome do assinante |
| `email` | string | Não | "assinatura@digital.com" | Email do assinante |
| `date` | string | Não | Data atual | Data da assinatura (formato: DD/MM/YYYY) |
| `reason` | string | Não | "Documento aprovado" | Motivo da assinatura |
| `location` | string | Não | "Brasil" | Local da assinatura |
| `title` | string | Não | "Documento PDF" | Título do documento |
| `fontSize` | number | Não | 12 | Tamanho da fonte |

## Exemplos de Uso

### Exemplo Básico
```
http://localhost:3000/generate-pdf
```

### Exemplo com Dados Personalizados
```
http://localhost:3000/generate-pdf?name=Joao%20Silva&email=joao@empresa.com&reason=Aprovacao%20de%20contrato&location=Sao%20Paulo&title=Contrato%20de%20Servicos
```

### Exemplo Completo
```
http://localhost:3000/generate-pdf?name=Maria%20Santos&email=maria@empresa.com&date=15/12/2024&reason=Aprovacao%20de%20proposta&location=Rio%20de%20Janeiro&title=Proposta%20Comercial&fontSize=14
```

## Resposta

### Sucesso (200 OK)
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `inline; filename="documento-assinado.pdf"`
- **Body**: Conteúdo binário do PDF

### Erro (500 Internal Server Error)
```json
{
  "error": "Erro ao gerar PDF",
  "message": "Descrição do erro"
}
```

## Características do PDF Gerado

### Página Principal
- **Título do documento** (parâmetro `title`)
- **Conteúdo de exemplo** explicando que foi gerado via API
- **Data e hora de geração**
- **Assinatura principal** com todos os dados fornecidos
- **Assinatura digital** de 32 caracteres

### Página de Validação
- **Header D4Sign** com borda verde e logos
- **Informações de sincronização** NTP.br
- **Certificado de assinaturas** com data/hora
- **Título e código do documento**
- **Seção de assinaturas** com dados do assinante
- **Timeline de eventos** do documento
- **Hash SHA256 e SHA512** do documento
- **QR Code** para validação
- **Certificação legal** ICP-Brasil

## Codificação de URL

### Caracteres Especiais
- Use `%20` para espaços
- Use `%2F` para barras (/)
- Use `%3A` para dois pontos (:)
- Use `%40` para arroba (@)

### Exemplo de Codificação
```
João Silva → Joao%20Silva
São Paulo → Sao%20Paulo
Aprovação → Aprovacao
```

## Casos de Uso

### 1. Teste Rápido
Acesse diretamente no navegador para ver o PDF com dados padrão:
```
http://localhost:3000/generate-pdf
```

### 2. Desenvolvimento
Use para testar diferentes configurações durante o desenvolvimento:
```
http://localhost:3000/generate-pdf?name=Teste&fontSize=16
```

### 3. Integração
Use em links ou iframes para exibir PDFs dinâmicos:
```html
<iframe src="http://localhost:3000/generate-pdf?name=Usuario&title=Relatorio"></iframe>
```

### 4. Validação
Teste a página de validação D4Sign com diferentes dados:
```
http://localhost:3000/generate-pdf?name=Validador&email=teste@teste.com&reason=Teste%20de%20validacao
```

## Limitações

### Tamanho da URL
- URLs muito longas podem ser truncadas pelo navegador
- Recomenda-se usar no máximo 2048 caracteres

### Caracteres Suportados
- Apenas caracteres ASCII são suportados
- Caracteres especiais devem ser codificados
- Acentos são removidos automaticamente

### Performance
- Geração síncrona pode demorar alguns segundos
- Cache do navegador pode ser usado para melhorar performance

## Segurança

### Validação de Entrada
- Todos os parâmetros são validados
- Caracteres perigosos são removidos
- Tamanhos de fonte são limitados

### Rate Limiting
- Endpoint sujeito ao rate limiting geral da API
- Máximo de 100 requests por 15 minutos

## Exemplos de Integração

### JavaScript
```javascript
// Abrir PDF em nova aba
const url = `http://localhost:3000/generate-pdf?name=${encodeURIComponent(nome)}&title=${encodeURIComponent(titulo)}`;
window.open(url, '_blank');
```

### HTML
```html
<!-- Link direto -->
<a href="http://localhost:3000/generate-pdf?name=Joao&title=Documento" target="_blank">
  Gerar PDF
</a>

<!-- Iframe embutido -->
<iframe src="http://localhost:3000/generate-pdf?name=Usuario" width="100%" height="600"></iframe>
```

### cURL
```bash
curl -o documento.pdf "http://localhost:3000/generate-pdf?name=Teste&title=Documento"
```

## Troubleshooting

### Problemas Comuns

1. **PDF não abre no navegador**
   - Verifique se o Content-Type está correto
   - Tente baixar o arquivo primeiro

2. **Caracteres especiais incorretos**
   - Use encodeURIComponent() para codificar parâmetros
   - Verifique se não há caracteres não-ASCII

3. **Erro de codificação**
   - Todos os textos usam apenas caracteres ASCII
   - Acentos são removidos automaticamente

4. **Performance lenta**
   - Geração é síncrona e pode demorar
   - Considere usar cache para requests repetidos

### Logs
Verifique os logs do servidor para erros detalhados:
```bash
npm start
# Acesse o endpoint e veja os logs
```
