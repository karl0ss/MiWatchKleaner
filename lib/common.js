const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = {
    header: () => {
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
    },
    pause: async (time) => {
        await new Promise(resolve => setTimeout(resolve, time));
    }
}