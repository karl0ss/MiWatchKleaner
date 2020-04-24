const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const inquirer = require('./lib/inquirer');

clear();

console.log(
    chalk.red(
        figlet.textSync('MiWatch Kleaner', {
            horizontalLayout: 'full'
        })
    )
);
console.log(chalk.red('2.0.0'));

console.log(
    chalk.red(
        '-------------------------------------------------------------------------------------------------------'
    )
)

const run = async () => {
    const mainMenuSelection = await inquirer.mainMenu();
    console.log(mainMenuSelection);
};

run();


// if (files.directoryExists('.git')) {
//     console.log(chalk.red('Already a Git repository!'));
//     process.exit();
// }