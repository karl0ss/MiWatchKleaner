const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')


module.exports = {
    connectWifi: async () => {
        common.header('Connect Wifi')
        const miWatchIpaddress = await inquirer.connectWifi();
        this.miWatchIpaddress = miWatchIpaddress.connectWifi
        shellExec('adb connect ' + miWatchIpaddress).then(async function (result) {
            if (result.stdout.includes('unable to connect')) {
                console.log(chalk.red('MiWatch not found'))
                await common.pause(3000)
                module.exports.connectWifi()
            } else {
                console.log(chalk.green('MiWatch Connected'))
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