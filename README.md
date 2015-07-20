JSON.sortify
=====
<!-- [![Test Coverage](https://codeclimate.com/github/ThomasR/JSON.sortify/badges/coverage.svg)](https://codeclimate.com/github/ThomasR/JSON.sortify) -->


A deterministic version of `JSON.stringify` that sorts object keys alphabetically.

Inspired by [http://stackoverflow.com/questions/8931967/is-there-a-deterministic-equivalent-of-json-stringify]()

## Install

```bash
$ npm install JSON.sortify
```

## Usage
```
require('json.sortify'); // will inject the JSON.sortify() function
```


`JSON.sortify` can be used exactly like `JSON.stringify`

```js
// basic:
JSON.sortify({a:1,b:2}); /*
{"a":1,"b":2}

sorting: */
JSON.sortify({b:1,a:2}); /*
{"a":2,"b":1}

indentation: */
JSON.sortify({b:1,a:2}, null, 2); /*
{
  "a": 2,
  "b": 1
}

key whitelist: */
JSON.sortify({b:1,foo:2,a:3}, ['a', 'foo'], 4); /*
{
    "a": 3,
    "foo": 2
}

replacer function: */
JSON.sortify({b:1,foo:'woot',a:3}, function (key, value) {
    return typeof value == 'string' ? value + '!!!' : value;
}, '\t'); /*
{
        "a": 3,
        "b": 1,
        "foo": "woot!!!"
}
*/
```

## License

  [Apache-2.0](LICENSE)
