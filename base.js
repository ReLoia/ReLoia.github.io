
// Elements
const timeCont = document.querySelector('[head] > div[info] t');
// const title = document.querySelector('curtain [title]');

// title.onclick = () => {
// 	title.parentElement.style.transform = 'translateY(-100vh)'
// }

const queries = location.search.slice(1).split('&').map(el => /(.+)=(.+)/g.exec(el));
((url, info) => {
	if (!url) return;
	document.querySelector('showcase').style.display = 'flex';
	document.querySelector('showcase img').src = `https://i.imgur.com/${url}`;
	document.querySelector('showcase p t').innerText = (info ?? '').replace(/%20/g, ' ');
})((queries.length ? queries.find(el => el?.[1] == 'image') : null)?.[2], (queries.length ? queries.find(el => el?.[1] == 'info') : null)?.[2])

// Main 1s async interval
setInterval(async ()=> {
	timeCont.innerText = `${new Date().toLocaleString("en-US", {timeZone: "Europe/Rome", hour: "numeric", minute: "numeric"})}`
}, 1000)

// Premere qualasiasi tasto per continuare
// Fare che non si può scrollare il body

let pageActivated = false;
document.onwheel = (e) => {
	// console
	if (!pageActivated) return e.preventDefault();
	if (e.deltaY < 0 && window.scrollY == 0) {
		pageActivated = false;
		document.querySelector('body').style.transform = 'translateY(0)'
	}
}
document.onkeydown = () => {
	pageActivated = true;
	document.querySelector('body').style.transform = 'translateY(-100vh)'
}
document.onmousedown = () => {
	pageActivated = true;
	document.querySelector('body').style.transform = 'translateY(-100vh)'
}
