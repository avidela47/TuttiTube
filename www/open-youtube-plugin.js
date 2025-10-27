// Pequeño wrapper JS para invocar el plugin (o fallback) desde otras partes del código
window.openYouTube = function(query) {
    if (!query) return;
    try {
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.OpenYouTube && typeof window.Capacitor.Plugins.OpenYouTube.open === 'function') {
            window.Capacitor.Plugins.OpenYouTube.open({ query: query });
            return;
        }
    } catch(e){}

    // fallback directo
    try {
        if (window.Android && typeof window.Android.openYouTube === 'function') {
            window.Android.openYouTube(query);
            return;
        }
    } catch(e){}

    window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank');
};

