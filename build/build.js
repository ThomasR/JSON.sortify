'use strict';

const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

let factory = fs.readFileSync(path.join(baseDir, 'src', 'index.js'), 'utf-8');

let deps = JSON.parse(fs.readFileSync(path.join(baseDir, 'package.json'), 'utf-8')).devDependencies;
let plugins = Object.keys(deps).filter(x => /^babel-plugin-/.test(x)).map(x => x.replace('babel-plugin-', ''));

let babelOpts = {
    plugins,
    minified: true,
    shouldPrintComment: c => c[0] === '!'
};

let code = `
(function(factory) {
    if (typeof module !== 'undefined' && module.exports)
        module.exports = factory();
    else if (typeof define == "function" && typeof define.amd == "object")
        define("json.sortify", factory);
    else
        JSON.sortify = factory();
})(function() {
    ${factory.replace(/\bmodule\s*\.\s*exports\s*=/, 'return ')}
});`;

let transformed = babel.transform(code, babelOpts);

try {
    fs.mkdirSync(path.join(baseDir, 'dist'), parseInt('0775', 8));
} catch (ignore) {}
fs.writeFileSync(path.join(baseDir, 'dist', 'JSON.sortify.js'), transformed.code);
