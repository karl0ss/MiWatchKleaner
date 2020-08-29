const chalk = require('chalk');
const common = require('../lib/common');
const inquirer = require('../lib/inquirer');
const files = require('../lib/files')
const logger = require('perfect-logger');
const Language = require("@shypes/language-translator");
const globalVariables = require('../lib/globalVars');
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
        common.header('main-menu-item-2')
        common.log('main-menu-item-2')
        const value = await inquirer.removeAppsList();
        for (let package of value.removeAppsList) {
            await adb.removeXiaomiApk(package)
        }
        common.dualLog('removal-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    restoreXiaomiApps: async () => {
        common.header('main-menu-item-3')
        common.log('main-menu-item-3')
        const value = await inquirer.removeAppsList();
        for (let package of value.removeAppsList) {
            await adb.restoreXiaomiApk(package)
        }
        common.dualLog('restoring-apps-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    installCompatibleApps: async () => {
        common.header('main-menu-item-4')
        common.log('main-menu-item-4')
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
            common.dualLog('installing', 'whiteBright')
            await adb.installApk(package)
        }
        common.dualLog('compatible-apps-installed', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    restoreAnyApp: async () => {
        common.header('main-menu-item-5')
        common.log('main-menu-item-5')
        const value = await inquirer.restoreAnyApp();
        await adb.restoreAnyApk(value)
        common.dualLog('restoring-apps-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    removeAnyApp: async () => {
        common.header('main-menu-item-6')
        common.log('main-menu-item-6')
        const value = await inquirer.removeAnyApp();
        await adb.restoreAnyApk(value)
        common.dualLog('removing-apps-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    batchInstallApps: async () => {
        common.header('main-menu-item-7')
        common.log('main-menu-item-7')

        let apkList = await files.getListOfAPk('./my-apk/')
        await files.renameLocalApk(apkList)
        apkList = await files.getListOfAPk('./my-apk/')

        for (let element of apkList) {
            console.log(await Language.get('installing') + ' ' + element)
            logger.info(await Language.get('installing') + ' ' + element)
            await adb.installApk(element)
        }
        common.dualLog('batch-install-apps-complete', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    batchRemoveInstalledApps: async () => {
        common.header('main-menu-item-8')
        common.log('main-menu-item-8')

        value = await adb.getInstalledPacakges()

        for (let element of value.removeAppsList) {
            console.log(await Language.get('removing') + ' ' + element)
            logger.info(await Language.get('removing') + ' ' + element)
            const package = element.substring(8)
            await adb.removeApk(package)
        }
        common.dualLog('remove-selected-user-apps', 'green')
        await common.pause(2000)
        module.exports.mainMenu()
    },

    connectWatch: async () => {
        common.header('connect-to-watch')
        common.log('connect-to-watch')
        const value = await inquirer.connectionType()
        connected = await adb.watchConnection(value)
        if (connected != true) {
            module.exports.connectWatch()
        } else {
            module.exports.mainMenu()
        }
    },

    selectLanguage: async () => {
        common.header('Select Language')
        common.log('Select Language')
        const v = await inquirer.LanguageSelect()
        globalVariables.language = v.selection
        module.exports.connectWatch()
    },

    mainMenu: async () => {
        common.header('Main Menu')
        const mainMenuSelection = await inquirer.mainMenu();
        menu_1 = await Language.get('main-menu-item-1')
        menu_2 = await Language.get('main-menu-item-2')
        menu_3 = await Language.get('main-menu-item-3')
        menu_4 = await Language.get('main-menu-item-4')
        menu_5 = await Language.get('main-menu-item-5')
        menu_6 = await Language.get('main-menu-item-6')
        menu_7 = await Language.get('main-menu-item-7')
        menu_8 = await Language.get('main-menu-item-8')
        menu_9 = await Language.get('main-menu-item-9')

        switch (mainMenuSelection.mainMenu) {
            case menu_1.toLowerCase():
                module.exports.oneClick()
                break;
            case menu_2.toLowerCase():
                module.exports.removeXiaomiApps()
                break;
            case menu_3.toLowerCase():
                module.exports.restoreXiaomiApps()
                break;
            case menu_4.toLowerCase():
                module.exports.installCompatibleApps()
                break;
            case menu_5.toLowerCase():
                module.exports.restoreAnyApp()
                break;
            case menu_6.toLowerCase():
                module.exports.removeAnyApp()
                break;
            case menu_7.toLowerCase():
                module.exports.batchInstallApps()
                break;
            case menu_8.toLowerCase():
                module.exports.batchRemoveInstalledApps()
                break;
            case menu_9.toLowerCase():
                break;
            default:
            // code block
        }
    }
};