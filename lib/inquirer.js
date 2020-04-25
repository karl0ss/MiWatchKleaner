const inquirer = require("inquirer");
const files = require("./files");
const fs = require('fs')

module.exports = {
  mainMenu: () => {
    const questions = [
      {
        type: "list",
        name: "mainMenu",
        message: "What do you want to do?",
        choices: [
          "Connect to MiWatch via Wifi",
          "Remove Xiaomi Apps",
          "Restore Xiaomi Apps",
          "Install Compatible Apps",
          "Quit"
        ],
        filter: function (val) {
          return val.toLowerCase();
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  connectWifi: () => {
    const questions = [
      {
        type: "input",
        name: "connectWifi",
        message: "What is your MiWatch IpAdress?",
      },
    ];
    return inquirer.prompt(questions);
  },
  removeAppsList: async () => {
    const packages = await files.loadPackageList();

    const questions = [
      {
        type: "checkbox",
        name: "removeAppsList",
        message: "What apps do you want to remove?",
        choices: packages.apps,
      },
    ];
    return inquirer.prompt(questions);
  },
  compatibleApps: async () => {
    const compatibleApps = JSON.parse(fs.readFileSync('./data/compatibleApps.json', 'utf8'));
    const appList = []
    for (let element of compatibleApps) {
        appList.push(element.name)
  }
    const questions = [
      {
        type: "checkbox",
        name: "removeAppsList",
        message: "What apps do you want to remove?",
        choices: appList,
      },
    ];
    return inquirer.prompt(questions);
  },
};
