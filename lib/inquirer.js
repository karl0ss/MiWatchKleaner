const inquirer = require("inquirer");
const files = require("./files");
const rp = require('request-promise-native')
let logger = require('perfect-logger');

let compatibleApps

module.exports = {
  mainMenu: () => {
    const questions = [{
      type: "list",
      name: "mainMenu",
      message: "What do you want to do?",
      choices: [
        "Connect to MiWatch via Wifi",
        "1-Click Karl0ss Klean",
        "Remove Xiaomi Apps",
        "Restore Xiaomi Apps",
        "Install Compatible Apps",
        "Remove Installed Apps",
        "Quit"
      ],
      filter: function (val) {
        return val.toLowerCase();
      },
    }, ];
    return inquirer.prompt(questions);
  },
  connectWifi: () => {
    const questions = [{
      type: "input",
      name: "connectWifi",
      message: "What is your MiWatch IpAdress?",
    }, ];
    return inquirer.prompt(questions);
  },
  removeAppsList: async () => {
    const packages = await files.loadPackageList();

    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: "What apps do you want to restore?",
      choices: packages.apps,
    }, ];
    return inquirer.prompt(questions);
  },
  compatibleApps: async () => {
    await module.exports.getCompatibleApps()
    const appList = []
    for (let element of compatibleApps) {
      appList.push(element.name)
    }
    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: "What apps do you want to Install?",
      choices: appList,
    }, ];
    return inquirer.prompt(questions);
  },
  installedApps: async (installedApps) => {
    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: "What Installed apps do you want to install?",
      choices: installedApps,
    }, ];
    return inquirer.prompt(questions);
  },
  getCompatibleApps: async () => {
    var options = {
      method: 'GET',
      uri: 'http://kithub.cf/Karl/MiWatchKleaner-APKs/raw/master/compatibleApps.json',
  };
  
  await rp(options)
      .then(function (response) {
          compatibleApps = JSON.parse(response)
          logger.info("Got compatilbe list")
      })
      .catch(function (err) {
        console.log('compatibleApps.json Not Found')
      });
    }
};