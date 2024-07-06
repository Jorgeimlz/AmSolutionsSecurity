document.addEventListener('DOMContentLoaded', function() {
    const risks = document.querySelectorAll('.risk');

    risks.forEach(risk => {
        risk.addEventListener('click', function() {
            const nivel = this.dataset.risk;
            const dominio = this.dataset.dominio;
            // Encodes the dominio to ensure it is correctly formatted
            const encodedDominio = encodeURIComponent(dominio);
            window.location.href = `/riesgo/${nivel}/${encodedDominio}`;
        });
    });
});
