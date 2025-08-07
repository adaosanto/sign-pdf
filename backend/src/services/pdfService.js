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
        throw new Error('PDF não contém páginas');
      }

              // Gerar assinatura digital URL-safe de 32 caracteres
        const digitalSignature = this.generateURLSafeSignature(32);

        // Gerar hash do documento para verificação de integridade
        const documentHash = this.generateDocumentHash(pdfBytes);

        // Configurações padrão da assinatura
        const defaultSignature = {
          name: signatureData.name || 'Assinatura Digital',
          date: signatureData.date || new Date().toLocaleDateString('pt-BR'),
          reason: signatureData.reason || 'Documento aprovado',
          location: signatureData.location || 'Brasil',
          position: signatureData.position || { x: 50, y: 100 },
          fontSize: signatureData.fontSize || 12
        };

        // Adicionar fonte
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

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
            size: 10,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
          });

          // Adicionar informações da página
          page.drawText(`Página ${pageIndex + 1} de ${pages.length}`, {
            x: signatureX,
            y: signatureY - 15,
            size: 8,
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

            // Adicionar hash digital para verificação de integridade
            page.drawText(`Hash: ${documentHash.substring(0, 16)}...`, {
              x: mainSignatureX,
              y: mainSignatureY + 10,
              size: defaultSignature.fontSize - 4,
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
   * Adiciona página de validação ao PDF
   * @param {PDFDocument} pdfDoc - Documento PDF
   * @param {Object} signatureData - Dados da assinatura
   * @param {string} digitalSignature - Assinatura digital
   * @param {string} documentHash - Hash do documento
   * @returns {Promise<void>}
   */
  async addValidationPage(pdfDoc, signatureData, digitalSignature, documentHash) {
    try {
      // Criar nova página
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();

      // Carregar fonte
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Gerar URL de validação
      const validationURL = this.generateValidationURL(digitalSignature, documentHash);

      // Gerar QR code
      const qrCodeBuffer = await this.generateQRCodeBuffer(validationURL);
      const qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer);

      // Título da página
      page.drawText('CERTIFICADO DE ASSINATURA DIGITAL', {
        x: width / 2 - 150,
        y: height - 50,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Linha separadora
      page.drawLine({
        start: { x: 50, y: height - 80 },
        end: { x: width - 50, y: height - 80 },
        thickness: 2,
        color: rgb(0, 0, 0)
      });

      // Informações do documento
      page.drawText('INFORMAÇÕES DO DOCUMENTO', {
        x: 50,
        y: height - 120,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Assinatura Digital: ${digitalSignature}`, {
        x: 50,
        y: height - 150,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Hash do Documento: ${documentHash}`, {
        x: 50,
        y: height - 170,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Data de Assinatura: ${signatureData.date || new Date().toLocaleDateString('pt-BR')}`, {
        x: 50,
        y: height - 190,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      // Informações do assinante
      page.drawText('INFORMAÇÕES DO ASSINANTE', {
        x: 50,
        y: height - 230,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Nome: ${signatureData.name || 'Assinatura Digital'}`, {
        x: 50,
        y: height - 260,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Motivo: ${signatureData.reason || 'Documento aprovado'}`, {
        x: 50,
        y: height - 280,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      page.drawText(`Local: ${signatureData.location || 'Brasil'}`, {
        x: 50,
        y: height - 300,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });

      // QR Code
      page.drawText('QR CODE PARA VALIDAÇÃO', {
        x: 50,
        y: height - 350,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Desenhar QR code
      page.drawImage(qrCodeImage, {
        x: 50,
        y: height - 550,
        width: 150,
        height: 150
      });

      // Link de validação
      page.drawText('LINK DE VALIDAÇÃO', {
        x: 50,
        y: height - 580,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      page.drawText(validationURL, {
        x: 50,
        y: height - 600,
        size: 10,
        font: font,
        color: rgb(0, 0, 1) // Azul para indicar link
      });

      // Instruções de validação
      page.drawText('INSTRUÇÕES DE VALIDAÇÃO', {
        x: 50,
        y: height - 650,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      const instructions = [
        '1. Escaneie o QR code acima com seu smartphone',
        '2. Ou acesse o link de validação no navegador',
        '3. Digite a assinatura digital para verificar a autenticidade',
        '4. O sistema confirmará se o documento é válido e original'
      ];

      instructions.forEach((instruction, index) => {
        page.drawText(instruction, {
          x: 50,
          y: height - 680 - (index * 20),
          size: 10,
          font: font,
          color: rgb(0.3, 0.3, 0.3)
        });
      });

      // Rodapé
      page.drawText('Este documento foi assinado digitalmente pelo PDF Signer API', {
        x: width / 2 - 150,
        y: 30,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
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
}

module.exports = new PDFService();
