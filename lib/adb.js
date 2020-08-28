const gfin = require('get-files-in')
const logger = require('perfect-logger');
const shellExec = require('shell-exec')
const Language = require("@shypes/language-translator");
const inquirer = require('../lib/inquirer');
const common = require('./common')


if (process.platform === 'win32' || process.platform === 'win64') {
  adbRun = 'adb'
} else {
  adbRun = './adb'
}

module.exports = {
  getListOfAPk: () => {
    const result = gfin('./data/apps', matchFiletypes = ["apk"], checkSubDirectories = false)
    return result
  },
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
    console.log(package + ' - ' + result.stdout);
    logger.info(package + ' - ' + result.stdout);
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
};