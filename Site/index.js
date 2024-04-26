const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');
let mnd = [];

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function start() {
    cvs.width = cvs.offsetWidth;
    cvs.height = cvs.offsetHeight;
    const marg = cvs.height / 20;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "white";
    let fxd = [];
    mnd.forEach((min) => {
        if ((min.vhnmin > 0 || min.vhnmax > 0) && (min.hmin > 0 || min.hmax > 0)) {
            let moh = (min.hmin + min.hmax) * 0.5;
            let vik = ((+min.vhnmin) + (+min.vhnmax)) * 0.5;
            let newmin = min;
            newmin.mohs = moh;
            newmin.viks = vik;
            fxd.push(newmin);
        }
    });
    const ref = (cvs.width - 2 * marg) / fxd.length;
    fxd.forEach((min, i) => {
        let x = map(min.mohs, 0, 10, 0, (cvs.width));
        let y = map(min.viks, 0, 5000, (cvs.height - marg), marg);
        ctx.fillRect(x, y, 1, 1);
    });
}

fetch('database.json').then((res) => {
    if (!res.ok)
        console.error(res.status);
    else
        return res.json();
}).then((data) => {
    mnd = data;
    start();
}).catch((e) => { console.error(e); });