
let lenteTipo = ''; // 'convergente' o 'divergente'
let f = 0;
let do_val = 20;
const escala = 15; // Escala de píxeles por cm

const canvas = document.getElementById('canvasOptica');
const ctx = canvas.getContext('2d');

function iniciarSimulacion(tipo) {
    lenteTipo = tipo;
    f = (tipo === 'convergente') ? 10 : -10;
    document.getElementById('menu-inicial').style.display = 'none';
    document.getElementById('simulador').style.display = 'block';
    document.getElementById('lente-titulo').innerText = `Lente ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    document.getElementById('res-f').innerText = f + " cm";
    
    ajustarCanvas();
    update();
}

function ajustarCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = 400;
}

document.getElementById('input-do').addEventListener('input', (e) => {
    do_val = parseFloat(e.target.value);
    document.getElementById('val-do').innerText = do_val;
    update();
});

function update() {
    // 1. Cálculo de Física (Ecuación de Descartes)
    // 1/f = 1/do + 1/di  => di = (f * do) / (do - f)
    let di = (f * do_val) / (do_val - f);
    let aumento = -di / do_val;

    // 2. Determinar Tipo y Orientación
    let tipoImg = (di > 0) ? "Real (R)" : "Virtual (V)";
    let orientacion = (aumento < 0) ? "Invertida (I)" : "Derecha (D)";

    // Actualizar UI
    document.getElementById('res-di').innerText = di.toFixed(2) + " cm";
    document.getElementById('res-tipo').innerText = tipoImg;
    document.getElementById('res-ori').innerText = orientacion;

    dibujar(di, aumento);
}

function dibujar(di, aumento) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    // Eje óptico
    ctx.strokeStyle = '#999';
    ctx.beginPath(); ctx.moveTo(0, centroY); ctx.lineTo(canvas.width, centroY); ctx.stroke();

    // Lente
    ctx.strokeStyle = '#007bff'; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centroX, centroY - 100); ctx.lineTo(centroX, centroY + 100);
    ctx.stroke();
    // Flechas de la lente
    if(lenteTipo === 'convergente') {
        dibujarFlecha(centroX, centroY - 100, 'arriba'); dibujarFlecha(centroX, centroY + 100, 'abajo');
    }

    // Focos
    ctx.fillStyle = 'red';
    ctx.beginPath(); ctx.arc(centroX - (f * escala), centroY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(centroX + (f * escala), centroY, 4, 0, Math.PI * 2); ctx.fill();

    // Objeto (Flecha verde)
    const objH = -50;
    ctx.strokeStyle = '#28a745'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centroX - (do_val * escala), centroY);
    ctx.lineTo(centroX - (do_val * escala), centroY + objH);
    ctx.stroke();

    // Imagen (Flecha naranja)
    const imgH = objH * aumento;
    ctx.strokeStyle = '#fd7e14';
    ctx.beginPath();
    ctx.moveTo(centroX + (di * escala), centroY);
    ctx.lineTo(centroX + (di * escala), centroY + imgH);
    ctx.stroke();
}

function dibujarFlecha(x, y, dir) {
    ctx.beginPath();
    if(dir === 'arriba') { ctx.moveTo(x-10, y+10); ctx.lineTo(x, y); ctx.lineTo(x+10, y+10); }
    else { ctx.moveTo(x-10, y-10); ctx.lineTo(x, y); ctx.lineTo(x+10, y-10); }
    ctx.stroke();
}

function regresarMenu() {
    document.getElementById('menu-inicial').style.display = 'block';
    document.getElementById('simulador').style.display = 'none';
}
