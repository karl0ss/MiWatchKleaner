const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const adb = require('node-adb');


module.exports = {
    connectWifi: async () => {
        common.header()
        console.log(chalk.blue('Connect Wifi'))
        console.log(chalk.red('----------'))

        const miWatchIpaddress = await inquirer.connectWifi();
        console.log(miWatchIpaddress.connectWifi)
        adb({
            cmd: ['devices']
        }, function (result) {
            console.log(result)
        });
    }
};