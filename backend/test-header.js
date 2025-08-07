const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

async function testHeader() {
    try {
        console.log('🧪 Testando criação do header D4Sign...');

        // Criar novo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Criar nova página A4
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        const { width, height } = page.getSize();

        // Carregar fontes
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // Borda verde padronizada
        const borderWidth = 15;
        const borderColor = rgb(0.2, 0.6, 0.2);
        const contentMargin = 30;

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
        page.drawRectangle({
            x: contentMargin,
            y: contentMargin,
            width: width - (contentMargin * 2),
            height: height - (contentMargin * 2),
            borderWidth: 1,
            borderColor: rgb(0.9, 0.9, 0.9),
            color: rgb(1, 1, 1)
        });

        // Logo D4Sign
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

        // Logo NTP.br
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

        // Informações de sincronização
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

        page.drawText(`gerado em ${formattedDate} de ${currentDate.getFullYear()}, ${formattedTime}`, {
            x: width / 2 - 140,
            y: height - contentMargin - 160,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5)
        });

        // Salvar o PDF
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile('./test-header.pdf', pdfBytes);

        console.log('✅ Header D4Sign criado com sucesso!');
        console.log('📄 Arquivo salvo como: test-header.pdf');

    } catch (error) {
        console.error('❌ Erro ao criar header:', error);
    }
}

testHeader();
