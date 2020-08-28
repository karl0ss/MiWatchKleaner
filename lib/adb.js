const gfin = require('get-files-in')
const logger = require('perfect-logger');
const shellExec = require('shell-exec')
const Language = require("@shypes/language-translator");
const inquirer = require('../lib/inquirer');
const common = require('./common')
const chalk = require('chalk');
const globalVariables = require('../lib/globalVars');
const { removeAppsList } = require('../lib/inquirer');

if (process.platform === 'win32' || process.platform === 'win64') {
  adbRun = 'adb'
} else {
  adbRun = './adb'
}

module.exports = {
  installApk: async (element) => {
    result = await shellExec(adbRun + ' install -r ' + element).then(async function (result) {
      if (result.stderr != '') {
        logger.info(await Language.get('device_not_authorised'));
        console.log(chalk.redBright(await Language.get('device_not_authorised')));
      }
      console.log(element + ' - ' + result.stdout);
      logger.info(element + ' - ' + result.stdout);

      if (element === "data\\apps\\simpleweather_base.apk") {
        await common.downloadFile('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.armeabi_v7a.apk', './data/apps/simpleweather_split_config.armeabi_v7a.apk')
        await common.downloadFile('http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/Others/simpleweather_split_config.xhdpi.apk', './data/apps/simpleweather_split_config.xhdpi.apk')
        await shellExec(adbRun + ' install-multiple "data\\apps\\simpleweather_base.apk" "data\\apps\\simpleweather_split_config.armeabi_v7a.apk" "data\\apps\\simpleweather_split_config.xhdpi.apk"').then(async function (result) {
          console.log(result)
          console.log(await Language.get('simple_weather_activated_on_watch'));
          logger.info(await Language.get('simple_weather_activated_on_watch'));
        })
      }
      if (element === "data\\apps\\MoreLocale.apk") {
        await shellExec(adbRun + ' shell pm grant jp.co.c_lis.ccl.morelocale android.permission.CHANGE_CONFIGURATION').then(async function (result) {
          console.log(await Language.get('morelocale_activated_on_watch'));
          logger.info(await Language.get('morelocale_activated_on_watch'));
        })
      }
      if (element === "data\\apps\\com.alberto.locale.apk") {
        await shellExec(adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION && ' + adbRun + ' shell am start -n com.alberto.locale/com.alberto.locale.MainActivity && ' + adbRun + ' shell pm grant com.alberto.locale android.permission.CHANGE_CONFIGURATION').then(async function (result) {
          console.log(result)
          console.log(await Language.get('alberto_locale_activated_on_watch'));
          logger.info(await Language.get('alberto_locale_activated_on_watch'));
        });
      }
    });
  },
  removeApk: async (package) => {
    result = await shellExec(adbRun + ' uninstall ' + package)
    if (result.stderr != '') {
      logger.info('Error ' + result.stderr);
      console.log(chalk.redBright('Error - Device not authorised'));
    } else {
      logger.info('Removing ' + package + ' - ' + result.stdout);
      console.log('Removing ' + package + ' - ' + result.stdout);
    }
  },
  removeXiaomiApk: async (package) => {
    result = await shellExec(adbRun + ' shell pm uninstall -k --user 0 ' + package)
    if (result.stderr != '') {
      logger.info('Error ' + result.stderr);
      console.log(chalk.redBright('Error - Device not authorised'));
    } else {
      logger.info('Removing ' + package + ' - ' + result.stdout);
      console.log('Removing ' + package + ' - ' + result.stdout);
    }
  },
  restoreXiaomiApk: async (package) => {
    result = await shellExec(adbRun + ' shell cmd package install-existing ' + package)
    if (result.stderr != '') {
      logger.info('Error ' + result.stderr);
      console.log(chalk.redBright('Error - Device not authorised'));
    } else {
      logger.info('Removing ' + package + ' - ' + result.stdout);
      console.log('Removing ' + package + ' - ' + result.stdout);
    }
  },
  restoreAnyApk: async (package) => {
    result = await shellExec(adbRun + ' shell cmd package install-existing ' + package.restoreAnyApp)
    if (result.stderr != '') {
      logger.info('Error ' + result.stderr);
      console.log(chalk.redBright('Error - Device not authorised'));
    } else if (result.stdout.includes('doesn\'t exist')) {
      logger.info(result.stdout);
      console.log(chalk.redBright(result.stdout));
    } else {
      logger.info('Restoring ' + package.restoreAnyApp + ' - ' + result.stdout);
      console.log('Restoring ' + package.restoreAnyApp + ' - ' + result.stdout);
    }
  },
  getInstalledPacakges: async () => {
    result = await shellExec(adbRun + ' shell pm list packages -3')
    logger.info(await Language.get('packages_recieved_from_watch'))
    if (result.stderr.includes('error')) {
      logger.info(result.stderr)
      console.log(chalk.red(await Language.get('device_not_authorised')))
      common.pause(3000)
      await shellExec(adbRun + ' kill-server').then(async function (result) {
        logger.info(await Language.get('restarting_adb'))
        logger.info(result.stdout)
        console.log(await Language.get('please_reconnect_to_watch'))
        common.pause(3000)
        logger.info(await Language.get('remove_installed_apps_failed'))
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
    let result = await shellExec(adbRun + ' kill-server')
    logger.info('Restarting ADB')
    logger.info(result.stdout)
  },
  watchConnection: async (value) => {
    if (value.connection === "usb") {
      await module.exports.killAdbServer()
      result = await shellExec(adbRun + ' devices')
      console.log(result.stdout)
      if (result.stdout.includes('device', 15)) {
        console.log(chalk.green('MiWatch Connected via USB'))
        await common.pause(3000)
        logger.info("MiWatch connected")
        globalVariables.localUSB = "X"
        return true
      } else {
        console.log(chalk.red('MiWatch not found'))
        logger.info("MiWatch not found")
        await common.pause(2000)
        console.log(chalk.white('Try Again'))
        await common.pause(1000)
        return false
      }
    }
    if (value.connection === "wifi") {
      const value = await inquirer.connectWifi();
      await module.exports.killAdbServer()
      result = await shellExec(adbRun + ' connect ' + value.connectWifi)
      logger.info("Connect Wifi Result " + result.stdout)
      if (result.stdout.includes('already connected') || result.stdout.includes('connected to ')) {
        console.log(chalk.green('MiWatch Connected'))
        globalVariables.localUSB = ""
        globalVariables.miWatchIpaddress = value.connectWifi
        await common.pause(3000)
        logger.info("Connect Wifi Complete")
        return true
      } else {
        if (result.stdout.includes('failed to authenticate')) {
          console.log(chalk.redBright('MiWatch not authenticated'))
          logger.info('MiWatch not authenticated')
          return false
        } else {
          console.log(chalk.red(result.stdout))
          logger.info(result.stdout)
        }
        await common.pause(2000)
        console.log(chalk.white('Try Again'))
        await common.pause(1000)
        return false
      }
    }
  }
};