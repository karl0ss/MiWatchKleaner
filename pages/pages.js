const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')


module.exports = {
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
            case 'y':
                // code block
                break;
            default:
                // code block
        }
    }
};