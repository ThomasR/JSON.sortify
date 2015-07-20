require('../');
var assert = require('assert');
var should = require('should');

describe('JSON.sortify', function () {
    describe('interface', function () {
        it('should define JSON.sortify', function () {
            JSON.sortify.should.be.a.function;
        });
    });

    describe('functionality', function () {
        it('should stringify simple values', function () {
            var fixtures = [
                1,
                .234,
                Infinity,
                null,
                true,
                false,
                undefined,
                'undefined',
                function bar() {},
                /abc/
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture), JSON.stringify(fixture));
            });

        });

        it('should stringify simple objects', function () {
            var fixtures = [
                {a:1, b:true, c:"ok", d:null},
                {a:.1, b:undefined, c:function () {}}, '{"a":0.1}',
                {' ': '"', 'null': 'null', 'undefined': '\t'}
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture), JSON.stringify(fixture));
            });
        });

        it('should stringify simple arrays', function () {
            var fixtures = [
                [1, true, "ok", null],
                [.1, undefined, function () {}]
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture), JSON.stringify(fixture));
            });
        });

        it('should stringify nested objects', function () {
            var fixtures = [
                {a:{b:2, c:{d:3}}},
                [{a:{b:1}, b:[{a:1}, {b:{c:[2, null]}}]}]
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture), JSON.stringify(fixture));
            });
        });

        it('should handle toJSON', function () {
            var fixtures = [
                {toJSON: function () { return 'Banana!';}},
                {a: 1, b:2, toJSON: function () { return null;}},
                {a: {b:1, toJSON: function () { return 'x';}}, c:3}
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture), JSON.stringify(fixture));
            });
        });

        it('should handle the replacer parameter', function () {
            var fixtures = [
                [{a:{b:2, c:{d:3}}}, ['a']],
                [{a:{b:2, c:{d:3}}}, ['b']],
                [{a:{b:2, c:{d:3}}}, []],
                [{a:{b:2, a:{a:3, c:2}}}, ['a']],
                [{a:1, b:'foo'}, function (key, value) { return typeof value == 'string' ? value + '!!!' : value; }],
                [{a:{b:2, a:{a:3, c:2}}}, function () {}]
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture[0], fixture[1]), JSON.stringify(fixture[0], fixture[1]));
            });
        });

        it('should handle the indentation parameter', function () {
            var fixtures = [
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, null],
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, 1],
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, 4],
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, '\t'],
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, 'gooble']
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture[0], null, fixture[1]), JSON.stringify(fixture[0], null, fixture[1]));
            });
        });

        it('should handle three arguments', function () {
            var fixtures = [
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, function (key, value) { return typeof value == 'string' ? value + '!!!' : value; }, 4],
                [{a:{a:2, c:[{d:3}, 4, 'hello']}}, ['a'], '\t'],
                [{a:{b:2, c:[{d:3}, 4, 'hello']}}, function (key, value) { return value; },'gooble']
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify.apply(JSON, fixture), JSON.stringify.apply(JSON, fixture));
            });
        });

        it('should throw a TypeError on cyclic values', function () {
            var fixtures = [
                {},
                {a:{}},
                [],
                {a:[]},
                {a:[]}
            ];
            fixtures[0].x = fixtures[0];
            fixtures[1].a.b = fixtures[1];
            fixtures[2].push(fixtures[2]);
            fixtures[3].a.push(fixtures[3]);
            fixtures[4].a.push(fixtures[4].a);
            fixtures.forEach(function (fixture) {
                assert.throws(JSON.sortify.bind(JSON, fixture), TypeError);
            });
        });

        it('should sort keys', function () {
            var fixtures = [
                [{c:1, b:2, a:3}, '{"a":3,"b":2,"c":1}'],
                [{c:1, 42:2, a:3, 0:4, '':5, '00':6, 5:7}, '{"0":4,"5":7,"42":2,"":5,"00":6,"a":3,"c":1}'],
                [{c:1, b:2, a:{y:1,z:2,x:3}}, '{"a":{"x":3,"y":1,"z":2},"b":2,"c":1}'],
                [{c:1, b:['foo', 2, {a:{y:1,z:2,x:3}}]}, '{"b":["foo",2,{"a":{"x":3,"y":1,"z":2}}],"c":1}']
            ];
            fixtures.forEach(function (fixture) {
                assert.equal(JSON.sortify(fixture[0]), fixture[1]);
            });
        });
    });
});
