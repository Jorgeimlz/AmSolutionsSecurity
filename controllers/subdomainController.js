const subdomainService = require('../services/subdomainService');
const { evaluarRiesgoSubdominio } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');
const PDFDocument = require('pdfkit');

exports.buscarSubdominios = async (req, res) => {
    const dominio = req.body.dominio;

    try {
        const subdominios = await subdomainService.buscarSubdominios(dominio);
        const subdominiosConRiesgo = subdominios.map(sub => ({
            ...sub,
            riesgo: evaluarRiesgoSubdominio(sub)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Subdominio',
            query: dominio
        }).save();

        res.render('resultados', { subdominios: subdominiosConRiesgo, dominio });
    } catch (error) {
        console.error('Error al buscar subdominios:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.generarReporteSubdominios = async (req, res) => {
    const dominio = req.query.dominio;

    try {
        const subdominios = await subdomainService.buscarSubdominios(dominio);
        const subdominiosConRiesgo = subdominios.map(sub => ({
            ...sub,
            riesgo: evaluarRiesgoSubdominio(sub)
        }));

        // Crear el PDF
        const doc = new PDFDocument();
        let filename = `reporte_subdominios_${dominio}.pdf`;
        filename = encodeURIComponent(filename);

        // Configurar respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Subdominios para ${dominio}`, { align: 'center' });

        subdominiosConRiesgo.forEach((sub, index) => {
            doc.fontSize(12).text(`Subdominio: ${sub.subdomain}`);
            doc.fontSize(12).text(`IP: ${sub.ip}`);
            doc.fontSize(12).text(`Riesgo: ${sub.riesgo}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de subdominios:', error);
        res.status(500).send('Error en el servidor');
    }
};
