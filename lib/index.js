/*!
*    Copyright 2015-2016 Thomas Rosenau
*
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*        http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/
'use strict';

// detector for (decimal) numeric strings
const numericRE = /^(0|[1-9][0-9]*)$/;

/**
* Create a “sorted” version of an object.
*
* JS engines internally keep track of an object's keys in the order of
* creation time, i.e. {a:1,b:2} is treated differently from {b:2,a:1}.
* That difference can be seen when JSON.stringify is called on that object.
* This function normalizes any kind of object by rearranging the keys in
* alphabetical order (numerical keys first, since v8 does so, and there's
* nothing we can do about it).
* @param {*} o The object to be sorted
* @param {Function?} customOrder (optional) A sorting function that should be used instead of the default order
*/
const sortKeys = (o, customOrder) => {
    if (Array.isArray(o)) {
        return o.map(x => sortKeys(x, customOrder));
    } else if (o instanceof Object) {
        // put numeric keys first
        let numeric = [];
        let nonNumeric = [];
        Object.keys(o).forEach(key => {
            if (numericRE.test(key)) {
                numeric.push(+key);
            } else {
                nonNumeric.push(key);
            }
        });
        // do the rearrangement
        return numeric.sort(function (a, b) {
            return a - b;
        }).concat(nonNumeric.sort(customOrder)).reduce((result, key) => {
            result[key] = sortKeys(o[key], customOrder); // recurse!
            return result;
        }, {});
    }
    return o;
};

const jsonStringify = JSON.stringify.bind(JSON); // this allows redefinition like JSON.stringify = require('json.sortify')

/**
* Helper that creates a comparison function from a given list. This function need not handle numeric keys, only non-numeric strings
* @param {Array} keyList The keys that should be respected in the given order
* @return {Function} The comparison function
*/
const orderFromArray = keyList => function (a, b) {
    // one of the items is contained in the list
    let indexA = keyList.indexOf(a);
    let indexB = keyList.indexOf(b);

    if (indexA != -1) {
        if (indexB != -1) {
            return indexA - indexB;
        }
        return -1;
    }
    if (indexB != -1) {
        return 1;
    }
    // Both items not in the list. Fall-back to normal sorting
    return a < b ? -1 : 1; // a == b cannot happen, since we're dealing with object keys
};

const sortify = function (value, replacer, space /*, customOrder */) {
    // replacer, toJSON(), cyclic references and other stuff is better handled by native stringifier.
    // So we do JSON.stringify(sortKeys( JSON.parse(JSON.stringify(…)) )).
    // This approach is slightly slower but much safer than a manual stringification.
    let nativeJson = jsonStringify(value, replacer, 0);
    if (!nativeJson || nativeJson[0] !== '{' && nativeJson[0] !== '[') { // if value is not an Object or Array
        return nativeJson;
    }
    let cleanObj = JSON.parse(nativeJson);
    let customOrder = arguments[3]; // we do this because JSON.sortify.length should equal 3 for maximal compatibility with JSON.stringify
    if (Array.isArray(customOrder)) {
        customOrder.forEach(entry => {
            if (numericRE.test(entry)) {
                throw new TypeError('Custom order must not contain numeric keys');
            }
        });
        customOrder = orderFromArray(customOrder);
    } else if (typeof customOrder != 'function') {
        customOrder = undefined;
    }
    return jsonStringify(sortKeys(cleanObj, customOrder), null, space);
};

module.exports = sortify;
