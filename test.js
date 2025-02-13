const Handlebars = require('handlebars');
const requireText = require('require-text');
const writeFile = require('write');
const watch = require('watch');
const open = require("open");
const path = require('path');

const contentRegex = /(<div class="container main">)[\s\S]*[\n\r][\s\S]*(<\/div>)/;
const outputPath = './src/test/SpecRunner.html';

const fixtureFinder = requireText('./src/index.html', require);

const template = Handlebars.compile(requireText('./src/test/SpecRunner.template.html', require));

const content = fixtureFinder.match(contentRegex)[0];

const result = template({content: content });


function generateTest(cb) {
  writeFile(outputPath, result, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Tests successfully created: ${outputPath}`);
    if (cb) {
      cb();
    }
  });
}

let testsOpened = false;

const openTestsInBrowserOnce = () => {
  if (!testsOpened) {
    open(`file://${path.resolve(outputPath)}`);
    testsOpened = true;
  }
};

watch.watchTree('./src', function (f) {
  if (outputPath.indexOf(f) === -1) {
    if(typeof f === 'string') {
      console.log(`File changed: ${f}.`);
    }
    generateTest(openTestsInBrowserOnce);
  }
});
