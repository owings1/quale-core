const {expect} = require('chai')
const {HashProxy} = require('../../index.js')
const {ger, MockOutput} = require('../helpers/index.js')

function noop() {}

describe('HashProxy', () => {


    describe('arguments', () => {

        it('should fail for empty args', function () {
            const err = ger(() => HashProxy())
            expect(err).erri('Argument')
        })

        it('should fail for second arg that is not a object', function () {
            const err = ger(() => HashProxy({}, true))
            expect(err).erri('Argument')
        })

        it('should fail for transformer that is not a function', function () {
            const transform = 1
            const filter = noop
            const err = ger(() => HashProxy({}, {transform, filter}))
            expect(err).erri('Argument')
        })

        it('should fail for filter that is not a function', function () {
            const transform = noop
            const filter = 1
            const err = ger(() => HashProxy({}, {transform, filter}))
            expect(err).erri('Argument')
        })

        it('should pass for empty source and noop transform', function () {
            const transform = noop
            const res = HashProxy({}, {transform})
            expect(res).instanceof(Object)
        })
    })

    describe('init', () => {

        it('should return source value for ingress with no changes or options', function () {
            const source = {a: 5}
            const {ingress} = HashProxy(source)
            expect(ingress.a).equal(5)
        })

        it('should source set transform value after init', function () {
            const source = {a: 5}
            const transform = v => v * 2
            const {ingress, target} = HashProxy(source, {transform})
            expect(target.a).equal(10)
        })
    })

    describe('set primitive', () => {

        it('should mirror with no transform', function () {
            const source = {a: 5}
            const {ingress, target} = HashProxy(source)
            ingress.a = 1
            expect(target.a).equal(1)
        })

        it('should update a in source set target.a to 2', function () {
            const source = {a: 5}
            const transform = v => v * 2
            const {ingress, target} = HashProxy(source, {transform})
            ingress.a = 1
            expect(target.a).equal(2)
        })

        it('should update a.b in source set target.a.b to 8', function () {
            const source = {a: {b: 0}}
            const transform = v => v * 2
            const {ingress, target} = HashProxy(source, {transform})
            ingress.a.b = 4
            expect(target.a.b).equal(8)
        })

        it('should update a.b.c in source set target.a.b.c to 8', function () {
            const source = {a: {b: {c: 0}}}
            const transform = v => v * 2
            const {ingress, target} = HashProxy(source, {transform})
            ingress.a.b.c = 4
            expect(target.a.b.c).equal(8)
        })
    })

    describe('set object', () => {

        it('should update source/target.a with key from object setting, but not be identical to input', function () {
            const source = {a: {b: 0, c: 1, d: 3}}
            const transform = v => v + 6
            const {ingress, target} = HashProxy(source, {transform})
            const input = {b: 1, c: 2, d: 4}
            ingress.a = input
            expect(target.a.b).to.equal(7)
            expect(target.a.c).to.equal(8)
            expect(target.a.d).to.equal(10)
            expect(target.a).to.not.equal(input)
        })

        it('should ignore trying to set a non-object to an object', function () {
            const source = {a: {b: 1, c: 2}, d: 3}
            const transform = v => v - 1
            const {ingress, target} = HashProxy(source, {transform})
            ingress.a = 1
            ingress.a = true
            ingress.a = [1, 2, 3]
            expect(source.a).to.deep.equal({b: 1, c: 2})
            expect(target.a).to.deep.equal({b: 0, c: 1})
        })
    })

    describe('filter', () => {

        it('should not set when filter returns false', function () {
            const source = {a: 5}
            const transform = v => v * 2
            const filter = v => v != 20
            const {ingress, target} = HashProxy(source, {transform, filter})
            ingress.a = 1
            ingress.a = 20
            expect(source.a).equal(1)
        })

        it('should not transform when filter returns false', function () {
            const source = {a: 5}
            const transform = v => v * 2
            const filter = v => v != 20
            const {ingress, target} = HashProxy(source, {transform, filter})
            ingress.a = 1
            ingress.a = 20
            expect(target.a).equal(2)
        })
    })
})