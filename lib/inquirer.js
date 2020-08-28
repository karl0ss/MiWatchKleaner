const inquirer = require("inquirer");
const files = require("./files");
const common = require("./common");

const Language = require("@shypes/language-translator");

Language._({
  default_lang: "en",
  ext: ".json",
  __basedir: "./",
  langFolder: 'lang'
})

module.exports = {
  mainMenu: async () => {
    const questions = [{
      type: "list",
      name: "mainMenu",
      message: await Language.get('main_menu_question'),
      choices: [
        await Language.get('main_menu_item_1'),
        await Language.get('main_menu_item_2'),
        await Language.get('main_menu_item_3'),
        await Language.get('main_menu_item_4'),
        await Language.get('main_menu_item_5'),
        await Language.get('main_menu_item_6'),
        await Language.get('main_menu_item_7'),
        await Language.get('main_menu_item_8'),
      ],
      filter: function (val) {
        return val.toLowerCase();
      },
    },];
    return inquirer.prompt(questions);
  },
  connectionType: async () => {
    const questions = [{
      type: "list",
      name: "connection",
      message: await Language.get('connection_type_message'),
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
    const questions = [{
      type: "input",
      name: "connectWifi",
      message: await Language.get('connect_wifi_message'),
    },];
    return inquirer.prompt(questions);
  },
  removeAppsList: async () => {
    const packages = await files.loadPackageList();

    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: await Language.get('restore_app_message'),
      choices: packages.apps,
    },];
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
      message: await Language.get('install_compatible_apps_message'),
      choices: appList,
    },];
    return inquirer.prompt(questions);
  },
  installedApps: async (installedApps) => {
    const questions = [{
      type: "checkbox",
      name: "removeAppsList",
      message: await Language.get('remove_installed_apps_message'),
      choices: installedApps,
    },];
    return inquirer.prompt(questions);
  },
  restoreAnyApp: async () => {
    const questions = [{
      type: "input",
      name: "restoreAnyApp",
      message: await Language.get('restore_any_app_message'),
    },];
    return inquirer.prompt(questions);
  },
};