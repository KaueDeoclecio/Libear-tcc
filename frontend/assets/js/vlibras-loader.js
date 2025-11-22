
(function() {
    const vwDiv = document.createElement('div');
    vwDiv.setAttribute('vw', '');
    vwDiv.classList.add('enabled');

    const vwAccessButton = document.createElement('div');
    vwAccessButton.setAttribute('vw-access-button', '');
    vwAccessButton.classList.add('active');
    
    const vwPluginWrapper = document.createElement('div');
    vwPluginWrapper.setAttribute('vw-plugin-wrapper', '');
    
    const vwPluginTopWrapper = document.createElement('div');
    vwPluginTopWrapper.classList.add('vw-plugin-top-wrapper');
    
    vwPluginWrapper.appendChild(vwPluginTopWrapper);
    vwDiv.appendChild(vwAccessButton);
    vwDiv.appendChild(vwPluginWrapper);

    const vlibrasScript = document.createElement('script');
    vlibrasScript.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    
    vlibrasScript.onload = () => {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        console.log('vLibras widget carregado globalmente.');
    };

    document.body.appendChild(vwDiv);
    document.body.appendChild(vlibrasScript);
})();