const fs = require('fs');
const path = require('path');
const dl = require('download-file-with-progressbar');

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
      const packageList = JSON.parse(fs.readFileSync('./data/packageList.json', 'utf8'));
      return packageList
    } catch (err) {
      console.log(err)
    }
  },
  downloadFile: async (element) => {
    option = {
      dir: './data/apps',
      onDone: (info)=>{
          console.log(element.name + ' Downloaded')
      },
      onError: (err) => {
          console.log('error', err);
      },
      onProgress: (curr, total) => {
      },
  }
  
  var dd = dl(element.url, option);
  }
};