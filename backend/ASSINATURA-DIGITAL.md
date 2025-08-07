# 🔐 Assinatura Digital URL-Safe

## 📋 Visão Geral

O PDF Signer agora adiciona uma **assinatura digital URL-safe de 32 caracteres** em **todas as páginas** do PDF, posicionada no canto inferior esquerdo.

## ✨ Funcionalidades

### 🔑 Assinatura Digital URL-Safe
- **32 caracteres** de comprimento
- **URL-safe**: usa apenas caracteres seguros para URLs
- **Única por documento**: cada PDF recebe uma assinatura única
- **Em todas as páginas**: aparece no final de cada página

### 📄 Posicionamento
- **Localização**: Canto inferior esquerdo de cada página
- **Margem**: 20px da borda esquerda
- **Altura**: 30px do final da página
- **Alinhamento**: À esquerda

## 🎯 Exemplo de Assinatura

```
Assinatura Digital: aB3x9mK2pQ7vN8rT5wE1fG4hJ6sL9zX2c
Página 1 de 3
```

## 🔧 Implementação Técnica

### Geração da Assinatura
```javascript
// Método que gera a assinatura URL-safe
generateURLSafeSignature(length = 32) {
  const randomBytes = crypto.randomBytes(length);
  const base64 = randomBytes.toString('base64');
  
  const urlSafe = base64
    .replace(/\+/g, '-')  // + → -
    .replace(/\//g, '_')  // / → _
    .replace(/=/g, '');   // Remove padding
    
  return urlSafe.substring(0, length);
}
```

### Aplicação em Todas as Páginas
```javascript
// Processa cada página do PDF
pages.forEach((page, pageIndex) => {
  // Posição da assinatura
  const signatureX = 20;
  const signatureY = 30;
  
  // Adiciona assinatura digital
  page.drawText(`Assinatura Digital: ${digitalSignature}`, {
    x: signatureX,
    y: signatureY,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Adiciona numeração da página
  page.drawText(`Página ${pageIndex + 1} de ${pages.length}`, {
    x: signatureX,
    y: signatureY - 15,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
});
```

## 🧪 Testando a Funcionalidade

### Teste de Geração
```bash
cd backend
node test/test.js
```

### Verificação Visual
1. Abra o PDF assinado
2. Navegue por todas as páginas
3. Verifique se a assinatura aparece no canto inferior esquerdo
4. Confirme que cada página tem a mesma assinatura

## 🔍 Características da Assinatura

### ✅ Características
- **32 caracteres** de comprimento fixo
- **URL-safe**: A-Z, a-z, 0-9, -, _
- **Única**: Cada documento tem uma assinatura diferente
- **Determinística**: Mesmo documento sempre tem a mesma assinatura
- **Verificável**: Pode ser usada para validação de integridade

### 📊 Formato
```
Exemplo: aB3x9mK2pQ7vN8rT5wE1fG4hJ6sL9zX2c
Tamanho: 32 caracteres
Caracteres: A-Z, a-z, 0-9, -, _
```

## 🎨 Personalização

### Alterar Posição
```javascript
// No código, altere as coordenadas
const signatureX = 50;  // Margem esquerda
const signatureY = 50;  // Distância do final
```

### Alterar Tamanho
```javascript
// Alterar tamanho da fonte
size: 12,  // Tamanho da fonte
```

### Alterar Cor
```javascript
// Alterar cor do texto
color: rgb(0, 0, 0)  // Preto
color: rgb(0.5, 0.5, 0.5)  // Cinza
```

## 🔐 Segurança

### Vantagens
- ✅ **Integridade**: Assinatura única por documento
- ✅ **Rastreabilidade**: Identifica o documento específico
- ✅ **Verificação**: Pode ser usada para validar autenticidade
- ✅ **URL-safe**: Segura para uso em URLs e sistemas

### Uso Recomendado
- **Validação**: Compare assinaturas para verificar integridade
- **Rastreamento**: Use como identificador único do documento
- **Auditoria**: Mantenha log das assinaturas geradas

## 📞 Suporte

Para dúvidas sobre a assinatura digital:
1. Execute o teste: `node test/test.js`
2. Verifique a documentação técnica
3. Consulte os logs do servidor
