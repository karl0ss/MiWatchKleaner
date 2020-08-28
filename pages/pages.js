const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const shellExec = require('shell-exec')
const files = require('../lib/files')
const getFilesIn = require('get-files-in')
let logger = require('perfect-logger');
const globalVariables = require('../lib/globalVars');


logger.info(process.platform + " detected")
if (process.platform === 'win32' || process.platform === 'win64') {
    adbRun = 'adb'
} else {
    adbRun = './adb'
}

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

        const compatibleApps = await common.getCompatibleAppsList()
        const value = await inquirer.compatibleApps();

        await common.clearApkFolder()

        for (let element of value.removeAppsList) {
            for (let element2 of compatibleApps) {
                if (element === element2.name) {
                    newName = element.replace(/\s/g, '');
                    await common.downloadFile(element2.url, './data/apps/' + newName + '.apk')
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
                    await common.downloadFile('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.armeabi_v7a.apk', './data/apps/simpleweather_split_config.armeabi_v7a.apk')
                    await common.downloadFile('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.xhdpi.apk', './data/apps/simpleweather_split_config.xhdpi.apk')
                    await shellExec(adbRun + ' install-multiple "data\\apps\\simpleweather_base.apk" "data\\apps\\simpleweather_split_config.armeabi_v7a.apk" "data\\apps\\simpleweather_split_config.xhdpi.apk"').then(function (result) {
                        console.log(result)
                        console.log('simpleWeather Activated On Watch');
                        logger.info('simpleWeather Activated On Watch');
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
            // await shellExec(adbRun + ' shell pm  disable-user --0 ' + element).then(function (result) {
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
    connectWatch: async () => {
        logger.info("Connect to watch")
        common.header('Connect to watch')
        const value = await inquirer.connectionType()
        if (value.connection === "usb") {
            await shellExec(adbRun + ' kill-server').then(async function (result) {
                logger.info('Restarting ADB')
                logger.info(result.stdout)
            })
            await shellExec(adbRun + ' devices').then(async function (result) {
                console.log(result.stdout)
                if (result.stdout.includes('device', 15)) {
                    console.log(chalk.green('MiWatch Connected via USB'))
                    await common.pause(3000)
                    logger.info("MiWatch connected")
                    globalVariables.localUSB = "X"
                    module.exports.mainMenu()
                } else {
                    console.log(chalk.red('MiWatch not found'))
                    logger.info("MiWatch not found")
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWatch()
                }
            })
        }
        if (value.connection === "wifi") {
            const value = await inquirer.connectWifi();
            await shellExec(adbRun + ' kill-server').then(async function (result) {
                logger.info('Restarting ADB')
                logger.info(result.stdout)
            })
            await shellExec(adbRun + ' connect ' + value.connectWifi).then(async function (result) {
                logger.info("Connect Wifi Result " + result.stdout)
                if (result.stdout.includes('already connected') || result.stdout.includes('connected to ')) {
                    console.log(chalk.green('MiWatch Connected'))
                    globalVariables.localUSB = ""
                    globalVariables.miWatchIpaddress = value.connectWifi
                    await common.pause(3000)
                    logger.info("Connect Wifi Complete")
                    module.exports.mainMenu()
                } else {
                    if (result.stdout.includes('failed to authenticate')) {
                        console.log(chalk.redBright('MiWatch not authenticated'))
                        logger.info('MiWatch not authenticated')
                    } else {
                        console.log(chalk.red(result.stdout))
                        logger.info(result.stdout)
                    }
                    await common.pause(2000)
                    console.log(chalk.white('Try Again'))
                    await common.pause(1000)
                    module.exports.connectWatch()
                }
            }).catch()
        }
    },
    oneClick: async () => {
        logger.info("1-Click Karl0ss Klean")
        common.header('1-Click Karl0ss Klean')
        const removalPackagesList = files.loadPackageList()
        for (let element of removalPackagesList.apps) {
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
        logger.info("Compatible Apps")

        await common.clearApkFolder()

        const compatibleApps = await common.getCompatibleAppsList()

        for (const element of compatibleApps) {
            if (element.Klean === "X") {
                try {
                    logger.info('Downloading Latest ' + element.name + ' Complete')
                    newName = element.name.replace(/\s/g, '');
                    await common.downloadFile(element.url, './data/apps/' + newName + '.apk')
                    logger.info('Downloading Latest ' + element.name + ' Complete')
                } catch (error) {
                    logger.info('Downloading Latest ' + element.name + ' FAILED')
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

            });
        }
        console.log(chalk.green('Compatible Apps Installed'))
        logger.info('Compatible Apps Installed')
        await common.pause(2000)
        module.exports.mainMenu()
    },
    restoreAnyApp: async () => {
        logger.info("Restore Any App")
        common.header('Restore Any App')
        const value = await inquirer.restoreAnyApp();
        await shellExec(adbRun + ' shell cmd package install-existing ' + value.restoreAnyApp).then(function (result) {
            if (result.stderr != '') {
                logger.info('Error ' + result.stderr);
                console.log(chalk.redBright('Error - Device not authorised'));
            } else {
                logger.info('Restoring ' + value.restoreAnyApp + ' - ' + result.stdout);
                console.log('Restoring ' + value.restoreAnyApp + ' - ' + result.stdout);
            }
        });
        console.log(chalk.green('Restore Complete'))
        await common.pause(2000)
        logger.info("App Restore Complete")
        module.exports.mainMenu()
    },
    batchInstallApks: async () => {
        logger.info("Batch Install Apks")
        common.header('Batch Install Apks')
        
        let apkList = await getFilesIn('./my_apk/', matchFiletypes = ['apk'], checkSubDirectories = false)

        await files.renameLocalApk(apkList)

        apkList = await getFilesIn('./my_apk/', matchFiletypes = ['apk'], checkSubDirectories = false)

        for (let element of apkList) {
            console.log('Installing ' + element)
            logger.info('Installing ' + element)
            await shellExec(adbRun + ' install -r ' + element).then(async function (result) {
                if (result.stderr != '') {
                    logger.info('Error ' + result.stderr);
                    console.log(chalk.redBright(result.stderr));
                }
                console.log(element + ' - ' + result.stdout);
                logger.info(element + ' - ' + result.stdout);
            });
        }
        console.log(chalk.green('Batch Install Apks Completed'))
        logger.info('Batch Install Apks Completed')
        await common.pause(2000)
        module.exports.mainMenu()
    },
    mainMenu: async () => {
        common.header('Main Menu')
        const mainMenuSelection = await inquirer.mainMenu();
        switch (mainMenuSelection.mainMenu) {
            case 'connect to miwatch':
                module.exports.connectWatch()
                break;
            case '1-click karl0ss klean':
                module.exports.oneClick()
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
            case 'batch remove installed apps':
                module.exports.removeCompatibleApps()
                break;
            case 'restore any app':
                module.exports.restoreAnyApp()
                break;
            case 'batch install apks':
                module.exports.batchInstallApks()
                break;
            case 'quit':
                break;
            default:
            // code block
        }
    }
};