const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const pathExists = require('path-exists');
const fs = require('fs')
const path = require("path");


module.exports = {
    writeIpAddress: (value) => {
        const data = {
            ipAddress: value
        }
        try {
            fs.writeFileSync('./data/MiWatch.json', JSON.stringify(data))
        } catch (err) {
            console.log(err)
        }
    },
    header: (page) => {
        clear();
        console.log(
            chalk.red(
                figlet.textSync('MiWatch Kleaner', {
                    horizontalLayout: 'full'
                })
            )
        );
        console.log(chalk.red('                                                                                     2.0.0'));
        console.log(
            chalk.red(
                '-------------------------------------------------------------------------------------------------------'
            )
        )
        console.log(chalk.blue(page))
        module.exports.ipCheck()
        console.log(chalk.red('----------'))
    },
    pause: async (time) => {
        await new Promise(resolve => setTimeout(resolve, time));
    },
    ipCheck: async () => {
        const miwatchData = JSON.parse(fs.readFileSync('./data/MiWatch.json', 'utf8'));
        if (miwatchData.ipAddress === "") {
            console.log(chalk.white('MiWatch IP: ') + chalk.red('Not Connected'))
        } else {
            console.log(chalk.white('MiWatch IP: ' + chalk.green(miwatchData.ipAddress)))
        }
    }
}