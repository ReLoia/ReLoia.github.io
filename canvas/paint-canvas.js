/*
 Paint Canvas (kinda like reddit's canvas)
 */

const paintCanvas = document.querySelector("canvas#paintCanvas");
paintCanvas.height = 140;
paintCanvas.width = 420;
const paintCtx = paintCanvas.getContext("2d");

let paintCanvasSettings = {
    pixelSize: 14,
    pixelColor: "black",
    get oncooldown() {
        return this._oncooldown;
    },
    set oncooldown(value) {
        if (value) {
            paintCanvas.parentElement.classList.add("cooldown");
            paintCanvas.style.cursor = "not-allowed";
            setInterval(() => {
                this._oncooldown = false;
                paintCanvas.parentElement.classList.remove("cooldown");
                paintCanvas.style.cursor = "crosshair";
            }, 30_000);
        }
        this._oncooldown = true;
    }
}

// generate 16 random colors to add to the palette

const palette = document.querySelector(".palette");
for (let i = 0; i < 38; i++) {
    palette.innerHTML += `<button onclick="paintCanvasSetColor(this)" class="color" style="background-color: ${randomColor()}"></button>`;
}

paintCtx.fillStyle = "white";
paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
(async () => {
    const canvasStatus = await fetch("https://glitch-proxy.vercel.app/reloia-listen/paintcanvas/status");
    // array of { x, y, color }
    const status = await canvasStatus.json();

    status.forEach((pixel) => paintPixel(pixel.x, pixel.y, pixel.color));
})();

paintCanvas.addEventListener("click", async (e) => {
    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (paintCanvasSettings.oncooldown) return;
    paintCanvasSettings.oncooldown = true;

    paintPixel(x, y, paintCanvasSettings.pixelColor);

    await fetch("https://glitch-proxy.vercel.app/reloia-listen/paintcanvas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ x: Math.round(x), y: Math.round(y), color: paintCanvasSettings.pixelColor }),
    });
});

let lastColor = document.querySelector(".palette .selected");
function paintCanvasSetColor(element) {
    lastColor.classList.remove("selected");
    element.classList.add("selected");
    paintCanvasSettings.pixelColor = element.style.backgroundColor;
    lastColor = element;
}

function paintPixel(x, y, color) {
    paintCtx.fillStyle = color;
    paintCtx.fillRect(Math.floor(x / paintCanvasSettings.pixelSize) * paintCanvasSettings.pixelSize, Math.floor(y / paintCanvasSettings.pixelSize) * paintCanvasSettings.pixelSize, paintCanvasSettings.pixelSize, paintCanvasSettings.pixelSize);
}