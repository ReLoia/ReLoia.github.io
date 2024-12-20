console.log(
    "%cReLoia\n%cHi! I hope you like the website. I have put a lot of effort into it. If you wish to contact me, my contact information can be found below.",
    "color: firebrick; font-size: clamp(5em, 15vw, 15em)",
    "color: white; font-size: 2em"
);

/**
 * This JavaScript file is executed after the HTML is loaded
 */
let BASEURL = "https://reloia.ddns.net/reloia_listen";

// Elements
const timeCont = document.querySelector("[head] > div[info] t");
const onlineCont = document.querySelector("[head] > div[online] t");
const etaEl = document.querySelector("age");

// Setup stuff
etaEl.innerText = Math.floor(
    (new Date() - new Date("2006-02-13")) / 31536000000
);

const queries = location.search
    ? location.search
        .slice(1)
        .split("&")
        .map(el => {
            if (el === "") return;
            const r = /(.+)=(.+)/g.exec(el);
            return [r?.[1], r?.[2]];
        })
    : null;

// Set debug mode on
if (queries && queries.find(el => el[0] === "debug")?.[1] === "on")
    BASEURL = "http://localhost:3000";

// Redirect to "First Day of having a Chicken" if user comes from Instagram
if (queries && queries[0][0] === "fbclid")
    setTimeout(
        () => {
            // delete fbclid from the url if it's the first query from the history
            history.replaceState(
                {},
                document.title,
                window.location.href.split("?")[0]
            );

            (window.location.href = "https://youtube.com/watch?v=ocuw3_DqyfE")
        }, 7777
    );

((url, info) => {
    if (!url) return;
    document.querySelector("showcase").style.display = "flex";
    document.querySelector("showcase img").src = url.startsWith("http") ? url : `https://i.imgur.com/${url}`;
    document.querySelector("showcase p t").innerText = (info ?? "").replace(
        /%20/g,
        " "
    );
})(
    (queries ? queries.find(el => el?.[0] === "image") : null)?.[1],
    (queries ? queries.find(el => el?.[0] === "info") : null)?.[1]
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
        if (lastClientY === 0) lastClientY = e.touches[0].clientY;
        if (Math.abs(e.touches[0].clientY - lastClientY) < 10) return;
        goingUp = e.touches[0].clientY > lastClientY;
        lastClientY = e.touches[0].clientY;
    }

    if (pageActivated && goingUp && window.scrollY < 20)
        // Disattiva la pagina
        deactivatePage();
    else if (!pageActivated && !goingUp && window.scrollY === 0) activatePage(e);
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
            if (
                ["Tab", "Shift", "Control", "Alt", "Meta"].includes(e.key)
            ) return;
            if (e.ctrlKey) return;
        } else if ("touches" in e) {
            lastClientY = 0;
        } else {
            if (e.button == 2) return;
            if (e.target._prevent) return;
            if (e.target.path.some(
                el => el == document.querySelector("div[spotify]") || el == document.querySelector("links") || el == document.querySelector("showcase")
            )) return e.target._prevent = true;
        }
    }
    pageActivated = true;
    document.body.style.position = "unset";
    document.querySelector("body").style.transform = "translateY(-100dvh)";
    window.scrollTo(0, 25);
    moving = true;
    setTimeout(() => (moving = false), 1000);
};
document.onkeydown = document.onmousedown = document.ontouchend = activatePage;

const cWC = (str, type, noBlock) => {
    if (type == "color") return `<span style="color: ${str}">${str}</span>`;
    return `<span ${type} ${noBlock ? "nB" : ""}>${str}</span>`;
};
document.querySelectorAll("span[code]").forEach(el => {
    let newText = el.innerHTML
        .replace(/\n/g, "") // tutto su una sola linea
        .replace(/(\/\*.*?\*\/)/g, cWC("$1", "comm")); // commenti

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
    if (newTime.startsWith("4:20")) timeCont.parentElement.classList.add("four20");
    else timeCont.parentElement.classList.remove("four20");

    if (timeCont.innerText != newTime) timeCont.innerText = newTime;
    if (pageActivated && window.scrollY < 20) deactivatePage();
}, 1000);

// songs of the day handler
let password = "";

window.sotd = [];
(async () => {
    const resultOfStatusCheck = await fetch(`${BASEURL}/`); // waits for the api to wake up
    resultOfStatusCheck.status === 200 ? console.log("API is up") : console.error(resultOfStatusCheck);

    const addSotD = document.querySelector("a[sotd]");
    if (!addSotD) return;
    addSotD.addEventListener("click", async () => {
        if (addSotD.classList.contains("added")) return;

        password = password || window.prompt("Type the API password", "");
        const result = await fetch(
            `${BASEURL}/sotd/url`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: password,
                },
                body: JSON.stringify({
                    url: document.querySelector("div[spotify] > a")
                        .href,
                }),
            }
        );
        if (result.status == 401) return (password = "");
        else if (result.status != 200) return console.error(result);

        if (!spotifyElem) return;
        (await addSong(
            document.getElementById("sotd"),
            {
                name: nomEl.innerText,
                author: autEl.innerText,
                date: new Date().toLocaleString("it", {
                    day: "numeric",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }),
                album: spotifyElem.querySelector("div > img").src,
            },
            0,
            true
        )).style.backgroundColor = "rgba(224, 192, 103, 0.06)";
        addSotD.classList.add("added");
    });

    const sotdEl = document.getElementById("sotd");
    let sotdResponse;
    try {
        sotdResponse = await fetch(
            `${BASEURL}/sotd`
        );
        throw sotdResponse;
    } catch (e) {
        if (e.status != 200) return (sotdEl.innerText = "Work in progress...");
        else if (e instanceof Error) console.error(e);
    }

    const sotd = (await sotdResponse.json()) || [];
    window.sotd = sotd;

    if (sotd.message || sotd.length == 0)
        return (sotdEl.innerText = "Work in progress...");

    sotdEl.innerHTML = "";
    if (sotd.length > 1)
        sotdEl.parentElement.querySelector("h2").innerHTML =
            `${sotd.length} Song<sub>s</sub> of the day<a regu>See more</a>`;
    (sotdMore = sotdEl.parentElement.querySelector("h2>a")).onclick = () => {
        if (sotdEl.classList.contains("open")) {
            sotdEl.classList.remove("open");
            sotdMore.innerText = "See more";
            sotdEl.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } else {
            sotdEl.classList.add("open");
            sotdMore.innerText = "See less";
        }
    };
    sotd.forEach((song, i) => addSong(sotdEl, song, i));
})();

const addSong = async (container, song, i, position = false) => {
    const songEl = document.createElement("div");
    songEl.setAttribute(
        "sotd",
        `${song.name.toLowerCase()}-${song.author.toLowerCase()}`
    );
    if (i == 0 && sameDay(song.date, Date.now()))
        songEl.style.backgroundColor = "#e0c0670f";
    songEl.innerHTML = `<img src="${song.album}" alt="Cover not found">
    <div>
        <t title="${song.name}">${song.name}</t>
        <p title="${song.author}">${song.author}</p>
        <c>${
        typeof song.date == "number"
            ? handleTime(new Date(song.date))
            : song.date
    }</c>
    </div>
    <div>
        <a class="added mouse-hover" id="sotd-${i}" title="Remove song from SotD" data-hoveranimationicon="unlike" >
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-4 0 32 32"">
                <path></path>
        </svg>
        </a>
    </div>`;
    if (position) container.prepend(songEl);
    else container.appendChild(songEl);
    document
        .querySelector(`#sotd a#sotd-${i}`)
        ?.addEventListener("click", () => {
            deleteSong(songEl);
        });
    mouseHoverHandler(document.querySelector(`#sotd a#sotd-${i}`));

    return songEl;
};
const deleteSong = async container => {
    password = password || window.prompt("Type the API password", "");
    const result = await fetch(
        `${BASEURL}/sotd/remove`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: password,
            },
            body: JSON.stringify({
                index:
                    window.sotd.length -
                    Array.from(container.parentElement.children).indexOf(
                        container
                    ),
            }),
        }
    );
    if (result.status == 200) {
        container.remove();
    } else if (result.status == 401) password = "";
    else console.error(result);
};
// end songs of the day handler

// Canvas
// Array of Functions that will be executed in the animation loop
const canvasRenderers = [];

function addCanvasRenderer(func) {
    canvasRenderers.push(func);
}

let lastMouseX = 0;
let lastMouseY = 0;
let lastTime = Date.now();
let userIsAFK = false;

backgroundImageEL = document.querySelector("background-image");

function baseCanvasRender() {
    // backgroundCanvasCTX.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    canvasRenderers.forEach(func => func());

    // Check if user is AFK (has not moved the mouse in 15 seconds)
    if ((Date.now() - lastTime) > 15_000) {
        if (!userIsAFK) {
            userIsAFK = true;
        }
    } else if (userIsAFK) {
        userIsAFK = false;
    }

    // Update last mouse position
    if (typeof mouse !== "undefined") {
        if (lastMouseX != mouse.x || lastMouseY != mouse.y) lastTime = Date.now();

        lastMouseX = mouse.x;
        lastMouseY = mouse.y;
    }

    // logic to show the background of backgroundImageEL
    if (!pageActivated) {
        backgroundImageEL.style.setProperty("--x", lastMouseX.toFixed(2) + "px");
        backgroundImageEL.style.setProperty("--y", lastMouseY.toFixed(2) + "px");
    }
    requestAnimationFrame(baseCanvasRender);
}

baseCanvasRender();
// End Canvas

let tabbingDelay = null;

// Check if the tabbed element is out of view and if so, scroll to it (activate page or deactivate page)
window.addEventListener("keydown", async e => {
    if (e.key == "Tab") {
        const tabbed = document.activeElement;
        if (tabbed == document.body) return;

        if (tabbingDelay != null) clearTimeout(tabbingDelay);
        tabbingDelay = setTimeout(() => {
            if (
                tabbed.getBoundingClientRect().top < 0 ||
                tabbed.getBoundingClientRect().bottom > window.innerHeight - 20
            ) {
                if (pageActivated) deactivatePage();
                else activatePage();
            }
        }, 250);
    }
});

// fav artists
const favArtists = document.querySelector("div[f] > div");

function shadowInterpolation(x, width) {
    return lerp(-width / 2, width / 2, x / width)
}

// on hover set the anchor of the translation to the absolute X of the mouse position relative to the element
favArtists.addEventListener("mousemove", e => {
    if ("touches" in e) return;

    const rect = favArtists.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if (x < 110 || (x > rect.width - 110)) {
        favArtists.style.setProperty("--scale", "1");
        return;
    }

    favArtists.style.setProperty("--x", `${x}px`);
    favArtists.style.setProperty("--scale", "1.2");
    favArtists.style.setProperty("--shadow-x", `${shadowInterpolation(x, rect.width) / 6}px`);
});
