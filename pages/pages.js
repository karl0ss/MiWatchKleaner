const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')

module.exports = {
    removeApps: async () => {
        common.header('Remove Apps')
        const value = await inquirer.removeAppsList();      
        value.removeAppsList.forEach(async (element) => {
           await shellExec('adb shell pm uninstall -k --user 0 ' + element).then(async function (result) {
                console.log('Removing ' + element + ' - ' + result.stdout)
            }).catch()
        });
        console.log('complete')
    },
    restoreApps: async () => {
        common.header('Restore Apps')
        const value = await inquirer.removeAppsList();
        value.removeAppsList.forEach(element => {
            shellExec('adb shell cmd package install-existing ' + element).then(async function (result) {
                console.log('Installing ' + element + ' - ' + result.stdout)
            }).catch()
        });
    },
    connectWifi: async () => {
        common.header('Connect Wifi')
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
            } else {
                console.log(chalk.green('MiWatch Connected'))
                files.writeIpAddress(miWatchIpaddress)
                await common.pause(3000)
                module.exports.mainMenu()
            }
        }).catch()
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
            default:
                // code block
        }
    }
};