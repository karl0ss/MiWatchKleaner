const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')
const fs = require('fs')
const {
    DownloaderHelper
} = require('node-downloader-helper');
const getFilesIn = require('get-files-in')
const http = require('http')
var shell = require('shelljs');


module.exports = {
    compatibleApps: async () => {
        common.header('Install Compatible Apps')
        let compatibleApps
        let url = "http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/compatibleApps.json";
        http.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    compatibleApps = JSON.parse(body);
                    // do something with JSON
                } catch (error) {
                    console.error(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });

        const value = await inquirer.compatibleApps();

        await shell.rm('-rf', './data/apps/*.apk');

        for (let element of value.removeAppsList) {
            for (let element2 of compatibleApps) {
                if (element === element2.name) {
                    const options = {
                        override: true,
                    }
                    const dl = new DownloaderHelper(element2.url, './data/apps/', options);
                    dl.on('end', () => console.log('Downloading Latest ' + element2.name + ' Complete'))
                    await dl.start();
                }
            }
        }

        const apkList = await getFilesIn('./data/apps', matchFiletypes = ['apk'], checkSubDirectories = false)

        for (let element of apkList) {
            console.log('Installing ' + element)
            await shellExec('adb install -r ' + element).then(function (result) {
                console.log(element + ' - ' + result.stdout);
            });
        }
        console.log(chalk.green('Compatible Apps Installed'))
        await common.pause(2000)
        module.exports.mainMenu()
    },
    removeApps: async () => {
        common.header('Remove Apps')
        const value = await inquirer.removeAppsList();
        for (let element of value.removeAppsList) {
            await shellExec('adb shell pm uninstall -k --user 0 ' + element).then(function (result) {
                console.log('Removing ' + element + ' - ' + result.stdout);
            });
        }
        console.log(chalk.green('Removal Complete'))
        await common.pause(2000)
        module.exports.mainMenu()
    },
    restoreApps: async () => {
        common.header('Restore Apps')
        const value = await inquirer.removeAppsList();
        for (let element of value.removeAppsList) {
            await shellExec('adb shell cmd package install-existing ' + element).then(function (result) {
                console.log('Restoring ' + element + ' - ' + result.stdout);
            });
        }
        console.log(chalk.green('Restore Complete'))
        await common.pause(2000)
        module.exports.mainMenu()
    },
    connectWifi: async () => {
        const miwatchData = JSON.parse(fs.readFileSync('./data/MiWatch.json', 'utf8'));
        common.header('Connect Wifi')
        if (miwatchData.ipAddress !== "") {
            console.log('Trying to connect with stored ipAddress')
            shellExec('adb connect ' + miwatchData.ipAddress).then(async function (result) {
                if (result.stdout.includes('unable to connect')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    files.writeIpAddress('')
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else if (result.stdout.includes('cannot connect')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    files.writeIpAddress('')
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else if (result.stdout.includes('cannot resolve host')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    files.writeIpAddress('')
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else {
                    console.log(chalk.green('MiWatch Connected'))
                    await common.pause(3000)
                    module.exports.mainMenu()
                }
            }).catch()
        } else {
            const value = await inquirer.connectWifi();
            const miWatchIpaddress = value.connectWifi
            shellExec('adb connect ' + miWatchIpaddress).then(async function (result) {
                if (result.stdout.includes('unable to connect')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else if (result.stdout.includes('cannot connect')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else if (result.stdout.includes('cannot resolve host')) {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWifi()
                } else {
                    console.log(chalk.green('MiWatch Connected'))
                    files.writeIpAddress(miWatchIpaddress)
                    await common.pause(3000)
                    module.exports.mainMenu()
                }
            }).catch()
        }
    },
    mainMenu: async () => {
        common.header('Main Menu')
        const mainMenuSelection = await inquirer.mainMenu();
        switch (mainMenuSelection.mainMenu) {
            case 'connect to miwatch via wifi':
                module.exports.connectWifi()
                break;
            case 'remove xiaomi apps':
                module.exports.removeApps()
                break;
            case 'restore xiaomi apps':
                module.exports.restoreApps()
                break;
            case 'install compatible apps':
                module.exports.compatibleApps()
                break;
            case 'quit':
                break;
            default:
                // code block
        }
    }
};