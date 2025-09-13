import fs from 'fs'
import chalk from 'chalk'

const to_process = "./mindat-raw.json";
const processed = [];

function process() {
    console.clear();
    console.log(chalk.yellowBright('Intaking Raws..'));
    let adapted = JSON.parse(fs.readFileSync(to_process, { encoding: 'utf8', flag: 'r' }));
    console.log(chalk.yellowBright('Processing Raws..'));
    adapted.forEach(element => {
        let res = element.results[0];
        processed.push(res);
    });
    console.log(chalk.yellowBright('Processing Complete. Writing to files..'));
    fs.writeFile('processed.json', JSON.stringify(processed), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(chalk.greenBright('Raws Written Successfully'));
            console.log(' ');
        }
    })
}

process();