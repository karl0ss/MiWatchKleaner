const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')
const fs = require('fs')
const {
    DownloaderHelper
} = require('node-downloader-helper');
const getFilesIn = require('get-files-in')
const http = require('http')
var shell = require('shelljs');
let logger = require('perfect-logger');

let adbRun

logger.initialize('RunTIme', {
    logLevelFile: 0,          // Log level for file
    logLevelConsole: -1,      // Log level for STDOUT/STDERR
    logDirectory: 'data/',    // Log directory
});

module.exports = {
    removeCompatibleApps: async () => {
        let installedAppList
        common.header('Remove Installed Apps')
        logger.info('Remove Installed Apps')
        await shellExec(adbRun + ' shell pm list packages -3').then(async function (result) {
            logger.info('Packages recieved from watch')
            if (result.stderr.includes('error')) {
                logger.info(result.stderr)
                console.log(chalk.red('Device not authorised'))
                common.pause(3000)
                await shellExec(adbRun + ' kill-server').then(async function (result) {
                    logger.info('Restarting ADB')
                    logger.info(result.stdout)
                    console.log('Please reconnect to watch')
                    common.pause(3000)
                    logger.info('Remove Installed Apps Failed')
                    module.exports.mainMenu()
                })
            } else {
                if (process.platform === 'win32' || process.platform === 'win64') {
                    installedAppList = result.stdout.split('\r\n'); // split string on comma space
                    installedAppList.splice(-1, 1)
                } else {
                    installedAppList = result.stdout.split('\n'); // split string on comma space
                    installedAppList.splice(-1, 1)
                }
                const value = await inquirer.installedApps(installedAppList);

                for (let element of value.removeAppsList) {
                    console.log('Removing ' + element)
                    logger.info('Removing ' + element)
                    const package = element.substring(8)
                    await shellExec(adbRun + ' uninstall ' + package).then(async function (result) {
                        console.log(element + ' - ' + result.stdout);
                        logger.info(element + ' - ' + result.stdout);
                    });
                }
                console.log(chalk.green('Removed Selected User Apps'))
                logger.info('Removed Selected User Apps')
                await common.pause(2000)
                module.exports.mainMenu()
            }
        })
    },
    compatibleApps: async () => {
        logger.info("Compatible Apps")
        common.header('Install Compatible Apps')
        let compatibleApps
        let url = "http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/compatibleApps.json";
        http.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    compatibleApps = JSON.parse(body);
                    logger.info("Compatible Apps found online")
                    // do something with JSON
                } catch (error) {
                    console.error(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });

        const value = await inquirer.compatibleApps();

        await shell.rm('-rf', './data/apps/*.apk');

        for (let element of value.removeAppsList) {
            for (let element2 of compatibleApps) {
                if (element === element2.name) {
                    const options = {
                        override: true,
                    }
                    const dl = new DownloaderHelper(element2.url, './data/apps/', options);
                    dl.on('end', () => console.log('Downloading Latest ' + element2.name + ' Complete'),
                        logger.info('Downloading Latest ' + element2.name + ' Complete')
                    )
                    await dl.start();
                }
            }
        }

        const apkList = await getFilesIn('./data/apps', matchFiletypes = ['apk'], checkSubDirectories = false)

        for (let element of apkList) {
            console.log('Installing ' + element)
            logger.info('Installing ' + element)
            await shellExec(adbRun + ' install -r ' + element).then(async function (result) {
                if (result.stderr != '') {
                    logger.info('Error ' + result.stderr);
                    console.log(chalk.redBright('Error - Device not authorised'));
                }
                console.log(element + ' - ' + result.stdout);
                logger.info(element + ' - ' + result.stdout);

                if (element === "data\\apps\\simpleweather_base.apk") {
                    const dl = new DownloaderHelper('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.armeabi_v7a.apk', './data/apps/', {
                        override: true,
                    });
                    dl.on('end', () => console.log('Downloading Latest Complete'),
                        logger.info('Downloading Latest Complete')
                    )
                    const dl2 = new DownloaderHelper('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.xhdpi.apk', './data/apps/', {
                        override: true,
                    });
                    dl2.on('end', () => console.log('Downloading Latest Complete'),
                        logger.info('Downloading Latest Complete')
                    )
                    await dl.start();
                    await dl2.start();
                    await shellExec(adbRun + ' install-multiple "data\\apps\\simpleweather_base.apk" "data\\apps\\simpleweather_split_config.armeabi_v7a.apk" "data\\apps\\simpleweather_split_config.xhdpi.apk"').then(function (result) {
                        console.log(result)
                        console.log('moreLocale Activated On Watch');
                        logger.info('moreLocale Activated On Watch');
                    })
                }

                if (element === "data\\apps\\MoreLocale.apk") {
                    await shellExec(adbRun + ' shell pm grant jp.co.c_lis.ccl.morelocale android.permission.CHANGE_CONFIGURATION').then(function (result) {
                        console.log('moreLocale Activated On Watch');
                        logger.info('moreLocale Activated On Watch');
                    })
                }
                if (element === "data\\apps\\com.alberto.locale.apk") {
                    await shellExec(adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION && ' + adbRun + ' shell am start -n com.alberto.locale/com.alberto.locale.MainActivity && ' + adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION').then(function (result) {
                        console.log(result)
                        console.log('Alberto Locale Activated On Watch');
                        logger.info('Alberto Locale Activated On Watch');
                    });
                }
            });
        }
        console.log(chalk.green('Compatible Apps Installed'))
        logger.info('Compatible Apps Installed')
        await common.pause(2000)
        module.exports.mainMenu()
    },
    removeApps: async () => {
        logger.info("Remove Apps")
        common.header('Remove Apps')
        const value = await inquirer.removeAppsList();
        for (let element of value.removeAppsList) {
            await shellExec(adbRun + ' shell pm uninstall -k --user 0 ' + element).then(function (result) {
                if (result.stderr != '') {
                    logger.info('Error ' + result.stderr);
                    console.log(chalk.redBright('Error - Device not authorised'));
                } else {
                    logger.info('Removing ' + element + ' - ' + result.stdout);
                    console.log('Removing ' + element + ' - ' + result.stdout);
                }
            });
        }
        console.log(chalk.green('Removal Complete'))
        await common.pause(2000)
        logger.info("Remove Complete")
        module.exports.mainMenu()
    },
    restoreApps: async () => {
        logger.info("Restore Apps")
        common.header('Restore Apps')
        const value = await inquirer.removeAppsList();
        for (let element of value.removeAppsList) {
            await shellExec(adbRun + ' shell cmd package install-existing ' + element).then(function (result) {
                if (result.stderr != '') {
                    logger.info('Error ' + result.stderr);
                    console.log(chalk.redBright('Error - Device not authorised'));
                } else {
                    logger.info('Restoring ' + element + ' - ' + result.stdout);
                    console.log('Restoring ' + element + ' - ' + result.stdout);
                }
            });
        }
        console.log(chalk.green('Restore Complete'))
        await common.pause(2000)
        logger.info("Restore Apps Complete")
        module.exports.mainMenu()
    },
    connectWifi: async () => {
        logger.info("Connect Wifi")
        const miwatchData = JSON.parse(fs.readFileSync('./data/MiWatch.json', 'utf8'));
        common.header('Connect Wifi')
        if (miwatchData.ipAddress !== "") {
            await shellExec(adbRun + ' kill-server')
            console.log('Trying to connect with stored ipAddress')
            shellExec(adbRun + ' connect ' + miwatchData.ipAddress).then(async function (result) {
                logger.info("Connect Wifi Result " + result.stdout)
                if (result.stdout.includes('already connected') || result.stdout.includes('connected to ')) {
                    console.log(chalk.green('MiWatch Connected'))
                    await common.pause(3000)
                    logger.info("Connect Wifi Complete")
                    module.exports.mainMenu()
                } else {
                    console.log(chalk.red('MiWatch not found'))
                    await common.pause(2000)
                    files.writeIpAddress('')
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWifi()
                }
            }).catch()
        } else {
            await shellExec(adbRun + ' kill-server')
            const value = await inquirer.connectWifi();
            const miWatchIpaddress = value.connectWifi
            shellExec(adbRun + ' connect ' + miWatchIpaddress).then(async function (result) {
                logger.info("Connect Wifi Result " + result.stdout)
                if (result.stdout.includes('already connected') || result.stdout.includes('connected to ')) {
                    console.log(chalk.green('MiWatch Connected'))
                    files.writeIpAddress(miWatchIpaddress)
                    await common.pause(3000)
                    logger.info("Connect Wifi Complete")
                    module.exports.mainMenu()
                } else {
                    if (result.stdout.includes('failed to authenticate')) {
                        console.log(chalk.redBright('MiWatch not authenticated'))
                    } else {
                        console.log(chalk.red('MiWatch not found'))
                    }
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWifi()
                }
            }).catch()
        }
    },
    mainMenu: async () => {
        common.header('Main Menu')
        if (process.platform === 'win32' || process.platform === 'win64') {
            adbRun = 'adb'
        } else {
            adbRun = './adb'
        }
        logger.info(process.platform + " detected")
        const mainMenuSelection = await inquirer.mainMenu();
        switch (mainMenuSelection.mainMenu) {
            case 'connect to miwatch via wifi':
                module.exports.connectWifi()
                break;
            case 'remove xiaomi apps':
                module.exports.removeApps()
                break;
            case 'restore xiaomi apps':
                module.exports.restoreApps()
                break;
            case 'install compatible apps':
                module.exports.compatibleApps()
                break;
            case 'remove installed apps':
                module.exports.removeCompatibleApps()
                break;
            case 'quit':
                break;
            default:
            // code block
        }
    }
};