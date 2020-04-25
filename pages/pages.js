const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')
const fs = require('fs')

module.exports = {
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
        common.header('Remove Apps')
        const value = await inquirer.removeAppsList();
        for (let element of value.removeAppsList) {
            await shellExec('adb shell cmd package install-existing ' + element).then(function (result) {
                console.log('Removing ' + element + ' - ' + result.stdout);
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
            console.log('pooooooo')
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
            case 'quit':
                break;
            default:
                // code block
        }
    }
};