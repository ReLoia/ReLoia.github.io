
// Elements
const timeCont = document.querySelector('[head] > div[info] t');
const etaEl = document.querySelector('age');

// Setup stuff
etaEl.innerText = Math.floor((new Date() - new Date('2006-02-13')) / 31104000000);

// Main 1s async interval
setInterval(async () => {
	timeCont.innerText = `${new Date().toLocaleString("en-US", { timeZone: "Europe/Rome", hour: "numeric", minute: "numeric" })}`
}, 1000)

const queries = location.search.slice(1).split('&').map(el => /(.+)=(.+)/g.exec(el));
((url, info) => {
	if (!url) return;
	document.querySelector('showcase').style.display = 'flex';
	document.querySelector('showcase img').src = `https://i.imgur.com/${url}`;
	document.querySelector('showcase p t').innerText = (info ?? '').replace(/%20/g, ' ');
})((queries.length ? queries.find(el => el?.[1] == 'image') : null)?.[2], (queries.length ? queries.find(el => el?.[1] == 'info') : null)?.[2])

// Premere qualasiasi tasto per continuare
// Fare che non si può scrollare il body
let pageActivated = false
let lastClientY = 0;
let moving = false;
const movingHandler = (e) => {
let goingUp = false;
if ('deltaY' in e) goingUp = delta < 0;
else {
goingUp = e.touches[0].clientY < lastClientY;
lastClientY = e.touches[0].clientY;
}
	moving = true;
	setTimeout(() => moving = false, 1000);
	if (goingUp && window.scrollY == 0) {
		pageActivated = false;
		document.body.style.position = 'fixed';
		document.querySelector('body').style.transform = 'translateY(0)'
	} else if (!pageActivated && !goingUp && window.scrollY == 0) activatePage(e);
}
document.onwheel = document.ontouchmove = movingHandler;
document.body.style.position = 'fixed';
const activatePage = (e) => {
	document.onkeydown = document.onmousedown = null;
	if (moving) return moving = false;

	if (e) {
		if ('key' in e) {
			if (e.key == 'Tab' || e.key == 'Alt') return;
		} else {
			if (['A', 'SVG'].includes(e.target.nodeName)) return;
		}
	}
	pageActivated = true;
	document.body.style.position = 'unset';
	document.querySelector('body').style.transform = 'translateY(-100vh)'
};
document.onkeydown = document.onmousedown = document.ontouchend = activatePage;
