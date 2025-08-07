const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function testQuick() {
    try {
        console.log('🧪 Teste rápido - Verificando se o erro foi corrigido...\n');

        // 1. Criar um PDF simples
        console.log('📄 Criando PDF de teste...');
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText('Teste de Assinatura - PDF Signer', {
            x: 50,
            y: 350,
            size: 20,
            font: font,
            color: rgb(0, 0, 0)
        });

        const pdfBytes = await pdfDoc.save();

        // 2. Salvar PDF temporário
        const testFilePath = path.join(__dirname, 'test-quick.pdf');
        await fs.writeFile(testFilePath, pdfBytes);
        console.log('✅ PDF criado:', testFilePath);

        // 3. Testar assinatura
        console.log('\n🔐 Testando assinatura...');
        const pdfService = require('./src/services/pdfService');

        const signatureData = {
            name: 'Teste Rápido',
            reason: 'Verificação de correção',
            location: 'Teste'
        };

        const signedPdfBuffer = await pdfService.signPDF(testFilePath, signatureData);

        // 4. Salvar PDF assinado
        const signedFilePath = path.join(__dirname, 'test-quick-signed.pdf');
        await fs.writeFile(signedFilePath, signedPdfBuffer);

        console.log('✅ PDF assinado com sucesso!');
        console.log('📁 Arquivo salvo:', signedFilePath);
        console.log('📊 Tamanho:', signedPdfBuffer.length, 'bytes');

        // 5. Limpar arquivo temporário
        await pdfService.cleanupFile(testFilePath);
        console.log('🧹 Arquivo temporário removido');

        console.log('\n🎉 Teste concluído com sucesso!');
        console.log('✅ O erro "documentHash is not defined" foi corrigido!');
        console.log('📄 Verifique o arquivo:', signedFilePath);
        console.log('🔍 A última página deve conter o certificado de validação');

    } catch (error) {
        console.error('\n❌ Erro no teste:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testQuick();
