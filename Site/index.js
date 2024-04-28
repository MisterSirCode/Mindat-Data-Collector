const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');
let mnd = [];
let densest = {
    grav: 0
};

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
    const ref = (cvs.width - 2 * marg) / fxd.length;
    mnd.forEach((min, i) => {
        if (min.grav > densest.grav) {;
            densest = min;
        }
        // Horizontal Vickers / Vertical Mohs
        // let x1 = map(+min.vhnmin || min.viks, 0, 3000, marg, cvs.width - marg);
        // let x2 = map(+min.vhnmax || min.viks, 0, 3000, marg, cvs.width - marg);
        // let x3 = map(min.viks, 0, 3000, marg, cvs.width - marg);
        // let y1 = map(min.hmin || min.mohs, 0, 10, cvs.height, marg);
        // let y2 = map(min.hmax || min.mohs, 0, 10, cvs.height, marg);
        // let y3 = map(min.mohs, 0, 10, cvs.height, marg);

        // Horizontal Mohs / Vertical Vickers
        // let x1 = map(min.hmin || min.mohs, 0, 10,  0, cvs.width - marg);
        // let x2 = map(min.hmax || min.mohs, 0, 10,  0, cvs.width - marg);
        // let x3 = map(min.mohs, 0, 10,  0, cvs.width - marg);
        // let y1 = map(+min.vhnmin || min.viks, 0, 5000, cvs.height - marg, marg);
        // let y2 = map(+min.vhnmax || min.viks, 0, 5000, cvs.height - marg, marg);
        // let y3 = map(min.viks, 0, 5000, cvs.height - marg, marg);

        let x = map(min.viks, 0, 3000,  marg, cvs.width - marg);
        let y = map(+min.gravrep, 0, 50, cvs.height - marg, marg);

        // Three Color
        // ctx.fillStyle = "#ff0000";
        // ctx.fillRect(x1, y1, 1, 1);
        // ctx.fillStyle = "#ffff00";
        // ctx.fillRect(x2, y2, 1, 1);
        // ctx.fillStyle = "#00ffff";
        // ctx.fillRect(x3, y3, 1, 1);

        // Single Color
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