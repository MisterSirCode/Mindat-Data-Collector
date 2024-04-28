const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');
let mnd = [];
let densest = {
    grav: 0
};

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function vickersVsDensity(ctx, marg) {
    ctx.fillText("Vickers Hardness (x) compared to Density (y)", 30, 50);
    mnd.forEach((min, i) => {
        if (min.viks > 0 && min.dens > 0) {
            let x = map(min.viks, 0, 3000, marg, cvs.width - marg * 2);
            let y = map(min.dens, 3, 30, cvs.height - marg * 2, marg);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(x, y, 2, 2);
        }
    });
}

function vickersVsMohs(ctx, marg) {
    ctx.fillText("Vickers Hardness (x) compared to Mohs Hardness (y)", 30, 50);
    mnd.forEach((min, i) => {
        if (min.viks > 0 && min.mohs > 0) {
            let x = map(min.viks, 0, 3000, marg, cvs.width - marg * 2);
            let y = map(min.mohs, 1.5, 12, cvs.height - marg * 2, marg);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(x, y, 2, 2);
        }
    });
}

function densityVsIor(ctx, marg) {
    ctx.fillText("Density (x) compared to Refractive Index (y)", 30, 50);
    mnd.forEach((min, i) => {
        if (min.dens > 0 && min.ior > 0) {
            let x = map(min.dens, 1, 10, marg, cvs.width - marg * 2);
            let y = map(min.ior, 1.4, 4, cvs.height - marg * 2, marg);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(x, y, 2, 2);
        }
    });
}

function densityVsMohs(ctx, marg) {
    ctx.fillText("Density (x) compared to Mohs Hardness (y)", 30, 50);
    mnd.forEach((min, i) => {
        if (min.dens > 0 && min.mohs > 0) {
            let x = map(min.dens, 0.5, 25, marg, cvs.width - marg * 2);
            let y = map(min.mohs, 1.2, 12, cvs.height - marg * 2, marg);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(x, y, 2, 2);
        }
    });
}

function start() {
    cvs.width = cvs.offsetWidth;
    cvs.height = cvs.offsetHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "white";
    const marg = cvs.height / 20;
    const ref = (cvs.width - 2 * marg) / mnd.length;
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    densityVsMohs(ctx, marg);
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