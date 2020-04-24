const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const mainMenu = require('../app')


module.exports = {
    connectWifi: async () => {
        common.header()
        console.log(chalk.blue('Connect Wifi'))
        console.log(chalk.red('----------'))

        const miWatchIpaddress = await inquirer.connectWifi();
        shellExec('adb connect ' + miWatchIpaddress.connectWifi).then(async function (result) {
            if (result.stdout.includes('unable to connect')){
                console.log(chalk.red('MiWatch not found'))
                // await new Promise(resolve => setTimeout(resolve, 5000));
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
        common.header()
        console.log(chalk.blue('Main Menu'))
        console.log(chalk.red('----------'))
        const mainMenuSelection = await inquirer.mainMenu();
        console.log(mainMenuSelection);
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