const chalk = require('chalk');

const validateParams = (inputPath, outputPath) => {
  if(!inputPath)
    throw ('No input path specified as first param');
  if(!outputPath)
    throw ('No output path specified as second param');
}

const message = (text) =>
  console.log(chalk.green(text));

const error = (text) =>
  console.log(chalk.red(text));


module.exports = {
  validateParams: validateParams,
  message: message,
  error: error
}