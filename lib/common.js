const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');


module.exports = {
    storeIp: (value) => {
       let miWatchIpaddress = value
    },
    header: (page) => {
        clear();
        console.log(
            chalk.red(
                figlet.textSync('MiWatch Kleaner', {
                    horizontalLayout: 'full'
                })
            )
        );

        console.log(chalk.red('                                                                                     2.0.0'));

        console.log(
            chalk.red(
                '-------------------------------------------------------------------------------------------------------'
            )
        )

        console.log(chalk.blue(page))
        module.exports.ipCheck()
        console.log(chalk.red('----------'))
    },
    pause: async (time) => {
        await new Promise(resolve => setTimeout(resolve, time));
    },
    ipCheck: async () => {
        if (module.exports.storeIp.miWatchIpaddress === undefined) {
            console.log(chalk.white('Connected IP: ') + chalk.red('Not Connected'))
        } else {
            console.log(chalk.white('Connected IP: ' + chalk.green(module.defaults.storeIp.miWatchIpaddress)))
        }
    }
}