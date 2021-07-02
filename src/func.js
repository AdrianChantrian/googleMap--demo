
// to get timeString based on timestamp and rawOffset
export function formatDate(timestamp, rawOffset) {
    let date = new Date(timestamp);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return 'UTC'+ (rawOffset/3600 >= 0 ? ('+' + rawOffset/3600) : rawOffset/3600)+ ' ' + y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}
