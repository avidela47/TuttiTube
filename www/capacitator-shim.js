(function(){
    // Shim para exponer un "plugin" OpenYouTube en `Capacitor.Plugins` que llama a window.Android si existe
    function openYouTubeQuery(query) {
        query = String(query || '').trim();
        if (!query) return;

        // 1) Si existe la interfaz Android expuesta por addJavascriptInterface
        try {
            if (window.Android && typeof window.Android.openYouTube === 'function') {
                window.Android.openYouTube(query);
                return;
            }
        } catch(e) {
            // ignore
        }

        // 2) Intent / vnd scheme fallback
        try {
            var vnd = 'vnd.youtube:search?query=' + encodeURIComponent(query);
            var intentUrl = 'intent://results?search_query=' + encodeURIComponent(query) + '#Intent;scheme=https;package=com.google.android.youtube;end';
            // intentar vnd
            window.location.href = vnd;
            setTimeout(function(){
                window.location.href = intentUrl;
            }, 300);
            setTimeout(function(){
                window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank');
            }, 800);
            return;
        } catch(e) {
            // ignore y abrir web como último recurso
        }

        // 3) Fallback web
        window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank');
    }

    // Registrar en Capacitor.Plugins para que el código JS existente pueda invocarlo
    try {
        if (!window.Capacitor) window.Capacitor = {};
        if (!window.Capacitor.Plugins) window.Capacitor.Plugins = {};
        window.Capacitor.Plugins.OpenYouTube = {
            open: function(opts) {
                if (typeof opts === 'string') return openYouTubeQuery(opts);
                var q = (opts && opts.query) ? opts.query : '';
                openYouTubeQuery(q);
            }
        };
    } catch(e) {
        // no hacemos nada si falla
    }
})();

