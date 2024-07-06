const { listaNegraIPs, listaNegraDominios, listaNegraUsuarios } = require('../config/blacklist');

const evaluarRiesgoSubdominio = (subdominio) => {
    let riesgo = 1;

    if (listaNegraIPs.includes(subdominio.ip)) {
        riesgo += 4;
    }

    if (subdominio.cloudflare) {
        riesgo -= 2;
    }

    const nivelesDeRiesgo = ['Muy Baja', 'Baja', 'Media', 'Media-Alta', 'Alta', 'Muy Alta'];
    return nivelesDeRiesgo[Math.min(riesgo, nivelesDeRiesgo.length - 1)];
};

const evaluarRiesgoCorreo = (correo) => {
    let riesgo = 1;

    if (listaNegraDominios.includes(correo.domain)) {
        riesgo += 4;
    }

    const nivelesDeRiesgo = ['Muy Baja', 'Baja', 'Media', 'Media-Alta', 'Alta', 'Muy Alta'];
    return nivelesDeRiesgo[Math.min(riesgo, nivelesDeRiesgo.length - 1)];
};

const evaluarRiesgoCuenta = (cuenta) => {
    let riesgo = 1;

    if (listaNegraUsuarios.includes(cuenta.username)) {
        riesgo += 4;
    }

    const nivelesDeRiesgo = ['Muy Baja', 'Baja', 'Media', 'Media-Alta', 'Alta', 'Muy Alta'];
    return nivelesDeRiesgo[Math.min(riesgo, nivelesDeRiesgo.length - 1)];
};

const evaluarRiesgoHost = (host) => {
    let riesgo = 1;

    if (listaNegraIPs.includes(host.ip)) {
        riesgo += 4;
    }

    const nivelesDeRiesgo = ['Muy Baja', 'Baja', 'Media', 'Media-Alta', 'Alta', 'Muy Alta'];
    return nivelesDeRiesgo[Math.min(riesgo, nivelesDeRiesgo.length - 1)];
};

module.exports = { evaluarRiesgoSubdominio, evaluarRiesgoCorreo, evaluarRiesgoCuenta, evaluarRiesgoHost };
