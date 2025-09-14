import fs from 'fs'
import chalk from 'chalk'

const processVariants = false;

const to_process = processVariants ? "./varieties-raw.json" : "./database-raw.json";
const processed = [];

function process() {
    console.clear();
    console.log(chalk.yellowBright('Intaking Raws..'));
    let adapted = JSON.parse(fs.readFileSync(to_process, { encoding: 'utf8', flag: 'r' }));
    console.log(chalk.yellowBright('Processing Raws..'));
    adapted.forEach(element => {
        element.results.forEach(element => {
            processed.push(element);
        });
    });
    console.log(chalk.yellowBright('Processing Complete. Writing to files..'));
    fs.writeFile(processVariants ? 'processed-variants.json' : 'processed-mindat.json', JSON.stringify(processed), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(chalk.greenBright('Raws Written Successfully'));
            console.log(' ');
        }
    })
}

process();