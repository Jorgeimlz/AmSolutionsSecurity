const socialService = require('../services/socialService');
const Search = require('../models/Search');
const PDFDocument = require('pdfkit');

exports.buscarEnlacesSociales = async (req, res) => {
    const query = req.body.query;

    try {
        const cuentas = await socialService.buscarEnlacesSociales(query);

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Social',
            query: query
        }).save();

        res.render('enlaces_sociales_resultados', { cuentas, query });
    } catch (error) {
        console.error('Error al buscar enlaces de redes sociales:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.generarReporteSocial = async (req, res) => {
    const query = req.query.query;

    try {
        const cuentas = await socialService.buscarEnlacesSociales(query);

        // Crear el PDF
        const doc = new PDFDocument();
        let filename = `reporte_social_${query}.pdf`;
        filename = encodeURIComponent(filename);

        // Configurar respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Enlaces Sociales para ${query}`, { align: 'center' });

        cuentas.forEach((cuenta, index) => {
            doc.fontSize(12).text(`Red: ${cuenta.red}`);
            doc.fontSize(12).text(`Enlace: ${cuenta.enlace}`);
            doc.fontSize(12).text(`Riesgo: ${cuenta.riesgo}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de enlaces sociales:', error);
        res.status(500).send('Error en el servidor');
    }
};
