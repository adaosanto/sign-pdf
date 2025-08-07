const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function testSimple() {
    try {
        console.log('🧪 Teste simples de codificação...');

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // Testar textos que estavam causando problemas
        page.drawText('D4Sign', {
            x: 50,
            y: height - 100,
            size: 16,
            font: boldFont,
            color: rgb(0, 0, 0)
        });

        page.drawText('Pagina 1 de 1', {
            x: 50,
            y: height - 150,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
        });

        page.drawText('PDF nao contem paginas', {
            x: 50,
            y: height - 200,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
        });

        const pdfBytes = await pdfDoc.save();
        console.log('✅ Teste de codificação passou!');
        console.log(`📄 PDF gerado com ${pdfBytes.length} bytes`);

    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testSimple();
