const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs')
var pjson = require('../package.json');
const fetch = require('node-fetch');


module.exports = {
    header: (page) => {
        clear();
        console.log(
            chalk.red(
                figlet.textSync('MiWatch Kleaner', {
                    horizontalLayout: 'full'
                })
            )
        );
        console.log(chalk.red('                                                                                     ' + pjson.version));
        console.log();

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
        const miwatchData = JSON.parse(fs.readFileSync('./data/MiWatch.json', 'utf8'));
        if (miwatchData.ipAddress === "") {
            console.log(chalk.white('MiWatch IP: ') + chalk.red('Not Connected'))
        } else {
            console.log(chalk.white('MiWatch IP: ' + chalk.green(miwatchData.ipAddress)))
        }
    },
    downloadFile: async (url, path) => {
        const res = await fetch(url);
        await new Promise((resolve, reject) => {
          const fileStream = fs.createWriteStream(path);
          res.body.pipe(fileStream);
          res.body.on("error", (err) => {
            reject(err);
          });
          fileStream.on("finish", function() {
            resolve();
          });
        });
    },
    getCompatibleAppsList: async () => {
        let settings = { method: "Get" };
        const response = await fetch("http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/compatibleApps.json", settings)
        .then(res => res.json())
            return response
    },
}