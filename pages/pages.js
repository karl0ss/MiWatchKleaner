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
    oneClick: async () => {
        common.log('main-menu-item-1')
        common.header('main-menu-item-1')
        common.print('remove-xiaomi-apps', 'whiteBright')
        const removalPackagesList = files.loadPackageList()
        for (let package of removalPackagesList.apps) {
            await adb.removeXiaomiApk(package)
        }
        common.print('removal-complete', 'green')
        await common.pause(2000)
        common.log('removal-complete')
        common.log('compatible-apps')
        
        await common.clearApkFolder()

        const compatibleApps = await common.getCompatibleAppsList()
        
        console.log(chalk.whiteBright('----------'))
        common.print('downloading-compatible-apps', 'whiteBright')
        
        for (const package of compatibleApps) {
            if (package.Klean === "X") {
                try {
                    newPacakgeName = package.name.replace(/\s/g, '');
                    await common.downloadFile(package.url, './data/apps/' + newPacakgeName + '.apk')
                    logger.info(await Language.get('downloading-latest', 'en') + ' ' + package.name + ' ' + chalk.green(await Language.get('complete', 'en')))
                    console.log(await Language.get('downloading-latest') + ' ' + package.name + ' ' + await Language.get('complete'))
                } catch (error) {
                    logger.info(await Language.get('downloading-latest', 'en') + ' ' + package.name + ' ' + chalk.red(await Language.get('failed', 'en')))
                    console.log(await Language.get('downloading-latest') + ' ' + package.name + ' ' + await Language.get('failed'))
                }
            }
        }
        const apkList = await files.getListOfAPk('./data/apps')
        console.log(chalk.whiteBright('----------'))
        common.print('installing-apps', 'whiteBright')
        for (let element of apkList) {
            await adb.installApk(element)
        }
        common.dualLog('compatible-apps-installed', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    removeXiaomiApps: async () => {
        common.header(await Language.get('main-menu-item-2'))
        common.log('main-menu-item-2', 'green')
        const value = await inquirer.removeAppsList();
        for (let package of value.removeAppsList) {
            await adb.removeXiaomiApk(package)
        }
        common.dualLog('removal-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    restoreXiaomiApps: async () => {
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

    installCompatibleApps: async () => {
        logger.info(await Language.get('install-compatible-apps-header', 'en'))
        common.header(await Language.get('install-compatible-apps-header'))

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
            logger.info(await Language.get('installing', 'en') + ' ' + package)
            await adb.installApk(package)
        }
        console.log(chalk.green(await Language.get('compatible-apps-installed')))
        logger.info(await Language.get('compatible-apps-installed', 'en'))
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

        let apkList = await files.getListOfAPk('./my-apk/')
        await files.renameLocalApk(apkList)
        apkList = await files.getListOfAPk('./my-apk/')

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

    batchRemoveInstalledApps: async () => {
        common.header(await Language.get('header-remove-installed-apps'))
        logger.info(await Language.get('header-remove-installed-apps', 'en'))

        value = await adb.getInstalledPacakges()

        for (let element of value.removeAppsList) {
            console.log(await Language.get('removing') + ' ' + element)
            logger.info(await Language.get('removing') + ' ' + element)
            const package = element.substring(8)
            await adb.removeApk(package)
        }
        console.log(chalk.green(await Language.get('remove-selected-user-apps')))
        logger.info(await Language.get('remove-selected-user-apps', 'en'))
        await common.pause(2000)
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

    mainMenu: async () => {
        common.header('Main Menu')
        const mainMenuSelection = await inquirer.mainMenu();
        switch (mainMenuSelection.mainMenu) {
            case '1-click karl0ss klean':
                module.exports.oneClick()
                break;
            case 'remove xiaomi apps':
                module.exports.removeXiaomiApps()
                break;
            case 'restore xiaomi apps':
                module.exports.restoreXiaomiApps()
                break;
            case 'install compatible apps':
                module.exports.installCompatibleApps()
                break;
            case 'restore any app':
                module.exports.restoreAnyApp()
                break;
            case 'batch install apks':
                module.exports.batchInstallApks()
                break;
            case 'batch remove installed apps':
                module.exports.batchRemoveInstalledApps()
                break;
            case 'connect to miwatch':
                module.exports.connectWatch()
                break;
            case 'quit':
                break;
            default:
            // code block
        }
    }
};