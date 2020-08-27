const inquirer = require("inquirer");
const files = require("./files");
const common = require("./common");

// let compatibleApps

module.exports = {
  mainMenu: () => {
    const questions = [{
      type: "list",
      name: "mainMenu",
      message: "What do you want to do?",
      choices: [
        // "Connect to MiWatch",
        "1-Click Karl0ss Klean",
        "Remove Xiaomi Apps",
        "Restore Xiaomi Apps",
        "Install Compatible Apps",
        "Remove Installed Apps",
        "Restore ANY app",
        "Quit"
      ],
      filter: function (val) {
        return val.toLowerCase();
      },
    }, ];
    return inquirer.prompt(questions);
  },
  connectionType: () => {
    const questions = [{
      type: "list",
      name: "connection",
      message: "How do you want to connect?",
      choices: [
        "USB",
        "Wifi"
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
    const compatibleApps = await common.getCompatibleAppsList()
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
      message: "What Installed apps do you want to remove?",
      choices: installedApps,
    }, ];
    return inquirer.prompt(questions);
  },
  restoreAnyApp: async () => {
    const questions = [{
      type: "input",
      name: "restoreAnyApp",
      message: "What App do you want to restore?",
    }, ];
    return inquirer.prompt(questions);
  },
};