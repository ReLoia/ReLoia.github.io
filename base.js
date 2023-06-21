// Elements
const timeCont = document.querySelector("[head] > div[info] t");
const etaEl = document.querySelector("age");

// Setup stuff
etaEl.innerText = Math.floor(
    (new Date() - new Date("2006-02-13")) / 31104000000
);

const queries = location.search
    ? location.search
        .slice(1)
        .split("&")
        .map(el => {
            if (el == "") return;
            const r = /(.+)=(.+)/g.exec(el);
            return [r?.[1], r?.[2]];
        })
    : null;
if (queries && queries[0][0] == "fbclid")
    setTimeout(
        () =>
            (window.location.href = "https://youtube.com/watch?v=ocuw3_DqyfE"),
        7777
    );

((url, info) => {
    if (!url) return;
    document.querySelector("showcase").style.display = "flex";
    document.querySelector("showcase img").src = `https://i.imgur.com/${url}`;
    document.querySelector("showcase p t").innerText = (info ?? "").replace(
        /%20/g,
        " "
    );
})(
    (queries ? queries.find(el => el?.[0] == "image") : null)?.[1],
    (queries ? queries.find(el => el?.[0] == "info") : null)?.[1]
);

// Premere qualasiasi tasto per continuare
let pageActivated = false;
let lastClientY = 0;
let moving = false;
/**
 *
 * @param {TouchEvent | WheelEvent} e
 */
const movingHandler = e => {
    let goingUp = false;
    if ("deltaY" in e) goingUp = e.deltaY < 0;
    else {
        if (lastClientY == 0) lastClientY = e.touches[0].clientY;
        if (Math.abs(e.touches[0].clientY - lastClientY) < 10) return;
        goingUp = e.touches[0].clientY > lastClientY;
        lastClientY = e.touches[0].clientY;
    }

    if (pageActivated && goingUp && window.scrollY < 20)
        // Disattiva la pagina
        deactivatePage();
    else if (!pageActivated && !goingUp && window.scrollY == 0) activatePage(e);
};
document.onwheel = document.ontouchmove = movingHandler;
document.body.style.position = "fixed";

const deactivatePage = () => {
    if (moving) return;
    pageActivated = false;
    document.body.style.position = "fixed";
    document.querySelector("body").style.transform = "translateY(0)";
    moving = true;
    setTimeout(() => (moving = false), 1000);
};
/**
 * @param {MouseEvent | KeyboardEvent | TouchEvent} e
 */
const activatePage = e => {
    if (moving || pageActivated) return;
    if (e) {
        if ("key" in e) {
            if (e.key == "Tab" || e.key == "Alt") return;
        } else if ("touches" in e) {
            lastClientY = 0;
        } else {
            if (["A", "SVG"].includes(e.target.nodeName)) return;
        }
    }
    pageActivated = true;
    document.body.style.position = "unset";
    document.querySelector("body").style.transform = "translateY(-100vh)";
    window.scrollTo(0, 25);
    moving = true;
    setTimeout(() => (moving = false), 1000);
};
document.onkeydown = document.onmousedown = document.ontouchend = activatePage;

const cWC = (str, type, noBlock) => {
    if (type == "color") return `<span style="color: ${str}">${str}</span>`;
    return `<span ${type} ${noBlock ? "nB" : ""}>` + str + "</span>";
};

document.querySelectorAll("span[code]").forEach(el => {
    let newText = el.innerHTML
        .replace(/\n/g, "") // tutto su una sola linea
        .replace(/(\/\*.*?\*\/)/g, cWC("$1", "comm")); // commenti

    const lang = el.getAttribute("code");

    switch (el.getAttribute("code")) {
        case "js":
            newText = newText
                .replace(/(['].*?['])/g, cWC("$1", "stri")) // stringhe
                .replace(
                    /(const|var|let) (.*?) =/g,
                    `${cWC("$1", "iniz")} ${cWC("$2", "vnam")} =`
                ) // variabili
                .replace(/(await|async)/g, cWC("$1", "base")) // await e async e altre parole chiave
                .replace(/([^\s=]+)\s*\((.*?)\)/g, `${cWC("$1", "func")}($2)`); // funzioni
            break;
        case "css":
            newText = newText
                .replace(/([^\s=]+) {/g, `${cWC("$1 {", "func")}`)
                .replace(/}/g, cWC("}", "func")) // element tags
                .replace(
                    /([^\s=]+): (.*?);/g,
                    `${cWC("$1", "base")}: ${cWC("$2", "vnam", true)};`
                ) // proprieta
                .replace(/(#[\dA-z]{3,6})/g, cWC("$1", "color")); // colori
            break;
    }
    el.innerHTML = newText
        .replace(/(\d*?(deg|em|rem|%|))([,)])/g, `${cWC("$1", "numb")}$3`) // numeri
        .replace(/\\nl/g, "<br>") // a capo
        .replace(/\\ta/g, cWC("", "tab")); // tab
});

document.querySelector("page > p > msg").innerText =
    "ontouchstart" in window ? "Touch anywhere" : "Press any key";

// Main 1s async interval
setInterval(async () => {
    const newTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Rome",
        hour: "numeric",
        minute: "numeric",
    });
    if (timeCont.innerText != newTime) timeCont.innerText = newTime;
    if (pageActivated && window.scrollY < 20) deactivatePage();
}, 1000);

// songs of the day handler
(async () => {
    await fetch("https://glitch-proxy.vercel.app/reloia-listen/"); // wake up the api

    const sotdEl = document.getElementById("sotd");
    let sotdResponse;
    try {
        sotdResponse = await fetch("https://glitch-proxy.vercel.app/reloia-listen/sotd")
        throw sotdResponse;
    } catch (e) { if (e.status != 200) return sotdEl.innerText = "Work in progress..."; else if (e instanceof Error) console.error(e); }

    const sotd = await sotdResponse.json() || [];

    if (sotd.message || sotd.length == 0) return sotdEl.innerText = "Work in progress...";

    sotdEl.innerHTML = "";
    if (sotd.length > 1) sotdEl.parentElement.querySelector("h2").innerText = "Song(s) of the day";
    sotd.forEach((song, i) => {
        const songEl = document.createElement("div");
        if (i == 0 && sameDay(song.date, Date.now())) songEl.style.backgroundColor = "#e0c0670f";
        songEl.innerHTML = `<img src="${song.album}" alt="Cover not found">
		<div>
			<t>${song.name}</t>
			<p>${song.author}</p>
			<c>${typeof song.date == "number" ? handleTime(new Date(song.date)) : song.date}</c>
		</div>`;
        sotdEl.appendChild(songEl);
    });
})();

// Debug
function addSOTDElement(name, author, date, album) {
    const sotdEl = document.getElementById("sotd");
    const sotd = [{ name, author, date, album }];
    if (sotd.length > 1)
        songEl.parentElement.querySelector("h2").innerText =
            "Song(s) of the day";
    sotd.forEach((song, i) => {
        const songEl = document.createElement("div");
        if (i == 0) songEl.style.backgroundColor = "#bf99301f";
        songEl.innerHTML = `<img src="${song.album}" alt="Cover not found">
		<div>
			<t>${song.name}</t>
			<p>${song.author}</p>
			<c>${typeof song.date == "number" ? handleTime(new Date(song.date)) : song.date}</c>
		</div>`;
        sotdEl.appendChild(songEl);
    });
}