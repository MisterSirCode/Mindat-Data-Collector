import 'dotenv/config'
import request from 'request'
import fs from 'fs'
import chalk from 'chalk'

const key = 'Token ' + process.env.KEY;
const filters = '&ima_status=APPROVED&ima_status=GRANDFATHERED&entrytype=0'; // Approved / Grandfathered + Must be a mineral species
const url = 'https://api.mindat.org/geomaterials/';

const lim = 10;
let collected = [];
let count = 0;
let start = 0;
let max = 0;

// 10 Minerals a page
function pageLoop(page, amt = 0) {
    request.get(url + '?page=' + page + filters, { headers: { 'Authorization': key }}, (err, res, bdy) => {
        let comped = JSON.parse(bdy);
        if (amt == 0) {
            start = page;
            count = comped.count;
            max = Math.ceil(count / 10);
        }
        let minerals = comped.results;
        let clamped = [];
        minerals.forEach(min => {
            let newmin = {};
            newmin.id = min.id;
            newmin.name = min.name;
            newmin.formula = min.mindat_formula;
            newmin.tenacity = min.tenacity;
            newmin.hmin = min.hmin;
            newmin.hmax = min.hmax;
            newmin.hardtype = min.hardtype;
            newmin.vhnmin = min.vhnmin;
            newmin.vhnmax = min.vhnmax;
            newmin.vhnerror = min.vhnerror;
            newmin.vhng = min.vhng;
            newmin.vhns = min.vhns;
            newmin.gravmin = min.dmeas;
            newmin.gravmax = min.dmeas2;
            newmin.gravrep = min.dcalc;
            newmin.iormin = min.rimin;
            newmin.iormax = min.rimax;
            clamped.push(newmin);
        });
        collected.push(clamped);
        console.clear();
        console.log(chalk.magentaBright('Mindat ') + 'Data Collector\n');
        console.log(chalk.redBright('Page ') + chalk.yellow(page + '/' + max) + chalk.redBright(' Downloaded..'));
        console.log(' ');
        if (comped.next == null) {
            fs.writeFile('database.json', JSON.stringify(collected), (err) => {
                console.clear();
                console.log(chalk.magentaBright('Mindat ') + 'Data Collector\n');
                if (err) {
                    console.error(err);
                } else {
                    console.log(chalk.greenBright('File Written Successfully with ' + (max - start) + ' Pages (Approx ' + amt * 10 + ' objects) Downloaded'));
                    console.log(' ');
                }
            });
        } else pageLoop(page + 1, amt + 1);
    });
}

pageLoop(0); // Page number. Change to wherever you wanna start the download