const gfin = require('get-files-in')
const logger = require('perfect-logger');
const shellExec = require('shell-exec')
const Language = require("@shypes/language-translator");
const inquirer = require('../lib/inquirer');
const common = require('./common')
const chalk = require('chalk');
const globalVariables = require('../lib/globalVars');
const extractNumber = require('extract-numbers')

if (process.platform === 'win32' || process.platform === 'win64') {
  adbRun = 'adb'
} else {
  adbRun = './adb'
}

module.exports = {
  installApk: async (element) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' install -r ' + element).then(async function (result) {
      if (result.stderr != '') {
        common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
      }
      common.dualLog(element + ' - ' + result.stdout)

      if (element === "data\\apps\\simpleweather_base.apk") {
        await common.downloadFile('https://github.com/karl0ss/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.armeabi_v7a.apk', './data/apps/simpleweather_split_config.armeabi_v7a.apk')
        await common.downloadFile('https://github.com/karl0ss/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.xhdpi.apk', './data/apps/simpleweather_split_config.xhdpi.apk')
        await shellExec(adbRun + ' install-multiple "data\\apps\\simpleweather_base.apk" "data\\apps\\simpleweather_split_config.armeabi_v7a.apk" "data\\apps\\simpleweather_split_config.xhdpi.apk"').then(async function (result) {
          common.log(result)
          common.dualLog('simple-weather-activated-on-watch')
        })
      }
      if (element === "data\\apps\\MoreLocale.apk") {
        await shellExec(adbRun + ' shell pm grant jp.co.c_lis.ccl.morelocale android.permission.CHANGE_CONFIGURATION').then(async function (result) {
          common.log(result)
          common.dualLog('morelocale-activated-on-watch')
        })
      }
      if (element === "data\\apps\\AlbertoLocale.apk") {
        await shellExec(adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION && ' + adbRun + ' shell am start -n com.alberto.locale/com.alberto.locale.MainActivity && ' + adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION').then(async function (result) {
          common.log(result)
          common.dualLog('alberto-locale-activated-on-watch')
        });
      }
    });
  },
  removeApk: async (package) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' uninstall ' + package)
    if (result.stderr != '') {
      common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
    } else {
      common.dualLog(await Language.get('removing') + ' ' + package + ' - ' + result.stdout)
    }
  },
  removeXiaomiApk: async (package) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' shell pm uninstall -k --user 0 ' + package)
    if (result.stderr != '') {
      common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
    } else {
      common.dualLog(await Language.get('removing') + ' ' + package + ' - ' + result.stdout)
    }
  },
  restoreXiaomiApk: async (package) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' shell cmd package install-existing ' + package)
    if (result.stderr != '') {
      common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
    } else {
      common.dualLog(await Language.get('removing') + ' ' + package + ' - ' + result.stdout)
    }
  },
  restoreAnyApk: async (package) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' shell cmd package install-existing ' + package.removeAnyApp)
    if (result.stderr != '') {
      common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
    } else if (result.stdout.includes('doesn\'t exist')) {
      logger.info(result.stdout);
      console.log(chalk.redBright(result.stdout));
    } else {
      common.dualLog(await Language.get('restoring') + ' ' + package + ' - ' + result.stdout)
    }
  },
  removeAnyApk: async (package) => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' shell pm uninstall -k --user 0 ' + package.removeAnyApp)
    if (result.stderr != '') {
      common.dualLog('device-not-authorised' + ' ' + result.stderr, 'red')
    } else if (result.stdout.includes('doesn\'t exist')) {
      logger.info(result.stdout);
      console.log(chalk.redBright(result.stdout));
    } else {
      common.dualLog(await Language.get('removing') + ' ' + package + ' - ' + result.stdout)
    }
  },
  getInstalledPacakges: async () => {
    Language.setActiveLang(globalVariables.language)
    result = await shellExec(adbRun + ' shell pm list packages -3')
    logger.info(await Language.get('packages-recieved-from-watch'))
    if (result.stderr.includes('error')) {
      logger.info(result.stderr)
      console.log(chalk.red(await Language.get('device-not-authorised')))
      common.pause(3000)
      await shellExec(adbRun + ' kill-server').then(async function (result) {
        logger.info(await Language.get('restarting-adb'))
        logger.info(result.stdout)
        console.log(await Language.get('please-reconnect-to-watch'))
        common.pause(3000)
        logger.info(await Language.get('remove-installed-apps-failed'))
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
      return value
    }
  },
  killAdbServer: async () => {
    Language.setActiveLang(globalVariables.language)
    let result = await shellExec(adbRun + ' kill-server')
    // common.log('')
    // common.dualLog('restarting-adb' + ' ' + result.stderr, 'red')
  },
  getCurrentDPI: async () => {
    Language.setActiveLang(globalVariables.language)
    let result = await shellExec(adbRun + ' shell wm density')
    if (result.stdout != "") {
      currentDPI = extractNumber(result.stdout)
      if (currentDPI.length > 1) {
        return currentDPI[1]
      } else {
        return currentDPI[0]
      }
    } else {
      return result.stderr
    }

  },
  setDPI: async (setDPI) => {
    Language.setActiveLang(globalVariables.language)
    let result = await shellExec(adbRun + ' shell wm density ' + setDPI)
    // currentDPI = extractNumber(result.stdout)
    // return currentDPI[0]
  },
  watchConnection: async (value) => {
    Language.setActiveLang(globalVariables.language)
    if (value.connection === "usb") {
      common.dualLog(await Language.get('usb-one-device', 'whiteBright'))
      await common.pause(2000)
      common.dualLog(await Language.get('accept-authorisation', 'whiteBright'))
      common.dualLog(await Language.get('--------------------', 'whiteBright'))
      await common.pause(3000)
      await module.exports.killAdbServer()
      result = await shellExec(adbRun + ' devices')
      console.log(result.stdout)
      if (result.stdout.includes('device', 15)) {
        common.dualLog(await Language.get('connected-via-usb', 'green'))
        await common.pause(3000)
        globalVariables.localUSB = "X"
        return true
      } else {
        common.dualLog(await Language.get('not-found', 'red'))
        await common.pause(2000)
        common.dualLog(await Language.get('try-again', 'white'))
        await common.pause(1000)
        return false
      }
    }
    if (value.connection === "wifi") {
      common.dualLog(await Language.get('usb-not-connected', 'whiteBright'))
      await common.pause(2000)
      const value = await inquirer.connectWifi();
      common.dualLog(await Language.get('accept-authorisation', 'whiteBright'))
      common.dualLog(await Language.get('--------------------', 'whiteBright'))
      await common.pause(3000)
      await module.exports.killAdbServer()
      result = await shellExec(adbRun + ' connect ' + value.connectWifi)
      logger.info("Connect Wifi Result " + result.stdout)
      if (result.stdout.includes('already connected') || result.stdout.includes('connected to ')) {
        common.dualLog(await Language.get('connected', 'green'))
        globalVariables.localUSB = ""
        globalVariables.miWatchIpaddress = value.connectWifi
        await common.pause(3000)
        common.dualLog(await Language.get('connect-wifi-complete', 'green'))
        return true
      } else {
        if (result.stdout.includes('failed to authenticate')) {
          common.dualLog(await Language.get('not-authenticated', 'red'))
          return false
        } else {
          common.dualLog(result.stdout, 'red')
        }
        await common.pause(2000)
        common.dualLog('try-again', '')
        await common.pause(1000)
        return false
      }
    }
  }
};