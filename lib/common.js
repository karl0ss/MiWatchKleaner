const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs')
var pjson = require('../package.json');
const fetch = require('node-fetch');

const globalVariables = require('../lib/globalVars');


module.exports = {
    header: (page) => {
        clear();
        console.log(
            chalk.red(
                figlet.textSync('MiWatch Kleaner', {
                    horizontalLayout: 'full'
                })
            )
        );
        console.log(chalk.red('                                                                                     ' + pjson.version));
        console.log();

        console.log(
            chalk.red(
                '-------------------------------------------------------------------------------------------------------'
            )
        )
        console.log(chalk.blue(page))
        module.exports.connectionCheck()
        console.log(chalk.red('----------'))
    },
    pause: async (time) => {
        await new Promise(resolve => setTimeout(resolve, time));
    },
    connectionCheck: async () => {
        if (globalVariables.localUSB === "X") {
            console.log(chalk.white('MiWatch: ') + chalk.green('Connected via USB'))
        }
        if (globalVariables.miWatchIpaddress != "") {
            console.log(chalk.white('MiWatch: ') + chalk.green('Connected via Wifi - ' + chalk.white(globalVariables.miWatchIpaddress)))
        }
        if (globalVariables.localUSB === "" && globalVariables.miWatchIpaddress === "") {
            console.log(chalk.white('MiWatch: ') + chalk.red('Not Connected'))
        }
    },
    downloadFile: async (url, path) => {
        const res = await fetch(url);
        await new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(path);
            res.body.pipe(fileStream);
            res.body.on("error", (err) => {
                reject(err);
            });
            fileStream.on("finish", function () {
                resolve();
            });
        });
    },
    getCompatibleAppsList: async () => {
        let settings = { method: "Get" };
        const response = await fetch("http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/compatibleApps.json", settings)
            .then(res => res.json())
        return response
    },
}