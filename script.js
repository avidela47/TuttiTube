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

    // Limpiar selección previa
    letras.forEach(letra => letra.classList.remove('selected'));
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
        letraElegida.classList.add('selected'); // Marcar la letra seleccionada visualmente
        letraSeleccionada.textContent = letraElegida.textContent; // Mostrar la letra seleccionada en el centro
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
        }
    }, 1000);
}

document.getElementById('youtube-button').addEventListener('click', function () {
    const query = document.getElementById('youtube-input').value;
    if (query) {
        Android.openYouTube(query);
    }
});



