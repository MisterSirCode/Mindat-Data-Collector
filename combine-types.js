import fs from 'fs'
import chalk from 'chalk'

const variants = './processed-variants.json';
const minerals = './processed-mindat.json';

function process() {
    console.clear();
    console.log(chalk.yellowBright('Intaking..'));
    let avariants = JSON.parse(fs.readFileSync(variants, { encoding: 'utf8', flag: 'r' }));
    let aminerals = JSON.parse(fs.readFileSync(minerals, { encoding: 'utf8', flag: 'r' }));
    console.log(chalk.yellowBright('Processing..'));
    avariants.forEach(element => {
        aminerals.push(element);
    });
    console.log(chalk.yellowBright('Processing Complete. Writing to files..'));
    fs.writeFile('the-grand-database.json', JSON.stringify(aminerals), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(chalk.greenBright('Raws Written Successfully'));
            console.log(' ');
        }
    })
}

process();