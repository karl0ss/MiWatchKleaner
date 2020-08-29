const pages = require('./pages/pages')
const Language = require("@shypes/language-translator");
const globalVariables = require('./lib/globalVars');

async function main() {
    lang = await pages.selectLanguage();
    globalVariables.language = lang.selection
    await pages.connectWatch()
}

main()



