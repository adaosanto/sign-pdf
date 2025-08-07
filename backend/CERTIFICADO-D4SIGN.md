# Certificado de Assinatura Digital - Replicação D4Sign

## Visão Geral

A página de validação do PDF Signer foi completamente reformulada para replicar fielmente o layout e estilo do certificado de assinaturas da D4Sign, mantendo a funcionalidade de validação digital.

## Características da Nova Página

### Layout e Design
- **Tamanho**: Página A4 (595.28 x 841.89 pontos)
- **Borda**: Borda verde padrão simulando o certificado D4Sign
- **Fundo**: Cor de fundo clara para melhor legibilidade

### Cabeçalho
- **Logo D4Sign**: "D4Sign by ZUCCHETTI" no canto superior esquerdo
- **Logo NTP.br**: "ntp.br" no canto superior direito
- **Informações de sincronização**: 
  - "3 páginas - Datas e horários baseados em Brasília, Brasil"
  - "Sincronizado com o NTP.br e Observatório Nacional (ON)"

### Título Principal
- **"Certificado de assinaturas"** centralizado
- **Data e hora de geração** no formato brasileiro

### Informações do Documento
- **Título do documento**: Nome do arquivo original
- **Código do documento**: UUID único gerado automaticamente

### Seção de Assinaturas
- **Nome do assinante**: Dados fornecidos no formulário
- **Email**: Email do assinante
- **Status**: "Assinou" com indicador visual
- **Assinatura visual**: Nome do assinante em estilo manuscrito
- **Checkmark verde**: Indicador de assinatura válida

### Timeline de Eventos
Cronologia completa das ações realizadas no documento:
1. **Criação do documento**: Por quem e quando
2. **Início das assinaturas**: Quem iniciou o processo
3. **Assinatura efetivada**: Detalhes da assinatura final

### Hash do Documento Original
- **SHA256**: Hash principal do documento
- **SHA512**: Hash secundário para verificação adicional
- **Declaração de exclusividade**: "Esse log pertence única e exclusivamente aos documentos de HASH acima"

### QR Code
- **Posicionamento**: Lado direito da página
- **Conteúdo**: Link de validação direto
- **Tamanho**: 120x120 pontos

### Certificação e Validade Legal
- **Logo ICP Brasil**: Certificação oficial
- **Textos legais**:
  - "Esse documento está assinado e certificado pelo PDF Signer"
  - "Integridade certificada no padrão ICP-BRASIL"
  - "Assinaturas eletrônicas e físicas têm igual validade legal, conforme MP 2.200-2/2001 e Lei 14.063/2020"

## Funcionalidades Técnicas

### Geração de UUID
```javascript
generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

### Geração de Hash SHA512
```javascript
generateSHA512(input) {
  const crypto = require('crypto');
  return crypto.createHash('sha512').update(input).digest('hex');
}
```

### Formatação de Data
- **Formato brasileiro**: "24 Jul 2025, 23:21:18"
- **Fuso horário**: Brasília, Brasil
- **Sincronização**: NTP.br e Observatório Nacional

## Dados Incluídos

### Informações do Assinante
- Nome completo
- Email
- Data e hora da assinatura
- Motivo da assinatura
- Local da assinatura

### Metadados do Documento
- Nome do arquivo original
- Hash SHA256 e SHA512
- UUID único do documento
- Assinatura digital de 32 caracteres

### Informações de Validação
- QR Code com link direto
- URL de validação completa
- Instruções de uso

## Compatibilidade

### Formatos Suportados
- **Entrada**: PDF padrão
- **Saída**: PDF com página adicional de certificado
- **Validação**: Interface web responsiva

### Navegadores
- Chrome/Chromium
- Firefox
- Safari
- Edge

### Dispositivos
- Desktop
- Tablet
- Smartphone (via QR Code)

## Exemplo de Uso

```javascript
// Dados da assinatura
const signatureData = {
  name: "João Silva",
  email: "joao.silva@empresa.com",
  date: "2025-07-24",
  reason: "Aprovação do contrato",
  location: "São Paulo, SP"
};

// Assinar PDF
const signedPDF = await pdfService.signPDF('documento.pdf', signatureData);
```

## Validação

### Via Web
1. Acesse a URL de validação
2. Digite a assinatura digital de 32 caracteres
3. Confirme a autenticidade do documento

### Via QR Code
1. Escaneie o QR code com o smartphone
2. Acesse automaticamente a página de validação
3. Verifique a integridade do documento

## Segurança

### Hash de Integridade
- **SHA256**: Verificação principal
- **SHA512**: Verificação secundária
- **Imutabilidade**: Qualquer alteração invalida o documento

### Assinatura Digital
- **32 caracteres**: Comprimento padrão
- **URL-safe**: Caracteres seguros para URLs
- **Única**: Cada documento tem assinatura única

### Certificação
- **ICP-Brasil**: Padrão oficial brasileiro
- **Validade legal**: Equiparada a assinatura física
- **Auditoria**: Log completo de eventos

## Manutenção

### Atualizações
- Verificar compatibilidade com novas versões do pdf-lib
- Manter sincronização com padrões ICP-Brasil
- Atualizar bibliotecas de QR Code conforme necessário

### Monitoramento
- Logs de geração de certificados
- Estatísticas de validação
- Performance da geração de hash

## Troubleshooting

### Problemas Comuns
1. **Erro de fonte**: Verificar disponibilidade das fontes padrão
2. **QR Code inválido**: Verificar tamanho e margens
3. **Hash incorreto**: Verificar integridade do buffer do PDF

### Soluções
1. Usar fontes do sistema
2. Ajustar parâmetros do QR Code
3. Validar entrada de dados

## Conclusão

A nova página de validação oferece uma experiência visual idêntica ao certificado D4Sign, mantendo todas as funcionalidades de segurança e validação digital. O layout profissional e a conformidade com padrões brasileiros garantem a aceitação legal dos documentos assinados.
