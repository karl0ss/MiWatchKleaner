const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const common = require('./lib/common');
const inquirer = require('./lib/inquirer');
const connectWifi = require('./pages/pages')


const mainMenu = async () => {
    common.header()
    console.log(chalk.blue('Main Menu'))
    console.log(chalk.red('----------'))
    const mainMenuSelection = await inquirer.mainMenu();
    console.log(mainMenuSelection);
    switch(mainMenuSelection.mainMenu) {
        case 'connect to miwatch via wifi':
        connectWifi.connectWifi()
        break;
        case 'y':
          // code block
          break;
        default:
          // code block
      }
};

mainMenu();


// if (files.directoryExists('.git')) {
//     console.log(chalk.red('Already a Git repository!'));
//     process.exit();
// }