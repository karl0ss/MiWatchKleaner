const fs = require('fs');
const path = require('path');
const tiny = require("@peterpanhihi/tiny");
const getFilesIn = require('get-files-in')
const globalVariables = require('../lib/globalVars');
const Language = require("@shypes/language-translator");

Language.setActiveLang(globalVariables.language)


module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },
  writeIpAddress: (value) => {
    const data = {
      ipAddress: value
    }
    try {
      fs.writeFileSync('./data/options.json', JSON.stringify(data))
    } catch (err) {
      console.log(err)
    }
  },
  loadPackageList: () => {
    try {
      const packageList = JSON.parse(fs.readFileSync('./data/xiaomiPackageRemovalList.json', 'utf8'));
      return packageList
    } catch (err) {
      console.log(err)
    }
  },
  renameLocalApk: async (apkList) => {
    return new Promise(function (resolve, reject) {
      for (let e of apkList) {
        a = tiny(e)
        fs.rename(e, a, function (err) {
          if (err) console.log('ERROR: ' + err);
        });
      }
      resolve(x / y);
    }).catch(err => NaN)
  },
  getListOfAPk: (path) => {
    const result = getFilesIn(path, matchFiletypes = ["apk"], checkSubDirectories = false)
    return result
  },
  getLanguageFiles: () => {
    const result = getFilesIn('./lang/', matchFiletypes = ["json"], checkSubDirectories = false)
    return result
  },
}