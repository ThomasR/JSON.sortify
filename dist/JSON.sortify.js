"use strict";(function(factory){if(typeof module!=="undefined"&&module.exports)module.exports=factory();else if(typeof define=="function"&&typeof define.amd=="object")define("json.sortify",factory);else JSON.sortify=factory()})(function(){ /*!
*    Copyright 2015-2017 Thomas Rosenau
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
*/"use strict";var sortKeys=function sortKeys(o){if(Array.isArray(o)){return o.map(sortKeys)}else if(o instanceof Object){var _ret=function(){var numeric=[];var nonNumeric=[];Object.keys(o).forEach(function(key){if(/^(0|[1-9][0-9]*)$/.test(key)){numeric.push(+key)}else {nonNumeric.push(key)}});return {v:numeric.sort(function(a,b){return a-b}).concat(nonNumeric.sort()).reduce(function(result,key){result[key]=sortKeys(o[key]);return result},{})}}();if(typeof _ret==="object")return _ret.v}return o};var jsonStringify=JSON.stringify.bind(JSON);var sortify=function sortify(value,replacer,space){var nativeJson=jsonStringify(value,replacer,0);if(!nativeJson||nativeJson[0]!=="{"&&nativeJson[0]!=="["){return nativeJson}var cleanObj=JSON.parse(nativeJson);return jsonStringify(sortKeys(cleanObj),null,space)};return sortify});