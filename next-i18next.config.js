const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: 'default',
    locales: ['default', 'en', 'fr', 'nl'],
    localeDetection: false,
  },
  localePath: path.resolve("./public/locales"),
  trailingSlash: true,
}
