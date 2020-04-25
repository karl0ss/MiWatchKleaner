const fs = require('fs');
const path = require('path');
// const dl = require('download-file-with-progressbar');
const {
  DownloaderHelper
} = require('node-downloader-helper');


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
  downloadFile: (element) => {
    //     option = {
    //       dir: './data/apps',
    //       onDone: (info) => {
    //         console.log('Latest ' + element.name + ' Downloaded')
    //       },
    //       onError: (err) => {
    //         console.log('error', err);
    //       },
    //       onProgress: (curr, total) => {},
    //     }
    //     dl(element.url, option);
    // }
    // const options = {
    //   override: true,
    // }
    // const dl = new DownloaderHelper(element.url, './data/apps', options);

    // dl.on('end', () => console.log('Download Completed'))

    // dl.start();
    var promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('hello world');
      }, 2000);
    });

    promise.then(function (data) {
      console.log(data);
    });

  },
}