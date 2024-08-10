/*
 Paint Canvas (kinda like reddit's canvas)
 */

const paintCanvas = document.querySelector("canvas#paintCanvas");
paintCanvas.height = 140;
paintCanvas.width = 420;
const paintCtx = paintCanvas.getContext("2d");

const pixelSize = 14;
let pixelColor = "black";

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

    paintPixel(x, y, pixelColor);

    // await fetch("https://glitch-proxy.vercel.app/reloia-listen/paintcanvas", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ x, y, color }),
    // });
});

function paintPixel(x, y, color) {
    paintCtx.fillStyle = color;
    paintCtx.fillRect(Math.floor(x / pixelSize) * pixelSize, Math.floor(y / pixelSize) * pixelSize, pixelSize, pixelSize);
}