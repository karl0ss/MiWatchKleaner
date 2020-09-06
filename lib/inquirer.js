const inquirer = require("inquirer");
const files = require("./files");
const common = require("./common");
const Language = require("@shypes/language-translator");
const globalVariables = require('../lib/globalVars');

module.exports = {
  mainMenu: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "list",
      name: "mainMenu",
      message: await Language.get('main-menu-question'),
      choices: [
        '-----------------------',
        await Language.get('main-menu-item-1'),
        await Language.get('main-menu-item-2'),
        await Language.get('main-menu-item-3'),
        await Language.get('main-menu-item-4'),
        await Language.get('main-menu-item-5'),
        await Language.get('main-menu-item-6'),
        await Language.get('main-menu-item-7'),
        await Language.get('main-menu-item-8'),
        await Language.get('main-menu-item-10'),
        await Language.get('main-menu-item-9'),
      ],
      filter: function (val) {
        return val.toLowerCase();
      },
    },];
    return inquirer.prompt(questions);
  },
  LanguageSelect: async () => {
    langList = files.getLanguageFiles()
    langList = langList.map(s => s.slice(5, -5));
    const questions = [{
      type: "list",
      name: "selection",
      message: await Language.get('Select Language'),
      choices: langList,
      filter: function (val) {
        return val.toLowerCase();
      },
    },];
    return inquirer.prompt(questions);
  },
  connectionType: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "list",
      name: "connection",
      message: await Language.get('connection-type-message'),
      choices: [
        "USB",
        "Wifi"
      ],
      filter: function (val) {
        return val.toLowerCase();
      },
    },];
    return inquirer.prompt(questions);
  },
  connectWifi: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "input",
      name: "connectWifi",
      message: await Language.get('connect-wifi-message'),
    },];
    return inquirer.prompt(questions);
  },
  setDPI: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "input",
      name: "setDPI",
      message: await Language.get('set-dpi-message'),
    },];
    return inquirer.prompt(questions);
  },
  removeAppsList: async () => {
    Language.setActiveLang(globalVariables.language)
    const packages = await files.loadPackageList();

    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: await Language.get('restore-app-message'),
      choices: packages.apps,
    },];
    return inquirer.prompt(questions);
  },
  compatibleApps: async () => {
    Language.setActiveLang(globalVariables.language)
    const compatibleApps = await common.getCompatibleAppsList()
    const appList = []
    for (let element of compatibleApps) {
      appList.push(element.name)
    }
    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: await Language.get('install-compatible-apps-message'),
      choices: appList,
    },];
    return inquirer.prompt(questions);
  },
  installedApps: async (installedApps) => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: await Language.get('remove-installed-apps-message'),
      choices: installedApps,
    },];
    return inquirer.prompt(questions);
  },
  restoreAnyApp: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "input",
      name: "restoreAnyApp",
      message: await Language.get('restore-any-app-message'),
    },];
    return inquirer.prompt(questions);
  },
  removeAnyApp: async () => {
    Language.setActiveLang(globalVariables.language)
    const questions = [{
      type: "input",
      name: "removeAnyApp",
      message: await Language.get('remove-any-app-message'),
    },];
    return inquirer.prompt(questions);
  },
};