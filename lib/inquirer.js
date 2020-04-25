const inquirer = require('inquirer');
const files = require('./files')

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
    removeAppsList: async () => {
        const packages = await files.loadPackageList()

        const questions = [  {
            type: 'checkbox',
            name: 'Remove Apps List',
            message: 'What apps do you want to remove?',
            choices: packages.apps
          }]
        return inquirer.prompt(questions);
    },
};