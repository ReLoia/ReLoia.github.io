
// Elements
const timeCont = document.querySelector('[head] > div[info] t');

// Main 1s async interval
setInterval(async ()=> {

	timeCont.innerText = `${new Date().toLocaleString("en-US", {timeZone: "Europe/Rome", hour: "numeric", minute: "numeric"})}`
}, 1000)


// let styl = document.querySelector("[curt]");

// let rot = 90;
// let posY = 0;
// let posX = 0;

// let rotation = {
// 	update: () => {
// 		return;
// 		styl.innerText = `curtain { --ang: ${rot}deg; --posY: ${posY}; --posX: ${posX} } curtain > t:after { content: "${rot}" }`;
// 	},
// 	set: (num, useGoto) => {
// 		if (useGoto && (Math.max(rot, num) - Math.min(rot, num) > 40) ) {
// 			rotation.goto(num);
// 		} else {
// 			rot = Math.round(num);
// 			rotation.update();
// 		}
// 	},
// 	add: (num) => {
// 		// rot += (rot + num) > 360 ? (Math.sign(num) * -1) * 360 : num;
// 		rot += num;
// 		if (rot > 360) rot -= Math.floor(rot / 360) * 360;
// 		if (rot < 0) rot += 360;
// 		rotation.update();
// 	},
// 	interval: 15,
// 	hand: () => {
// 		// rot += rot >= 360 ? -360 : 1;
// 		rotation.add(1);
// 		rotation.update();
// 	},
// 	gotoInt: 'nullo',
// 	goto: (num) => {
// 		if (num > 360) {
// 			num -= Math.floor(num / 360) * 360;
// 		} else if (num < 0) {
// 			num += Math.floor((num * -1) / 360) * 360 + 360;
// 			// + 360
// 		} else if (num == 360) num = 0;
// 		if (num == rot) return;
// 		console.log(num);

// 		let segn = 1;
// 		if (num > rot && num - rot <= 180) segn = 1;
// 		else if (num > rot && num - rot > 180) segn = -1;
// 		else if (rot > num && rot - num <= 180) segn = -1;
// 		else if (rot > num && rot - num > 180) segn = 1;

// 		rotation.toggle(true);
// 		if (rotation.gotoInt != 'nullo') clearInterval(rotation.gotoInt);
// 		rotation.gotoInt = setInterval(() => {
// 			rotation.toggle(true);
// 			rotation.add(segn);
// 			if (num == rot || num == rot - 360 || num == rot + 360) clearInterval(rotation.gotoInt);
// 		}, 0);
// 	},
// 	toggle: (or) => {
// 		// or: true -> Pause
// 		// or: false -> Resume
// 		const pause = document.querySelector("links > p > c:first-of-type");
// 		if ((or || pause.innerText == 'pause') && or != false) {
// 			rotation.paused = true;
// 			pause.innerText = 'resume';
// 			clearInterval(int);
// 		} else {
// 			rotation.paused = false;
// 			pause.innerText = 'pause';
// 			clearInterval(int);
// 			int = setInterval(rotation.hand, rotation.interval);
// 		}
// 	},
// 	paused: false,
// 	changeInterval: (val) => {
// 		rotation.toggle(true);
// 		rotation.interval = val;
// 		rotation.toggle();
// 	}
// };

// let int = setInterval(rotation.hand, rotation.interval);

// let mousa;

// let scrolla;
// document.onwheel = (e) => {
// 	clearTimeout(scrolla);
// 	scrolla = setTimeout(() => {
// 		scrolla = undefined;

// 		clearInterval(int);
// 		if (mousa || rotation.paused) return;
// 		int = setInterval(rotation.hand, rotation.interval);
// 	}, 66);
// 	if (scrolla) {
// 		clearInterval(int);
// 	}

// 	rotation.add(Math.sign(e.deltaY) * 10);
// };

// let lastmouse = 0;
// window.curtain = document.querySelector('curtain');

// curtain.oncontextmenu = () => {
// 	return false;
// };

// curtain.onmousedown = () => {
// 	mousa = true;
// 	rotation.toggle(true);
// };
// curtain.onmouseup = () => {
// 	mousa = false;
// 	rotation.toggle();
// };
// curtain.onmousemove = (e) => {
// 	if (mousa) {
// 		clearInterval(int);

// 		const mousePos = e.clientY;
// 		if (mousePos == lastmouse) return;

// 		if (lastmouse >= mousePos) {
// 			rotation.add(-5);
// 		} else {
// 			rotation.add(5);
// 		}
// 		if (rot < 0) rot += 360;

// 		rotation.update();
// 		lastmouse = mousePos;
// 	}
// };
