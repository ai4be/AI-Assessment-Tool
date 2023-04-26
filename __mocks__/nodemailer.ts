/**
 * Jest Mock
 * ./__mocks__/nodemailer.js
 **/
// load the real nodemailer
const nodemailer = require('nodemailer') // eslint-disable-line @typescript-eslint/no-var-requires
// pass it in when creating the mock using getMockFor()
const nodemailermock = require('nodemailer-mock').getMockFor(nodemailer) // eslint-disable-line @typescript-eslint/no-var-requires
// export the mocked module
module.exports = nodemailermock
