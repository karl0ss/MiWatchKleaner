const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs')
var pjson = require('../package.json');
const fetch = require('node-fetch');
var shell = require('shelljs');
const logger = require('perfect-logger');
const Language = require("@shypes/language-translator");

const globalVariables = require('../lib/globalVars');

module.exports = {
    header: async (page) => {
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
        console.log(chalk.blue(await Language.get(page)))
        module.exports.connectionCheck()
        console.log(chalk.red('----------'))
    },
    pause: async (time) => {
        await new Promise(resolve => setTimeout(resolve, time));
    },
    connectionCheck: async () => {
        if (globalVariables.localUSB === "X") {
            console.log(chalk.white('MiWatch: ') + chalk.green(await Language.get('connected-via-usb')))
        }
        if (globalVariables.miWatchIpaddress != "") {
            console.log(chalk.white('MiWatch: ') + chalk.green(await Language.get('connected-via-wifi') + ' ' + chalk.white(globalVariables.miWatchIpaddress)))
        }
        if (globalVariables.localUSB === "" && globalVariables.miWatchIpaddress === "") {
            console.log(chalk.white('MiWatch: ') + chalk.red(await Language.get('not-connected')))
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
    clearApkFolder: async () => {
        await shell.rm('-rf', './data/apps/*.apk');
    },
    log: async (item) => {
        logger.info(await Language.get(item, 'en'))
    },
    print: async (item, colour) => {
        switch (colour) {
            case 'green':
                console.log(chalk.green(await Language.get(item)))
                break;
            case 'red':
                console.log(chalk.redBright(await Language.get(item)))
                break;
            case 'whiteBright':
                console.log(chalk.whiteBright(await Language.get(item)))
                break;
            default:
                console.log(chalk.white(await Language.get(item)))
                break;
        }
    },
    dualLog: async (item, colour) => {
        await module.exports.log(item)
        await module.exports.print(item, colour)
    }
}