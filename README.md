JSON.sortify
=====
[![npm version](https://badge.fury.io/js/json.sortify.svg)](http://badge.fury.io/js/json.sortify)
[![Build Status](https://travis-ci.org/ThomasR/JSON.sortify.svg?branch=master)](https://travis-ci.org/ThomasR/JSON.sortify)
[![Test Coverage](https://codeclimate.com/github/ThomasR/JSON.sortify/badges/coverage.svg)](https://codeclimate.com/github/ThomasR/JSON.sortify)
[![Code Climate](https://codeclimate.com/github/ThomasR/JSON.sortify/badges/gpa.svg)](https://codeclimate.com/github/ThomasR/JSON.sortify)

A deterministic version of `JSON.stringify` that sorts object keys alphabetically.

Inspired by [http://stackoverflow.com/questions/8931967/is-there-a-deterministic-equivalent-of-json-stringify](http://stackoverflow.com/questions/8931967/is-there-a-deterministic-equivalent-of-json-stringify)


## Install

```bash
$ npm install json.sortify
```


## Usage

```JavaScript
require('json.sortify'); // will inject the JSON.sortify() function
```

`JSON.sortify` can be used exactly like `JSON.stringify`


### Basic

```JavaScript
JSON.sortify({a:1,b:2});
```
```Text
{"a":1,"b":2}
```


### Sorting

```JavaScript
JSON.sortify({b:1,a:2});
```
```Text
{"a":2,"b":1}
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


### Key Whitelist:

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


## License

[Apache-2.0](LICENSE)
