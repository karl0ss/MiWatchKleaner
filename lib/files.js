const fs = require('fs');
const path = require('path');

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
      fs.writeFileSync('./data/MiWatch.json', JSON.stringify(data))
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
}