import 'dotenv/config'
import request from 'request'
import fs from 'fs'
import { isNull } from 'util';

const key = 'Token ' + process.env.KEY;
const filters = '&ima_status=APPROVED&ima_status=GRANDFATHERED&entrytype=0'; // Approved / Grandfathered + Must be a mineral species
const url = 'https://api.mindat.org/geomaterials/';

const lim = 10;
let collected = [];
let count = 0;

// 10 Minerals a page
function pageLoop(page) {
    request.get(url + '?page=' + page + filters, { headers: { 'Authorization': key }}, (err, res, bdy) => {
        let comped = JSON.parse(bdy);
        if (page == 1)
            count = comped.count;
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
        console.log('page_' + page + ' complete');
        if (comped.next == null) {
            fs.writeFile('database.json', JSON.stringify(collected), (err) => { console.error(err) });
        } else pageLoop(page + 1);
    });
}

pageLoop(1);