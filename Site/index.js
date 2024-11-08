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

function mohsVsVickers(ctx, marg) {
    ctx.fillText("Mohs Hardness (x) compared to Vickers Hardness (y)", 30, 50);
    mnd.forEach((min, i) => {
        if (min.mohs > 0 && min.viks > 0) {
            let x = map(min.mohs, 0.8, 10, marg, cvs.width - marg * 2);
            let y = map(min.viks, 100, 4000, cvs.height - marg * 2, marg);
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

let mohsTotal = 0;
let biggestMohs = {};
let mitems = 0;
let densTotal = 0;
let biggestDens = {};
let ditems = 0;
let iorTotal = 0;
let biggestIor = {};
let ritems = 0;
let vikTotal = 0;
let biggestViks = {};
let vitems = 0;

function randomStats() {
    let ites = [];
    let nonites = [];
    mnd.forEach((min, i) => {
        // if (min.name.endsWith('ite') || min.name.includes('ite-') || min.name.includes('ite–') || min.name.includes('ite ') || min.name.endsWith('yte')) ites.push(min.name);
        // else nonites.push(min.name);
        ites.push(min.name);
        if (i == 0) {
            biggestMohs = biggestDens = biggestIor = biggestViks = min;
        }
        if (min.mohs > 0) {
            if (min.mohs > biggestMohs.mohs)
                biggestMohs = min;
            mohsTotal += min.mohs;
            mitems++;
        }
        if (min.dens > 0) {
            if (min.dens > biggestDens.dens)
                biggestDens = min;
            densTotal += min.dens;
            ditems++;
        }
        if (min.iormax > 0) {
            if (min.iormax > biggestIor.iormax)
                biggestIor = min;
            iorTotal += min.iormax;
            ritems++;
        }
        if (min.viks > 0) {
            if (min.viks > biggestViks.viks)
                biggestViks = min;
            vikTotal += min.viks;
            vitems++;
        }
    });
    mohsAvg = mohsTotal / mitems;
    densAvg = densTotal / ditems;
    iorAvg = iorTotal / ritems;
    vikAvg = vikTotal / vitems;
    console.log(`Mohs Average: ${Math.round(mohsAvg * 1000) / 1000}, ${Math.round(mohsTotal * 1000) / 1000} total (${mitems} species)`);
    console.log(`Density Average: ${Math.round(densAvg * 1000) / 1000}, ${Math.round(densTotal * 1000) / 1000} total (${ditems} species)`);
    console.log(`IOR Average: ${Math.round(iorAvg * 1000) / 1000}, ${Math.round(iorTotal * 1000) / 1000} total (${ritems} species)`);
    console.log(`Vickers Average: ${Math.round(vikAvg * 1000) / 1000}, ${Math.round(vikTotal * 1000) / 1000} total (${vitems} species)`);
    console.log(`Hardest on the mohs scale: `, biggestMohs);
    console.log(`Densest Mineral: `, biggestDens);
    console.log(`Largest IOR: `, biggestIor);
    console.log(`Hardest on the vickers scale: `, biggestViks);
    console.log('All "ite" minerals', ites);
    console.log('All "nonite" minerals', nonites);
    console.log('Merged ites: ', ites.join('", "'));
    // console.log('Merged nonites: ', nonites.join('\n'));
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
    mohsVsVickers(ctx, marg);
    randomStats();
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