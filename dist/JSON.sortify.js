"use strict";(function(factory){if(typeof define=="function"&&typeof define.amd=="object")define("json.sortify",factory);else JSON.sortify=factory()})(function(){/*!
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
*/"use strict";var numericRE=/^(0|[1-9][0-9]*)$/;var sortKeys=function sortKeys(o,customOrder){if(Array.isArray(o)){return o.map(function(x){return sortKeys(x,customOrder)})}else if(o instanceof Object){var _ret=function(){var numeric=[];var nonNumeric=[];Object.keys(o).forEach(function(key){if(numericRE.test(key)){numeric.push(+key)}else{nonNumeric.push(key)}});return{v:numeric.sort(function(a,b){return a-b}).concat(nonNumeric.sort(customOrder)).reduce(function(result,key){result[key]=sortKeys(o[key],customOrder);return result},{})}}();if(typeof _ret==="object")return _ret.v}return o};var jsonStringify=JSON.stringify.bind(JSON);var orderFromArray=function orderFromArray(keyList){return function(a,b){var indexA=keyList.indexOf(a);var indexB=keyList.indexOf(b);if(indexA!=-1){if(indexB!=-1){return indexA-indexB}return-1}if(indexB!=-1){return 1}return a<b?-1:1}};var sortify=function sortify(value,replacer,space){var nativeJson=jsonStringify(value,replacer,0);if(!nativeJson||nativeJson[0]!=="{"&&nativeJson[0]!=="["){return nativeJson}var cleanObj=JSON.parse(nativeJson);var customOrder=arguments[3];if(Array.isArray(customOrder)){customOrder.forEach(function(entry){if(numericRE.test(entry)){throw new TypeError("Custom order must not contain numeric keys")}});customOrder=orderFromArray(customOrder)}else if(typeof customOrder!="function"){customOrder=undefined}return jsonStringify(sortKeys(cleanObj,customOrder),null,space)};return sortify});