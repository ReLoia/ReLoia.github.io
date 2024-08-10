function formatMS(ms) {
    let tmp = new Date(ms)
    const fixNum = (n) => String(n).length == 1 ? '0' + n : n;

    return `${tmp.getUTCHours() > 0 ? `${tmp.getUTCHours()}:` : ''}${fixNum(tmp.getMinutes())}:${fixNum(tmp.getSeconds())}`;
}
function handleTime(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${formatMS(date)}`;
}
function sameDay(date, date1) {
    return new Date(date).toDateString() == new Date(date1).toDateString();
}
function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
Object.defineProperty(Element.prototype, 'path', {
    get() {
        if (this == document.body) return [this];
        if (this.__path) return this.__path;
        const path = [];
        let node = this;
        while (node != document.body) {
            path.push(node);
            node = node.parentNode;
        }
        this.__path = path;
        return path;
    }
});