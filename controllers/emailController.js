const emailService = require('../services/emailService');
const { evaluarRiesgoCorreo } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');
const PDFDocument = require('pdfkit');

exports.buscarCorreos = async (req, res) => {
    const dominio = req.body.dominio;

    try {
        const correos = await emailService.buscarCorreos(dominio);
        const correosConRiesgo = correos.map(correo => ({
            ...correo,
            riesgo: evaluarRiesgoCorreo(correo)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Correo',
            query: dominio
        }).save();

        res.render('correos_resultados', { correos: correosConRiesgo, dominio });
    } catch (error) {
        console.error('Error al buscar correos electrónicos:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.generarReporteCorreos = async (req, res) => {
    const dominio = req.query.dominio;

    try {
        const correos = await emailService.buscarCorreos(dominio);
        const correosConRiesgo = correos.map(correo => ({
            ...correo,
            riesgo: evaluarRiesgoCorreo(correo)
        }));

        // Crear el PDF
        const doc = new PDFDocument();
        let filename = `reporte_correos_${dominio}.pdf`;
        filename = encodeURIComponent(filename);

        // Configurar respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Correos para ${dominio}`, { align: 'center' });

        correosConRiesgo.forEach((correo, index) => {
            doc.fontSize(12).text(`Correo: ${correo.value}`);
            doc.fontSize(12).text(`Riesgo: ${correo.riesgo}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de correos electrónicos:', error);
        res.status(500).send('Error en el servidor');
    }
};
