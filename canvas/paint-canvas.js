/*
 Paint Canvas (kinda like reddit's canvas)
 */

const canvasPaintDiv = document.querySelector("div[paint]");

const paintCanvas = canvasPaintDiv.querySelector("canvas#paintCanvas");
const paintCtx = paintCanvas.getContext("2d");

let scale = 1;
// if width of screen < 440,
// scale = (width of screen - 20) / 420
if (window.innerWidth < 440) {
    scale = (window.innerWidth - 38) / 420;
}

paintCanvas.height = 140 * scale;
paintCanvas.width = 420 * scale;

const pixelBASESize = 14;
let paintCanvasSettings = {
    pixelSize: pixelBASESize * scale,
    pixelColor: "black",
    get status() {
        return this._status || "offline";
    },
    set status(value) {
        switch (value) {
            case "online":
                canvasPaintDiv.dataset.status = "online";
                canvasPaintDiv.querySelector("b").innerText = "online";
                break;
            case "offline":
                canvasPaintDiv.dataset.status = "offline";
                canvasPaintDiv.querySelector("b").innerHTML = "offline, the websocket is down, you can still paint though.";
                break;
        }
        this._status = value;
    },
    get oncooldown() {
        return this._oncooldown;
    },
    set oncooldown(value) {
        return;
        if (value) {
            paintCanvas.parentElement.classList.add("cooldown");
            setTimeout(() => {
                this._oncooldown = false;
                paintCanvas.parentElement.classList.remove("cooldown");
            }, 10_000);
        }
        this._oncooldown = true;
    }
}

const palette = canvasPaintDiv.querySelector(".palette");
for (let i = 0; i < 38; i++) {
    palette.innerHTML += `<button onclick="paintCanvasSetColor(this)" class="color" style="background-color: ${randomColor()}"></button>`;
}

paintCtx.fillStyle = "white";
paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
(async () => {
    const canvasStatus = await fetch(`${BASEURL}/paintcanvas/status`);
    paintCanvasSettings.status = "online";
    // array of { x, y, color }
    const status = await canvasStatus.json();

    status.forEach((pixel) => paintPixel(pixel?.x * scale, pixel?.y * scale, pixel?.color));
})();

paintCanvas.addEventListener("click", async (e) => {
    if (paintCanvasSettings.status == "offline") return;

    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (paintCanvasSettings.oncooldown) return;
    paintCanvasSettings.oncooldown = true;

    paintPixel(x, y, paintCanvasSettings.pixelColor);
    const coords = fixCoords(x, y, paintCanvasSettings.pixelSize);

    await fetch(`${BASEURL}/paintcanvas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ x: coords.x / paintCanvasSettings.pixelSize, y: coords.y / paintCanvasSettings.pixelSize, color: paintCanvasSettings.pixelColor }),
    });
});

let lastColor = palette.querySelector(".selected");
function paintCanvasSetColor(element) {
    lastColor.classList.remove("selected");
    element.classList.add("selected");
    paintCanvasSettings.pixelColor = element.style.backgroundColor;
    lastColor = element;
}

function paintPixel(x, y, color) {
    paintCtx.fillStyle = color;
    const coords = fixCoords(x, y, paintCanvasSettings.pixelSize);
    paintCtx.fillRect(coords.x, coords.y, paintCanvasSettings.pixelSize, paintCanvasSettings.pixelSize);
}

function fixCoords(x, y, size = pixelBASESize) {
    return {
        x: Math.floor(x / size) * size,
        y: Math.floor(y / size) * size,
    };
}
