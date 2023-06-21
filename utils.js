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