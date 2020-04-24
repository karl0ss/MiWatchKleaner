const inquirer = require('inquirer');

module.exports = {
    mainMenu: () => {
        const questions = [{
            type: 'list',
            name: 'mainMenu',
            message: 'What do you want to do?',
            choices: ['Connect to MiWatch via Wifi', 'Remove Install Xiaomi Apps', 'Install Compatible Apps', 'Restore Uninstalled Apps'],
            filter: function (val) {
                return val.toLowerCase();
            }
        }];
        return inquirer.prompt(questions);
    },
    connectWifi: () => {
        const questions = [  {
            type: 'input',
            name: 'connectWifi',
            message: 'What is your MiWatch IpAdress?',
          },];
        return inquirer.prompt(questions);
    },
};