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

JSON.sortify = JSON.sortify || (function (JsonStringify) {

    var sortKeys = function (o) {
        // {b:1,a:2} -> {a:2,b:1}
        if (Object.prototype.toString.call(o) === '[object Object]') {
            // make use of the fact that all JS engines sort an object's keys chronologically when stringifying
            return Object.keys(o).sort().reduce(function (result, key) {
                result[key] = sortKeys(o[key]);
                return result;
            }, {});
        } else if (Array.isArray(o)) {
            return o.map(sortKeys);
        }
        return o;
    };

    return function (value, replacer, space) {
        // replacer, toJSON(), cyclic references and other stuff is better handled by native stringifier
        var native = JsonStringify(value, replacer, 0);
        if (!native || native[0] !== '{' && native[0] !== '[') { // if value is not an Object or Array
            return native;
        }
        var cleanObj = JSON.parse(native);
        return JsonStringify(sortKeys(cleanObj), null, space);
    };
})(JSON.stringify.bind(JSON));


// JSON.stringify({a:undefined,b:function(){},x:1,c:2,d:5,z:'foo',' a':'a',d:[{f:{h:2,e:1}},null,'2']}, function (key,val) {return typeof val == 'string' ? val+'!!!' : val;}, 4)
