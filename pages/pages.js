const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const files = require('../lib/files')
const logger = require('perfect-logger');
const Language = require("@shypes/language-translator");
const adb = require('../lib/adb');

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
        common.header(await Language.get('remove_installed_apps_header'))
        logger.info(await Language.get('remove_installed_apps_header'))

        value = await adb.getInstalledPacakges()

        for (let element of value.removeAppsList) {
            console.log(await Language.get('removing') + ' ' + element)
            logger.info(await Language.get('removing') + ' ' + element)
            const package = element.substring(8)
            await adb.removeApk(package)
        }
        console.log(chalk.green(await Language.get('remove_selected_user_apps')))
        logger.info(await Language.get('remove_selected_user_apps'))
        await common.pause(2000)
        module.exports.mainMenu()

    },
    installCompatibleApps: async () => {
        logger.info(await Language.get('install_compatible_apps_header'))
        common.header(await Language.get('install_compatible_apps_header'))

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

        const apkList = await files.getListOfAPk('./data/apps')

        for (let package of apkList) {
            console.log(await Language.get('installing') + ' ' + package)
            logger.info(await Language.get('installing') + ' ' + package)
            await adb.installApk(package)
        }
        console.log(chalk.green(await Language.get('compatible_apps_installed')))
        logger.info(await Language.get('compatible_apps_installed'))
        await common.pause(2000)
        module.exports.mainMenu()
    },
    removeApps: async () => {
        logger.info("Remove Apps")
        common.header('Remove Apps')
        const value = await inquirer.removeAppsList();
        for (let package of value.removeAppsList) {
            await adb.removeXiaomiApk(package)
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
        for (let package of value.removeAppsList) {
            await adb.restoreXiaomiApk(package)
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
        connected = await adb.watchConnection(value)
        if (connected != true) {
            module.exports.connectWatch()
        } else {
            module.exports.mainMenu()
        }
    },
    oneClick: async () => {
        logger.info("1-Click Karl0ss Klean")
        common.header('1-Click Karl0ss Klean')
        const removalPackagesList = files.loadPackageList()
        for (let package of removalPackagesList.apps) {
            await adb.removeXiaomiApk(package)
        }
        console.log(chalk.green('Removal Complete'))
        await common.pause(2000)
        logger.info("Remove Complete")
        logger.info("Compatible Apps")

        await common.clearApkFolder()

        const compatibleApps = await common.getCompatibleAppsList()
        console.log(chalk.green('Download Compatible APKS'))

        for (const package of compatibleApps) {
            if (package.Klean === "X") {
                try {
                    newPacakgeName = package.name.replace(/\s/g, '');
                    await common.downloadFile(package.url, './data/apps/' + newPacakgeName + '.apk')
                    logger.info('Downloading Latest ' + package.name + ' Complete')
                    console.log('Downloading Latest ' + package.name + ' Complete')
                } catch (error) {
                    logger.info('Downloading Latest ' + package.name + ' FAILED')
                }
            }
        }
        const apkList = await files.getListOfAPk('./data/apps')
        console.log(chalk.green('Install Apks'))
        for (let element of apkList) {
            await adb.installApk(element)
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
        await adb.restoreAnyApk(value)
        console.log(chalk.green('Restore Complete'))
        await common.pause(2000)
        logger.info("App Restore Complete")
        module.exports.mainMenu()
    },
    batchInstallApks: async () => {
        logger.info("Batch Install Apks")
        common.header('Batch Install Apks')

        let apkList = await files.getListOfAPk('./my_apk/')
        await files.renameLocalApk(apkList)
        apkList = await files.getListOfAPk('./my_apk/')

        for (let element of apkList) {
            console.log('Installing ' + element)
            logger.info('Installing ' + element)
            await adb.installApk(element)
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
                module.exports.installCompatibleApps()
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