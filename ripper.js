import 'dotenv/config'
import request from 'request'
import fs from 'fs'
import chalk from 'chalk'

const key = 'Token ' + process.env.KEY;
const filters = '&ima_status=APPROVED&ima_status=GRANDFATHERED&entrytype=0'; // Approved / Grandfathered + Must be a mineral species
const url = 'https://api.mindat.org/v1/geomaterials/';

const lim = 10;
let compedTotal = [];
let collected = [];
let count = 0;
let start = 0;
let max = 619;

function proc(val) {
    if (typeof (+val || val) == "string") val = val.match(/\d+.\d+|\d+/g);
    return +val || 0;
}

// 10 Minerals a page
function pageLoop(page, amt = 0) {
    request.get(url + '?page=' + page + filters, { headers: { 'Authorization': key }}, (err, res, bdy) => {
        console.log(url + '?page=' + page + filters)
        let comped;
        try {
            comped = JSON.parse(bdy);
        } catch(e) {
            // Errored - Rate Limited
            setTimeout(() => {
                pageLoop(page, amt)
            }, 5000);
            return;
        }
        if (amt == 0) {
            start = page;
        }
        let minerals = comped.results;
        minerals.forEach(min => {
            let newmin = {};
            newmin.id = min.id;
            newmin.name = min.name;
            newmin.formula = min.mindat_formula;
            newmin.tenacity = min.tenacity;
            newmin.hmin = proc(min.hmin);
            newmin.hmax = proc(min.hmax);
            let moh = 0;
            if (newmin.hmax > 0 && newmin.hmin > 0)
                moh = (newmin.hmin + newmin.hmax) / 2;
            else
                moh = newmin.hmin || newmin.hmax; 
            newmin.mohs = moh;
            newmin.hardtype = proc(min.hardtype);
            newmin.vhnmin = proc(min.vhnmin);
            newmin.vhnmax = proc(min.vhnmax);
            let vik = 0;
            if (newmin.vhnmax > 0 && newmin.vhnmin > 0)
                vik = ((+newmin.vhnmin) + (newmin.vhnmax)) / 2;
            else
                vik = newmin.vhnmin || newmin.vhnmax;
            newmin.viks = vik;
            newmin.vhnerror = proc(min.vhnerror);
            newmin.vhng = proc(min.vhng);
            newmin.vhns = proc(min.vhns);
            newmin.densmin = proc(min.dmeas);
            newmin.densmax = proc(min.dmeas2);
            newmin.denscalc = proc(min.dcalc);
            if (newmin.densmin > 0 && newmin.densmin == newmin.densmax)
                newmin.dens = newmin.densmax;
            else
                newmin.dens = proc(newmin.denscalc);
            newmin.iormin = proc(min.rimin);
            newmin.iormax = proc(min.rimax);
            let ior = 0;
            if (newmin.iormax > 0 && newmin.iormin > 0)
                ior = ((newmin.iormin) + (newmin.iormax)) / 2;
            else
                ior = newmin.iormin || newmin.iormax;
            newmin.ior = ior;
            collected.push(newmin);
        });
        compedTotal.push(comped);
        console.clear();
        console.log(chalk.magentaBright('Mindat ') + 'Data Collector\n');
        console.log(chalk.redBright('Page ') + chalk.yellow(page + '/' + max) + chalk.redBright(' Downloaded..'));
        console.log(' ');
        if (comped.next == null || page >= max + 1) {
            fs.writeFile('database.json', JSON.stringify(collected), (err) => {
                console.clear();
                console.log(chalk.magentaBright('Mindat ') + 'Data Collector\n');
                if (err) {
                    console.error(err);
                } else {
                    console.log(chalk.greenBright('File Written Successfully with ' + (max - start) + ' Pages (' + collected.length + ' objects) Downloaded'));
                    console.log(' ');
                }
            });
            fs.writeFile('database-raw.json', JSON.stringify(compedTotal[0]), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(chalk.greenBright('Raws Written Successfully with ' + (max - start) + ' Pages (' + compedTotal.length + ' objects) Downloaded'));
                    console.log(' ');
                }
            })
        } else {
            pageLoop(page + 1, amt + 1)
        }
    });
}

pageLoop(1); // Page number. Change to wherever you wanna start the download