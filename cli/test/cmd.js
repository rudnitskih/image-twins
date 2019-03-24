const concat = require('concat-stream');
const {spawn} = require('child_process');

// Description with details:
// https://medium.com/@zorrodg/integration-tests-on-node-js-cli-part-1-why-and-how-fa5b1ba552fe

function createProcess(processPath, args = []) {
  args = [processPath].concat(args);

  return spawn('node', args, {
    env: process.env
  });
}


function execute(processPath, args = [], opts = {}) {
  const {env = null} = opts;
  const childProcess = createProcess(processPath, args, env);

  childProcess.stdin.setEncoding('utf-8');

  return new Promise((resolve, reject) => {
    childProcess.stderr.once('data', err => {
      reject(err.toString());
    });
    childProcess.on('error', reject);
    childProcess.stdout.pipe(
      concat(result => {
        resolve(result.toString());
      })
    );
  });
}

module.exports = {execute};
