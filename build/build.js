'use strict';

const babel = require('babel-core');
const fs = require('fs');

const baseDir = `${__dirname}/..`;

let factory = fs.readFileSync(`${baseDir}/lib/index.js`, 'utf-8');

let babelOpts = JSON.parse(fs.readFileSync(`${baseDir}/package.json`, 'utf-8')).babel;
Object.assign(babelOpts, {
    compact: true,
    shouldPrintComment: c => c[0] === '!'
});

let code = `
(function(name, factory) {
    if (typeof module != 'undefined')
        module.exports = factory();
    else if (typeof define == 'function' && typeof define.amd == 'object')
        define('json.sortify', factory);
    else
        JSON.sortify = factory();
})(this, function() {
    ${factory.replace(/\bmodule\s*\.\s*exports\s*=/, 'return ')}
});`;

let transformed = babel.transform(code, babelOpts);

try {
    fs.mkdirSync(`${baseDir}/dist`, parseInt('0775', 8));
} catch (ignore) {}
fs.writeFileSync(`${baseDir}/dist/JSON.sortify.js`, transformed.code);
