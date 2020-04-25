const gfin = require('get-files-in')
const shellExec = require('shell-exec')

module.exports = {
  getListOfAPk: () => {
   this.apkListToInstall = gfin('./data/apps', matchFiletypes = ["apk"], checkSubDirectories = false)
  },
  installApk: async () => {
    await module.exports.getListOfAPk()
    for (let element of this.apkListToInstall) {
      await shellExec('adb install -r ' + element).then(function (result) {
        console.log('Installing ' + element + ' - ' + result.stdout);
      });
    }
    // console.log(chalk.green('Removal Complete'))
  },

};