const path = require("path");

module.exports = {
  localePath: path.resolve("./public/locales"),
  i18n: {
    defaultLocale: 'default',
    locales: ['default', 'en', 'fr', 'nl'],
    localeDetection: false,
  },
}
