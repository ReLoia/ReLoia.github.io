
// Elements
const timeCont = document.querySelector('[head] > div[info] t');
const etaEl = document.querySelector('age');

// Setup stuff
etaEl.innerText = Math.floor((new Date() - new Date('2006-02-13')) / 31104000000);

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
/**
 * 
 * @param {TouchEvent | WheelEvent} e 
 */
const movingHandler = (e) => {
	let goingUp = false;
	if ('deltaY' in e) goingUp = e.deltaY < 0
	else {
		if (lastClientY == 0) lastClientY = e.touches[0].clientY;
		if (Math.abs(e.touches[0].clientY - lastClientY) < 10) return;
		goingUp = e.touches[0].clientY > lastClientY;
		lastClientY = e.touches[0].clientY;
	}

	if (pageActivated && goingUp && window.scrollY < 20)  // Disattiva la pagina
		deactivatePage();
	else if (!pageActivated && !goingUp && window.scrollY == 0) activatePage(e);
}
document.onwheel = document.ontouchmove = movingHandler;
document.body.style.position = 'fixed';

const contentTitle = document.querySelector('hover > div[title]');
const deactivatePage = () => {
	if (moving) return;
	contentTitle.style.display = 'none';
	pageActivated = false;
	document.body.style.position = 'fixed';
	document.querySelector('body').style.transform = 'translateY(0)'
	moving = true;
	setTimeout(() => moving = false, 1000);
}
/**
 * @param {MouseEvent | KeyboardEvent | TouchEvent} e 
 */
const activatePage = (e) => {
	if (moving || pageActivated) return;
	if (e) {
		if ('key' in e) {
			if (e.key == 'Tab' || e.key == 'Alt') return;
		} else if ('touches' in e) {
			lastClientY = 0
		} else {
			if (['A', 'SVG'].includes(e.target.nodeName)) return;
		}
	}
	contentTitle.style.display = 'flex';
	pageActivated = true;
	document.body.style.position = 'unset';
	document.querySelector('body').style.transform = 'translateY(-100vh)'
	window.scrollTo(0, 25)
	moving = true;
	setTimeout(() => moving = false, 1000);
};
document.onkeydown = document.onmousedown = document.ontouchend = activatePage;

const cWC = (str, type, noBlock) => {
	if (type == 'color') return `<span style="color: ${str}">${str}</span>`;
	return `<span ${type} ${noBlock ? 'nB' : ''}>` + str + '</span>';
}

document.querySelectorAll('span[code]').forEach(el => {
	let newText = el.innerHTML
		.replace(/\n/g, '') // tutto su una sola linea
		.replace(/(\/\*.*?\*\/)/g, cWC('$1', 'comm')); // commenti

	const lang = el.getAttribute('code');

	switch (el.getAttribute('code')) {
		case 'js':
			newText = newText
				.replace(/(['].*?['])/g, cWC('$1', 'stri')) // stringhe
				.replace(/(const|var|let) (.*?) =/g, `${cWC('$1', "iniz")} ${cWC('$2', 'vnam')} =`) // variabili
				.replace(/(await|async)/g, cWC('$1', 'base')) // await e async e altre parole chiave
				.replace(/([^\s=]+)\s*\((.*?)\)/g, `${cWC('$1', 'func')}($2)`); // funzioni
			break;
		case 'css':
			newText = newText
				.replace(/([^\s=]+) {/g, `${cWC('$1 {', 'func')}`).replace(/}/g, cWC('}', 'func')) // element tags
				.replace(/([^\s=]+): (.*?);/g, `${cWC('$1', 'base')}: ${cWC('$2', 'vnam', true)};`) // proprieta
				.replace(/(#[\dA-z]{3,6})/g, cWC('$1', 'color'))
			break;
	}
	el.innerHTML = newText
		.replace(/(\d*?(deg|em|rem|%|))([,)])/g, `${cWC('$1', 'numb')}$3`) // numeri
		.replace(/\\nl/g, '<br>') // a capo
		.replace(/\\ta/g, cWC('', 'tab')) // tab
		;
})

document.querySelector('page > p > msg').innerText = 'ontouchstart' in window ? 'Touch anywhere' : 'Prss any key';

// Main 1s async interval
setInterval(async () => {
	const newTime = `${new Date().toLocaleString("en-US", { timeZone: "Europe/Rome", hour: "numeric", minute: "numeric" })}`;
	if (timeCont.innerText != newTime) timeCont.innerText = newTime;
	if (pageActivated && window.scrollY < 20) deactivatePage();
}, 1000)