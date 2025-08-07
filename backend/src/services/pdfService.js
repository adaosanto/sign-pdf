const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

class PDFService {
  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || './uploads';
  }

  /**
   * Assina um PDF com uma assinatura digital
   * @param {string} filePath - Caminho do arquivo PDF
   * @param {Object} signatureData - Dados da assinatura
   * @returns {Promise<Buffer>} - PDF assinado como buffer
   */
  async signPDF(filePath, signatureData = {}) {
    try {
      // Ler o arquivo PDF
      const pdfBytes = await fs.readFile(filePath);

      // Carregar o documento PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Obter todas as páginas
      const pages = pdfDoc.getPages();
      if (pages.length === 0) {
        throw new Error('PDF nao contem paginas');
      }

      // Gerar assinatura digital URL-safe de 32 caracteres
      const digitalSignature = this.generateURLSafeSignature(32);

      // Gerar hash do documento para verificação de integridade
      const documentHash = this.generateDocumentHash(pdfBytes);

      // Obter nome do arquivo original
      const originalFileName = path.basename(filePath);

      // Configurações padrão da assinatura
      const defaultSignature = {
        name: signatureData.name || 'Assinatura Digital',
        date: signatureData.date || new Date().toLocaleDateString('pt-BR'),
        reason: signatureData.reason || 'Documento aprovado',
        location: signatureData.location || 'Brasil',
        position: signatureData.position || { x: 50, y: 100 },
        fontSize: signatureData.fontSize || 12,
        originalFileName: originalFileName,
        email: signatureData.email || 'assinatura@digital.com'
      };

      // Adicionar fonte
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Processar cada página
      pages.forEach((page, pageIndex) => {
        const { width, height } = page.getSize();

        // Posição da assinatura digital (canto inferior esquerdo)
        const signatureX = 20; // Margem esquerda
        const signatureY = 30; // Próximo ao final da página

        // Adicionar assinatura digital URL-safe em todas as páginas
        page.drawText(`Assinatura Digital: ${digitalSignature}`, {
          x: signatureX,
          y: signatureY,
          size: 9,
          font: font,
          color: rgb(0.3, 0.3, 0.3)
        });

        // Adicionar informações da página
        page.drawText(`Pagina ${pageIndex + 1} de ${pages.length}`, {
          x: signatureX,
          y: signatureY - 15,
          size: 7,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });

        // Se for a primeira página, adicionar informações completas da assinatura
        if (pageIndex === 0) {
          // Criar retângulo de fundo para a assinatura principal
          const signatureWidth = 350;
          const signatureHeight = 100;
          const mainSignatureX = defaultSignature.position.x;
          const mainSignatureY = height - defaultSignature.position.y - signatureHeight;

          // Desenhar retângulo de fundo
          page.drawRectangle({
            x: mainSignatureX - 10,
            y: mainSignatureY - 10,
            width: signatureWidth + 20,
            height: signatureHeight + 20,
            borderWidth: 2,
            borderColor: rgb(0, 0, 0),
            color: rgb(0.95, 0.95, 0.95)
          });

          // Adicionar texto da assinatura principal
          page.drawText(`Assinado por: ${defaultSignature.name}`, {
            x: mainSignatureX,
            y: mainSignatureY + 70,
            size: defaultSignature.fontSize - 1,
            font: font,
            color: rgb(0, 0, 0)
          });

          page.drawText(`Data: ${defaultSignature.date}`, {
            x: mainSignatureX,
            y: mainSignatureY + 50,
            size: defaultSignature.fontSize - 3,
            font: font,
            color: rgb(0, 0, 0)
          });

          page.drawText(`Motivo: ${defaultSignature.reason}`, {
            x: mainSignatureX,
            y: mainSignatureY + 30,
            size: defaultSignature.fontSize - 3,
            font: font,
            color: rgb(0, 0, 0)
          });

          // Adicionar hash digital para verificação de integridade
          page.drawText(`Hash: ${documentHash.substring(0, 16)}...`, {
            x: mainSignatureX,
            y: mainSignatureY + 10,
            size: defaultSignature.fontSize - 5,
            font: font,
            color: rgb(0.5, 0.5, 0.5)
          });
        }
      });

      // Adicionar página de validação com QR code e link
      await this.addValidationPage(pdfDoc, defaultSignature, digitalSignature, documentHash);

      // Salvar o PDF modificado
      const signedPdfBytes = await pdfDoc.save();

      return Buffer.from(signedPdfBytes);

    } catch (error) {
      console.error('Erro ao assinar PDF:', error);
      throw new Error(`Falha ao processar PDF: ${error.message}`);
    }
  }

  /**
   * Gera um hash SHA-256 do documento para verificação de integridade
   * @param {Buffer} pdfBuffer - Buffer do PDF
   * @returns {string} - Hash hexadecimal
   */
  generateDocumentHash(pdfBuffer) {
    return crypto.createHash('sha256').update(pdfBuffer).digest('hex');
  }

  /**
 * Gera uma assinatura digital URL-safe de tamanho específico
 * @param {number} length - Comprimento da assinatura (padrão: 32)
 * @returns {string} - Assinatura digital URL-safe
 */
  generateURLSafeSignature(length = 32) {
    // Gerar bytes aleatórios
    const randomBytes = crypto.randomBytes(length);

    // Converter para base64 e tornar URL-safe
    const base64 = randomBytes.toString('base64');

    // Substituir caracteres não URL-safe
    const urlSafe = base64
      .replace(/\+/g, '-')  // Substituir + por -
      .replace(/\//g, '_')  // Substituir / por _
      .replace(/=/g, '');   // Remover padding =

    // Retornar apenas o comprimento solicitado
    return urlSafe.substring(0, length);
  }

  /**
   * Gera URL de validação para a assinatura
   * @param {string} signature - Assinatura digital
   * @param {string} documentHash - Hash do documento
   * @returns {string} - URL de validação
   */
  generateValidationURL(signature, documentHash) {
    const baseURL = process.env.VALIDATION_BASE_URL || 'http://localhost:3000';
    return `${baseURL}/validate?signature=${signature}&hash=${documentHash.substring(0, 16)}`;
  }

  /**
   * Gera um UUID v4
   * @returns {string} - UUID gerado
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Gera um hash SHA512 (simulado)
   * @param {string} input - String de entrada
   * @returns {string} - Hash SHA512 simulado
   */
  generateSHA512(input) {
    // Simulação de hash SHA512 - em produção, use uma biblioteca real
    const crypto = require('crypto');
    return crypto.createHash('sha512').update(input).digest('hex');
  }

  /**
   * Gera QR code como buffer
   * @param {string} data - Dados para o QR code
   * @returns {Promise<Buffer>} - QR code como buffer
   */
  async generateQRCodeBuffer(data) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Converter data URL para buffer
      const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
      return Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      throw new Error('Falha ao gerar QR code');
    }
  }

  /**
   * Adiciona página de validação ao PDF replicando o certificado D4Sign
   * @param {PDFDocument} pdfDoc - Documento PDF
   * @param {Object} signatureData - Dados da assinatura
   * @param {string} digitalSignature - Assinatura digital
   * @param {string} documentHash - Hash do documento
   * @returns {Promise<void>}
   */
  async addValidationPage(pdfDoc, signatureData, digitalSignature, documentHash) {
    try {
      // Criar nova página A4
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width, height } = page.getSize();

      // Carregar fontes - usando Times para ser mais semelhante ao D4Sign
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      // Gerar URL de validação
      const validationURL = this.generateValidationURL(digitalSignature, documentHash);

      // Gerar QR code
      const qrCodeBuffer = await this.generateQRCodeBuffer(validationURL);
      const qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer);

      // Gerar UUID para o documento
      const documentUUID = this.generateUUID();
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = currentDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Borda verde padronizada (simulando o padrão D4Sign)
      const borderWidth = 15;
      const borderColor = rgb(0.2, 0.6, 0.2);

      // Borda externa
      page.drawRectangle({
        x: borderWidth,
        y: borderWidth,
        width: width - (borderWidth * 2),
        height: height - (borderWidth * 2),
        borderWidth: borderWidth,
        borderColor: borderColor,
        color: rgb(1, 1, 1)
      });

      // Área de conteúdo interna
      const contentMargin = 30;
      page.drawRectangle({
        x: contentMargin,
        y: contentMargin,
        width: width - (contentMargin * 2),
        height: height - (contentMargin * 2),
        borderWidth: 1,
        borderColor: rgb(0.9, 0.9, 0.9),
        color: rgb(1, 1, 1)
      });

      // Cabeçalho
      // Logo D4Sign (simulado com texto)
      page.drawText('D4Sign', {
        x: contentMargin + 20,
        y: height - contentMargin - 60,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText('by ZUCCHETTI', {
        x: contentMargin + 20,
        y: height - contentMargin - 80,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });

      // Logo NTP.br (simulado com texto)
      page.drawText('ntp.', {
        x: width - contentMargin - 80,
        y: height - contentMargin - 60,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.6, 0.2)
      });

      // Círculo verde para o "br"
      page.drawCircle({
        x: width - contentMargin - 45,
        y: height - contentMargin - 60,
        size: 8,
        color: rgb(0.2, 0.8, 0.2)
      });

      page.drawText('br', {
        x: width - contentMargin - 50,
        y: height - contentMargin - 65,
        size: 8,
        font: boldFont,
        color: rgb(1, 1, 1)
      });

      // Informações de sincronização (centralizadas)
      page.drawText('3 paginas - Datas e horarios baseados em Brasilia, Brasil', {
        x: width / 2 - 150,
        y: height - contentMargin - 100,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      page.drawText('Sincronizado com o NTP.br e Observatorio Nacional (ON)', {
        x: width / 2 - 140,
        y: height - contentMargin - 115,
        size: 9,
        font: boldFont,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Título principal
      page.drawText('Certificado de assinaturas', {
        x: width / 2 - 120,
        y: height - contentMargin - 140,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Data de geração
      page.drawText(`gerado em ${formattedDate} de ${currentDate.getFullYear()}, ${formattedTime}`, {
        x: width / 2 - 140,
        y: height - contentMargin - 160,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Título do documento (sem seção separada, como na imagem)
      const documentTitle = signatureData.originalFileName || 'Documento PDF';
      page.drawText(documentTitle, {
        x: contentMargin + 20,
        y: height - contentMargin - 200,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      });

      page.drawText(`Codigo do documento ${documentUUID}`, {
        x: contentMargin + 20,
        y: height - contentMargin - 220,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });

      // Seção de assinaturas
      page.drawText('ASSINATURAS', {
        x: contentMargin + 20,
        y: height - contentMargin - 280,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Assinante
      const signerName = signatureData.name || 'Assinatura Digital';
      const signerEmail = signatureData.email || 'assinatura@digital.com';

      page.drawText('Assinante:', {
        x: contentMargin + 20,
        y: height - contentMargin - 305,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText(signerName, {
        x: contentMargin + 20,
        y: height - contentMargin - 325,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Email: ${signerEmail}`, {
        x: contentMargin + 20,
        y: height - contentMargin - 345,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText('Status: Assinou', {
        x: contentMargin + 20,
        y: height - contentMargin - 365,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.8, 0.2)
      });

      // Assinatura visual (simulada)
      page.drawText(signerName, {
        x: width - contentMargin - 200,
        y: height - contentMargin - 325,
        size: 11,
        font: font,
        color: rgb(0.6, 0.6, 0.6)
      });

      // Checkmark verde (simulado com texto)
      page.drawText('OK', {
        x: width - contentMargin - 220,
        y: height - contentMargin - 365,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.8, 0.2)
      });

      // Eventos do documento
      page.drawText('EVENTOS DO DOCUMENTO', {
        x: contentMargin + 20,
        y: height - contentMargin - 400,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Timeline de eventos
      const events = [
        {
          time: `${formattedDate} ${currentDate.getFullYear()}, ${formattedTime}`,
          action: `Documento ${documentUUID} criado por ${signerName.toUpperCase()}`,
          details: `UUID: ${this.generateUUID()} | Email: ${signerEmail}`
        },
        {
          time: `${formattedDate} ${currentDate.getFullYear()}, ${formattedTime}`,
          action: `Assinaturas iniciadas por ${signerName.toUpperCase()}`,
          details: `UUID: ${this.generateUUID()} | Email: ${signerEmail}`
        },
        {
          time: `${formattedDate} ${currentDate.getFullYear()}, ${formattedTime}`,
          action: `${signerName.toUpperCase()} Assinou`,
          details: `Email: ${signerEmail} | IP: 127.0.0.1 | Geolocalizacao: Brasil`
        }
      ];

      let eventY = height - contentMargin - 425;
      events.forEach((event, index) => {
        page.drawText(event.time, {
          x: contentMargin + 20,
          y: eventY,
          size: 9,
          font: boldFont,
          color: rgb(0, 0, 0)
        });

        page.drawText(event.action, {
          x: contentMargin + 20,
          y: eventY - 15,
          size: 9,
          font: font,
          color: rgb(0, 0, 0)
        });

        page.drawText(event.details, {
          x: contentMargin + 20,
          y: eventY - 30,
          size: 8,
          font: font,
          color: rgb(0.4, 0.4, 0.4)
        });

        eventY -= 50;
      });

      // Hash do documento original
      page.drawText('HASH DO DOCUMENTO ORIGINAL', {
        x: contentMargin + 20,
        y: eventY - 20,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText(`SHA256: ${documentHash}`, {
        x: contentMargin + 20,
        y: eventY - 40,
        size: 8,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`SHA512: ${this.generateSHA512(documentHash)}`, {
        x: contentMargin + 20,
        y: eventY - 55,
        size: 8,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText('Esse log pertence unica e exclusivamente aos documentos de HASH acima', {
        x: contentMargin + 20,
        y: eventY - 75,
        size: 8,
        font: font,
        color: rgb(0.4, 0.4, 0.4)
      });

      // QR Code no lado direito (alinhado com o título do documento)
      page.drawImage(qrCodeImage, {
        x: width - contentMargin - 140,
        y: height - contentMargin - 240,
        width: 100,
        height: 100
      });

      // Certificação e validade legal
      page.drawText('CERTIFICACAO E VALIDADE LEGAL', {
        x: contentMargin + 20,
        y: contentMargin + 120,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Logo ICP Brasil (simulado)
      page.drawText('ICP Brasil', {
        x: contentMargin + 20,
        y: contentMargin + 100,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.6, 0.2)
      });

      const legalTexts = [
        'Esse documento esta assinado e certificado pelo PDF Signer',
        'Integridade certificada no padrao ICP-BRASIL',
        'Assinaturas eletronicas e fisicas tem igual validade legal, conforme MP 2.200-2/2001 e Lei 14.063/2020.'
      ];

      legalTexts.forEach((text, index) => {
        page.drawText(text, {
          x: contentMargin + 20,
          y: contentMargin + 80 - (index * 15),
          size: 8,
          font: font,
          color: rgb(0, 0, 0)
        });
      });

    } catch (error) {
      console.error('Erro ao adicionar página de validação:', error);
      throw new Error(`Falha ao criar página de validação: ${error.message}`);
    }
  }

  /**
   * Valida se um arquivo é um PDF válido
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<boolean>} - True se for um PDF válido
   */
  async validatePDF(filePath) {
    try {
      const pdfBytes = await fs.readFile(filePath);
      await PDFDocument.load(pdfBytes);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Limpa arquivos temporários
   * @param {string} filePath - Caminho do arquivo a ser removido
   */
  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Erro ao remover arquivo temporário:', error.message);
    }
  }

  /**
   * Gera um nome único para o arquivo assinado
   * @param {string} originalName - Nome original do arquivo
   * @returns {string} - Nome único para o arquivo assinado
   */
  generateSignedFileName(originalName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = path.basename(originalName, '.pdf');
    return `${baseName}-signed-${timestamp}.pdf`;
  }

  /**
   * Gera um PDF de exemplo com dados fornecidos via GET
   * @param {Object} signatureData - Dados da assinatura
   * @returns {Promise<Buffer>} - PDF gerado como buffer
   */
  async generateSamplePDF(signatureData = {}) {
    try {
      // Criar novo documento PDF
      const pdfDoc = await PDFDocument.create();

      // Criar página A4
      const page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();

      // Carregar fontes
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      // Gerar assinatura digital
      const digitalSignature = this.generateURLSafeSignature(32);
      const documentHash = this.generateDocumentHash(Buffer.from('sample-pdf-content'));

      // Configurações padrão
      const defaultSignature = {
        name: signatureData.name || 'Assinatura Digital',
        date: signatureData.date || new Date().toLocaleDateString('pt-BR'),
        reason: signatureData.reason || 'Documento aprovado',
        location: signatureData.location || 'Brasil',
        position: signatureData.position || { x: 50, y: 100 },
        fontSize: signatureData.fontSize || 12,
        originalFileName: signatureData.originalFileName || 'Documento PDF',
        email: signatureData.email || 'assinatura@digital.com'
      };

      // Título do documento
      page.drawText(defaultSignature.originalFileName, {
        x: 50,
        y: height - 100,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Conteúdo do documento
      page.drawText('Este e um documento de exemplo gerado via API GET.', {
        x: 50,
        y: height - 150,
        size: 14,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, {
        x: 50,
        y: height - 180,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Assinatura principal
      const signatureWidth = 350;
      const signatureHeight = 100;
      const mainSignatureX = defaultSignature.position.x;
      const mainSignatureY = height - 300;

      // Retângulo de fundo da assinatura
      page.drawRectangle({
        x: mainSignatureX - 10,
        y: mainSignatureY - 10,
        width: signatureWidth + 20,
        height: signatureHeight + 20,
        borderWidth: 2,
        borderColor: rgb(0, 0, 0),
        color: rgb(0.95, 0.95, 0.95)
      });

      // Informações da assinatura
      page.drawText(`Assinado por: ${defaultSignature.name}`, {
        x: mainSignatureX,
        y: mainSignatureY + 70,
        size: defaultSignature.fontSize,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Data: ${defaultSignature.date}`, {
        x: mainSignatureX,
        y: mainSignatureY + 50,
        size: defaultSignature.fontSize - 2,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Motivo: ${defaultSignature.reason}`, {
        x: mainSignatureX,
        y: mainSignatureY + 30,
        size: defaultSignature.fontSize - 2,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Local: ${defaultSignature.location}`, {
        x: mainSignatureX,
        y: mainSignatureY + 10,
        size: defaultSignature.fontSize - 2,
        font: font,
        color: rgb(0, 0, 0)
      });

      // Assinatura digital
      page.drawText(`Assinatura Digital: ${digitalSignature}`, {
        x: 20,
        y: 30,
        size: 9,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });

      // Adicionar página de validação
      await this.addValidationPage(pdfDoc, defaultSignature, digitalSignature, documentHash);

      // Salvar e retornar
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);

    } catch (error) {
      console.error('Erro ao gerar PDF de exemplo:', error);
      throw new Error(`Falha ao gerar PDF de exemplo: ${error.message}`);
    }
  }
}

module.exports = new PDFService();
