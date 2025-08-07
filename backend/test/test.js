const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

// Teste simples para verificar se as dependências estão funcionando
async function testPDFCreation() {
  try {
    console.log('🧪 Testando criação de PDF...');

    // Criar um novo documento PDF
    const pdfDoc = await PDFDocument.create();

    // Criar múltiplas páginas para testar assinatura em todas as páginas
    for (let i = 0; i < 3; i++) {
      const page = pdfDoc.addPage([600, 400]);

      // Adicionar texto
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Título da página
      page.drawText(`PDF de Teste - SignJS - Página ${i + 1}`, {
        x: 50,
        y: 350,
        size: 20,
        font: font,
        color: rgb(0, 0, 0)
      });

      // Conteúdo da página
      page.drawText('Este é um PDF de teste para verificar se a aplicação está funcionando.', {
        x: 50,
        y: 300,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Adicionar mais conteúdo para demonstrar múltiplas páginas
      page.drawText(`Esta é a página ${i + 1} de 3. A assinatura digital deve aparecer no final de cada página.`, {
        x: 50,
        y: 250,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });

      // Adicionar conteúdo adicional para preencher a página
      for (let j = 0; j < 5; j++) {
        page.drawText(`Linha ${j + 1} do conteúdo da página ${i + 1}.`, {
          x: 50,
          y: 200 - (j * 20),
          size: 10,
          font: font,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
    }

    // Salvar o PDF
    const pdfBytes = await pdfDoc.save();

    // Criar diretório de teste se não existir
    const testDir = path.join(__dirname, '..', 'test-files');
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }

    // Salvar arquivo de teste
    const testFilePath = path.join(testDir, 'test-document.pdf');
    await fs.writeFile(testFilePath, pdfBytes);

    console.log('✅ PDF de teste criado com sucesso!');
    console.log(`📁 Arquivo salvo em: ${testFilePath}`);
    console.log(`📊 Tamanho: ${pdfBytes.length} bytes`);

    return testFilePath;

  } catch (error) {
    console.error('❌ Erro ao criar PDF de teste:', error.message);
    throw error;
  }
}

// Teste da funcionalidade de assinatura
async function testSignature(testFilePath) {
  try {
    console.log('\n🔐 Testando funcionalidade de assinatura...');

    const pdfService = require('../src/services/pdfService');

    // Testar geração de assinatura URL-safe
    console.log('🔑 Testando geração de assinatura digital...');
    const signature1 = pdfService.generateURLSafeSignature(32);
    const signature2 = pdfService.generateURLSafeSignature(32);
    console.log(`✅ Assinatura 1 (32 chars): ${signature1}`);
    console.log(`✅ Assinatura 2 (32 chars): ${signature2}`);
    console.log(`✅ Assinaturas são únicas: ${signature1 !== signature2}`);

    // Dados de teste para assinatura
    const signatureData = {
      name: 'Teste Automático',
      date: new Date().toLocaleDateString('pt-BR'),
      reason: 'Teste de funcionalidade',
      location: 'Teste Local'
    };

    // Assinar o PDF
    const signedPdfBuffer = await pdfService.signPDF(testFilePath, signatureData);

    // Salvar PDF assinado
    const signedFilePath = path.join(path.dirname(testFilePath), 'test-document-signed.pdf');
    await fs.writeFile(signedFilePath, signedPdfBuffer);

    console.log('✅ PDF assinado com sucesso!');
    console.log(`📁 Arquivo assinado salvo em: ${signedFilePath}`);
    console.log(`📊 Tamanho: ${signedPdfBuffer.length} bytes`);
    console.log('🔍 Verifique se a assinatura digital aparece em todas as páginas');

    // Limpar arquivo de teste
    await pdfService.cleanupFile(testFilePath);

    return signedFilePath;

  } catch (error) {
    console.error('❌ Erro ao assinar PDF:', error.message);
    throw error;
  }
}

// Executar testes
async function runTests() {
  try {
    console.log('🚀 Iniciando testes da aplicação PDF Signer...\n');

    // Teste 1: Criação de PDF
    const testFilePath = await testPDFCreation();

    // Teste 2: Assinatura de PDF
    await testSignature(testFilePath);

    console.log('\n🎉 Todos os testes passaram com sucesso!');
    console.log('✅ A aplicação está pronta para uso.');

  } catch (error) {
    console.error('\n💥 Falha nos testes:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testPDFCreation, testSignature, runTests };
