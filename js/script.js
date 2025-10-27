document.getElementById('generar-artista').addEventListener('click', function () {
    const ruleta = document.getElementById('ruleta');
    const letras = document.querySelectorAll('.letra');
    const letraSeleccionada = document.getElementById('letra-seleccionada');
    const arlequinImgSexo = document.getElementById('arlequin-img-sexo');
    const arlequinImgIdioma = document.getElementById('arlequin-img-idioma');
    const sexoText = document.getElementById('sexo');
    const idiomaText = document.getElementById('idioma');
    const inputField = document.getElementById('youtube-input'); // Input que será deshabilitado
    // Limpiar el input de búsqueda
    inputField.value = '';
    inputField.disabled = false; // Habilitar el input al girar la rueda

    // Limpiar selección previa (eliminamos selected, pulse y blink en cada letra; y quitamos blink del centro)
    letras.forEach(letra => {
        letra.classList.remove('selected', 'pulse', 'blink');
    });
    letraSeleccionada.classList.remove('blink');
    letraSeleccionada.textContent = '?';
    arlequinImgSexo.style.display = 'none';
    arlequinImgIdioma.style.display = 'none';
    sexoText.textContent = '?';
    idiomaText.textContent = '?';

    // Rotar la ruleta aleatoriamente con al menos 2 vueltas completas
    const vueltasMinimas = 720; // 720 grados para 2 vueltas completas
    const randomRotation = vueltasMinimas + Math.floor(Math.random() * 360); // Sumamos entre 0 y 360 grados adicionales
    ruleta.style.transition = 'transform 1s ease-out'; // Velocidad rápida de 1 segundo
    ruleta.style.transform = `rotate(${randomRotation}deg)`; // Aplicar rotación

    // Obtener la letra seleccionada cuando la ruleta se detenga
    setTimeout(() => {
        const selectedAngle = (randomRotation % 360); // Ángulo final
        const degreesPerLetter = 360 / letras.length; // Asumiendo 26 letras, cada una ocupa 360/26 grados
        const index = Math.round((360 - selectedAngle) / degreesPerLetter) % letras.length; // Calcular el índice de la letra
    const letraElegida = letras[index]; // Letra seleccionada
    // Marcar la letra seleccionada en la ruleta
    letraElegida.classList.add('selected');
    // Hacer parpadear SOLO la letra dentro de la ruleta (no el centro)
    letraElegida.classList.add('blink');
    // Mostrar la letra en el centro (sin parpadeo)
    letraSeleccionada.textContent = letraElegida.textContent;
    // También hacemos que el círculo central parpadee
    letraSeleccionada.classList.add('blink');
    }, 1000); // El tiempo debe coincidir con la duración de la animación (1 segundo)

    // Generar sexo aleatorio, incluyendo Arlequín
    const sexos = ['HOMBRE', 'MUJER', 'Arlequín'];
    const sexoSeleccionado = sexos[Math.floor(Math.random() * sexos.length)];

    // Generar idioma aleatorio, incluyendo Arlequín
    const idiomas = ['SOLISTA', 'BANDA', 'Arlequín'];
    const idiomaSeleccionado = idiomas[Math.floor(Math.random() * idiomas.length)];

    // Mostrar imagen de Arlequín en la tarjeta correspondiente y ocultar el texto
    if (sexoSeleccionado === 'Arlequín') {
        arlequinImgSexo.style.display = 'block';
        sexoText.textContent = '';
    } else {
        sexoText.textContent = sexoSeleccionado;
    }

    if (idiomaSeleccionado === 'Arlequín') {
        arlequinImgIdioma.style.display = 'block';
        idiomaText.textContent = '';
    } else {
        idiomaText.textContent = idiomaSeleccionado;
    }

    // Reiniciar el temporizador
    clearInterval(timerInterval);
    startTimer(60); // Iniciar con 60 segundos o el tiempo que necesites
});

// Temporizador
let timerInterval;

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const timerElement = document.getElementById('timer');
    const inputField = document.getElementById('youtube-input'); // Input que será deshabilitado
    timerElement.classList.remove('timer-red');
    inputField.disabled = false; // Habilitar el input cuando comienza el temporizador
    // Ocultar banner final si existe
    const existingBanner = document.getElementById('end-banner');
    if (existingBanner) existingBanner.remove();

    timerInterval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerElement.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "00:00";
            timerElement.classList.add('timer-red');
            inputField.disabled = true; // Deshabilitar el input cuando el tiempo llegue a cero
            // Mostrar banner de fin de ronda
            showEndBanner();
        }
    }, 1000);
}

function showEndBanner(){
    // Si ya existe, no crear otra
    if(document.getElementById('end-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'end-banner';
    banner.className = 'end-banner';
    banner.setAttribute('role','status');
    banner.setAttribute('aria-live','polite');
    banner.innerHTML = '¡Hasta la próxima ronda! 🔁';
    document.body.appendChild(banner);
    // posicionar el banner relativo al input (#youtube-input)
    const input = document.getElementById('youtube-input');
    if (input) {
        const rect = input.getBoundingClientRect();
        // calcular el centro X del input en coordenadas de viewport
        const cx = rect.left + rect.width / 2;
        // decidir comportamiento según ancho de pantalla (móvil debajo)
        const isMobile = window.innerWidth <= 480;
        // forzamos un reflow mínimo para que banner tenga tamaño
        window.getComputedStyle(banner).opacity;
        const bannerRect = banner.getBoundingClientRect();
        let finalTop;
        if (isMobile) {
            // colocar el banner debajo del input con 8px de separación
            finalTop = rect.bottom + 8;
            banner.classList.add('below');
        } else {
            // intentar colocar el banner 8px por encima del input
            const topAbove = rect.top - bannerRect.height - 8; // 8px por encima del input
            // si topAbove sale fuera de la pantalla, fallback al centro del input
            finalTop = topAbove < 8 ? (rect.top + rect.height / 2) : topAbove;
            banner.classList.remove('below');
        }
        banner.style.left = cx + 'px';
        banner.style.top = finalTop + 'px';
    }
    // mostrar con transición
    window.getComputedStyle(banner).opacity;
    banner.classList.add('show');
}

function hideEndBanner(){
    const b = document.getElementById('end-banner');
    if(!b) return;
    b.classList.remove('show');
    setTimeout(()=> b.remove(), 350);
}

document.getElementById('youtube-button').addEventListener('click', function () {
    const query = document.getElementById('youtube-input').value.trim();
    if (!query) return;

    // Diagnostic: detectar qué puente/estrategia se va a usar y mostrar alerta para pruebas
    try {
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CastBridge && typeof window.Capacitor.Plugins.CastBridge.sendToTv === 'function') {
            console.log('[DEBUG] usando: Capacitor.Plugins.CastBridge.sendToTv');
            try { alert('DEBUG: usando Capacitor CastBridge'); } catch(e){}
        } else if (window.Android && typeof window.Android.sendToTv === 'function') {
            console.log('[DEBUG] usando: window.Android.sendToTv');
            try { alert('DEBUG: usando Android.sendToTv'); } catch(e){}
        } else if (window.Android && typeof window.Android.openYouTube === 'function') {
            console.log('[DEBUG] usando: window.Android.openYouTube');
            try { alert('DEBUG: usando Android.openYouTube'); } catch(e){}
        } else {
            console.log('[DEBUG] no se detectó puente nativo, se usará intent/web fallback');
            try { alert('DEBUG: no se detectó puente nativo, se usará intent/web fallback'); } catch(e){}
        }
    } catch(err) {
        console.log('[DEBUG] error en diagnóstico de puente:', err);
    }

    // 0) Intentar plugin de Capacitor si existe (prioritario en build Android con Capacitor)
    try {
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.OpenYouTube && typeof window.Capacitor.Plugins.OpenYouTube.open === 'function') {
            // El plugin debe implementar open({ query: string })
            window.Capacitor.Plugins.OpenYouTube.open({ query: query });
            return;
        }
    } catch (e) {
        // ignore y seguimos a los fallbacks
    }

    // 1) Prefer native bridge: Android.openYouTube(query)
    try {
        // First, if running inside Capacitor, try the CastBridge plugin
        try {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CastBridge && typeof window.Capacitor.Plugins.CastBridge.sendToTv === 'function') {
                window.Capacitor.Plugins.CastBridge.sendToTv({ query: query });
                return;
            }
        } catch (e) { /* ignore */ }

        // Next, if a WebView-exposed Android bridge has sendToTv, try it
        if (window.Android && typeof window.Android.sendToTv === 'function') {
            try { window.Android.sendToTv(query); return; } catch(e) { /* ignore and fallback */ }
        }
        if (window.Android && typeof window.Android.openYouTube === 'function') {
            window.Android.openYouTube(query);
            return;
        }
    } catch (e) {
        // ignore and fallback
    }

    // 2) Try Android intent URL to open YouTube app (works on many Android devices)
    try {
        // vnd.youtube search scheme or intent URL as fallback
        const vnd = 'vnd.youtube:search?query=' + encodeURIComponent(query);
        const intentUrl = 'intent://results?search_query=' + encodeURIComponent(query) + '#Intent;scheme=https;package=com.google.android.youtube;end';
        // Try vnd scheme first
        window.location.href = vnd;
        // After a short delay, try intent URL then web as last resort
        setTimeout(() => {
            window.location.href = intentUrl;
        }, 300);
        // As last fallback, open web search
        setTimeout(() => {
            window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank');
        }, 800);
        return;
    } catch (err) {
        // ignore and fallback to web
    }

    // 3) Final fallback: open web search
    window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), '_blank');
});

