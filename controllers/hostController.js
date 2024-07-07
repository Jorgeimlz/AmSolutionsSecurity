const hostService = require('../services/hostService');
const { evaluarRiesgoHost } = require('../middlewares/evaluarRiesgo');
const Search = require('../models/Search');
const PDFDocument = require('pdfkit');

exports.buscarHost = async (req, res) => {
    const url = req.body.url;

    try {
        const hosts = await hostService.buscarHost(url);
        const hostsConRiesgo = hosts.map(host => ({
            ...host,
            riesgo: evaluarRiesgoHost(host)
        }));

        // Guardar en el historial
        await new Search({
            user: req.userId,
            type: 'Host',
            query: url
        }).save();

        // Almacenar resultados en la sesión
        req.session.hostResults = hostsConRiesgo;
        req.session.hostUrl = url;

        res.render('host_resultados', { hosts: hostsConRiesgo, url });
    } catch (error) {
        console.error('Error al buscar datos de host:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.generarReporteHosts = async (req, res) => {
    try {
        const hostsConRiesgo = req.session.hostResults;
        const url = req.session.hostUrl;

        // Verificar si hay datos para generar el PDF
        if (!hostsConRiesgo || hostsConRiesgo.length === 0) {
            throw new Error('No se encontraron hosts para el URL proporcionado.');
        }

        // Crear el PDF
        const doc = new PDFDocument();
        let filename = `reporte_hosts_${url}.pdf`;
        filename = encodeURIComponent(filename);

        // Configurar respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de Hosts para ${url}`, { align: 'center' });

        hostsConRiesgo.forEach((host, index) => {
            doc.fontSize(12).text(`IP: ${host.ip}`);
            doc.fontSize(12).text(`Tipo: ${host.type}`);
            doc.fontSize(12).text(`ISP: ${host.isp_name}`);
            doc.fontSize(12).text(`Riesgo: ${host.riesgo}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte de hosts:', error);
        res.status(500).send('Error en el servidor');
    }
};
