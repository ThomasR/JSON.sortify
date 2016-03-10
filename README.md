JSON.sortify
=====
[![npm version](https://img.shields.io/npm/v/json.sortify.svg)](https://www.npmjs.com/package/json.sortify)
[![Build Status](https://img.shields.io/travis/ThomasR/JSON.sortify.svg)](https://travis-ci.org/ThomasR/JSON.sortify)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/ThomasR/JSON.sortify.svg)](https://codeclimate.com/github/ThomasR/JSON.sortify/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/ThomasR/JSON.sortify.svg)](https://codeclimate.com/github/ThomasR/JSON.sortify/code)

A deterministic version of `JSON.stringify` that sorts object keys alphabetically.

Inspired by [http://stackoverflow.com/questions/8931967/is-there-a-deterministic-equivalent-of-json-stringify](http://stackoverflow.com/questions/8931967/is-there-a-deterministic-equivalent-of-json-stringify)


## Install as an NPM module

```bash
$ npm install json.sortify
```

### Usage

```JavaScript
let jsonSortify = require('json.sortify');
```

or

```JavaScript
JSON.sortify = require('json.sortify');
```

or even
```JavaScript
JSON.stringify = require('json.sortify');
```

JSON.sortify is fully compatible with JSON.stringify, so you can overwrite the native implementation without any problems.

## In HTML

Download [dist/JSON.sortify.js](JSON.sortify.js) and save it to your server.

```html
<script src="JSON.sortify.js"></script> <!-- will inject the JSON.sortify() function -->
```

`JSON.sortify` can be used exactly like `JSON.stringify`. As mentioned above, you can overwrite JSON.stringify if you want to:

```html
<script src="JSON.sortify"></script>
<script>JSON.stringify = JSON.sortify</script>
```

### AMD module

You can also use JSON.sortify as an AMD module:

```JavaScript
JSON.stringify = require('json.sortify');
```

## How to use

Use `JSON.sortify` exactly like `JSON.stringify`. Refer to [MDN:JSON/stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) for details.

### Basic

```JavaScript
JSON.sortify({a:1,b:2});
```
```Text
{"a":1,"b":2}
```


### Sorting

```JavaScript
JSON.sortify({b:1,a:2,c:3,5:4});
```
```Text
{"5":4,"a":2,"b":1,"c":3}
```


### Indentation:

```JavaScript
JSON.sortify({b:1,a:2}, null, 2);
```
```Text
{
  "a": 2,
  "b": 1
}
```


### Whitelisting of object keys:

```JavaScript
JSON.sortify({b:1,foo:2,a:3}, ['a', 'foo'], 4);
```
```Text
{
    "a": 3,
    "foo": 2
}
```


### Replacer Function:

```JavaScript
JSON.sortify({b:1,foo:'woot',a:3}, function (key, value) {
    return typeof value == 'string' ? value + '!!!' : value;
}, '\t');
```
```Text
{
        "a": 3,
        "b": 1,
        "foo": "woot!!!"
}
```


[![License: Apache 2.0](https://img.shields.io/github/license/ThomasR/JSON.sortify.svg)](LICENSE)
