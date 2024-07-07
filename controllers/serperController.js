const serperService = require('../services/serperService');
const Search = require('../models/Search');
const PDFDocument = require('pdfkit');

exports.buscarSerper = async (req, res) => {
    const query = req.body.query;

    try {
        const resultados = await serperService.buscarSerper(query);

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Serper',
            query: query
        }).save();

        res.render('serper_resultados', { resultados, query });
    } catch (error) {
        console.error('Error al buscar con Serper.dev:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.generarReporteSerper = async (req, res) => {
    const query = req.query.query;

    try {
        const resultados = await serperService.buscarSerper(query);

        // Crear el PDF
        const doc = new PDFDocument();
        let filename = `reporte_serper_${query}.pdf`;
        filename = encodeURIComponent(filename);

        // Configurar respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Búsqueda para ${query}`, { align: 'center' });

        resultados.forEach((resultado, index) => {
            doc.fontSize(12).text(`Título: ${resultado.title}`);
            doc.fontSize(12).text(`Enlace: ${resultado.link}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de búsqueda:', error);
        res.status(500).send('Error en el servidor');
    }
};
