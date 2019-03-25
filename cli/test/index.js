const chai = require('chai');
const fs = require('fs');
const cmd = require('./cmd');
const {EOL} = require('os');
const chaiFiles = require('chai-files');
const StaticServer = require('static-server');

const {expect} = chai;
const {file} = chaiFiles;
const PORT = 1337;
const diffFile = `./test/diff.png`;
const fitnessDir = './test/mocks/fitness';

chai.use(chaiFiles);

const server = new StaticServer({
  rootPath: `${fitnessDir}/markup`,
  port: PORT,
  cors: '*',
  followSymlink: true,
  debug: true,
});

beforeEach(function (done) {
  server.start(done);
});

afterEach(function (done) {
  server.stop();

  fs.unlink(diffFile, (err) => {
    if (err) throw err;
    done();
  });
});

describe('Image Twins CLI', () => {
  it('should process fitness markup and mockup', async function () {
    this.timeout(12000);

    const config = {
      url: `http://localhost:${PORT}`,
      originalImage: `${fitnessDir}/mockup.png`,
      saveDiffTo: diffFile
    };

    const response = await cmd.execute(
      `index.js`,

      Object.keys(config).reduce((args, key) => {
        args.push(`--${key}`);
        args.push(config[key]);

        return args;
      }, [])
    );

    const lines = response.trim().split(EOL);

    expect(file(diffFile)).to.equal(file(`${fitnessDir}/diff.png`));
    expect(lines[lines.length - 1]).to.include('32.60');
  });
});
