// WhatsApp Floating Button Loader
(function() {
    function loadWhatsAppFloat() {
        fetch('components/whatsapp-float.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                document.body.appendChild(tempDiv.firstElementChild);
            });
    }
    // Load CSS
    function loadWhatsAppFloatCSS() {
        if (!document.getElementById('whatsapp-float-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'components/whatsapp-float.css';
            link.id = 'whatsapp-float-css';
            document.head.appendChild(link);
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        loadWhatsAppFloatCSS();
        loadWhatsAppFloat();
    });
})();
