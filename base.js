
// Elements
const timeCont = document.querySelector('[head] > div[info] t');
// const title = document.querySelector('curtain [title]');

// title.onclick = () => {
// 	title.parentElement.style.transform = 'translateY(-100vh)'
// }

// Main 1s async interval
setInterval(async ()=> {

	timeCont.innerText = `${new Date().toLocaleString("en-US", {timeZone: "Europe/Rome", hour: "numeric", minute: "numeric"})}`
}, 1000)
