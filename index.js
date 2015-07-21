/*!
*    Copyright 2015 Thomas Rosenau
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

JSON.sortify = JSON.sortify || (function (jsonStringify) {

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
        */
        var sortKeys = function (o) {
        if (Object.prototype.toString.call(o) === '[object Object]') {
            // put numeric keys first
            var numeric = [];
            var nonNumeric = [];
            Object.keys(o).forEach(function (key) {
                if (/^(0|[1-9][0-9]*)$/.test(key)) {
                    numeric.push(+key);
                } else {
                    nonNumeric.push(key);
                }
            });
            // do the rearrangement
            return numeric.sort().concat(nonNumeric.sort()).reduce(function (result, key) {
                result[key] = sortKeys(o[key]); // recurse!
                return result;
            }, {});
        } else if (Array.isArray(o)) {
            return o.map(sortKeys);
        }
        return o;
    };

    return function (value, replacer, space) {
        // replacer, toJSON(), cyclic references and other stuff is better handled by native stringifier.
        // So we do JSON.stringify(sortKeys( JSON.parse(JSON.stringify()) )).
        // This approach is slightly slower but much safer than a manual stringification.
        var native = jsonStringify(value, replacer, 0);
        if (!native || native[0] !== '{' && native[0] !== '[') { // if value is not an Object or Array
            return native;
        }
        var cleanObj = JSON.parse(native);
        return jsonStringify(sortKeys(cleanObj), null, space);
    };
})(JSON.stringify.bind(JSON));
