import { describe, it, expect} from 'vitest'
import {Assert} from "@/classes/Assert";



describe('Assert', () => {

    const a = undefined
    const b = 1
    const c = 'hello'
    const d = null


    it('checks is defined' , () => {


        expect(Assert.isDefined(b)).toEqual(true)
        expect(Assert.isDefined(c)).toEqual(true)
        expect(() => {Assert.isDefined(a)}).toThrowError('? must be defined.')

        // check argName is used
        expect(() => {Assert.isDefined(a,'someArg')}).toThrowError('someArg must be defined.')

    })

    it('checks not null', () => {
        expect(Assert.notNull(b)).toEqual(true)
        expect(Assert.notNull(c)).toEqual(true)
        expect(() => {Assert.notNull(a)}).toThrowError('? must not be null|undefined.')
        expect(() => {Assert.notNull(d)}).toThrowError('? must not be null|undefined.')

        // check argName is used
        expect(() => {Assert.notNull(d,'someArg')}).toThrowError('someArg must not be null|undefined.')
    })


    it('checks is number' , () => {

        expect(Assert.isNumber(b)).toEqual(true)
        expect(() => {Assert.isNumber(a)}).toThrowError('? must be a number.')
        expect(() => {Assert.isNumber(c)}).toThrowError('? must be a number.')

        // check argName is used
        expect(() => {Assert.isNumber(c,'someArg')}).toThrowError('someArg must be a number.')

    })

    it('checks is string' , () => {

        expect(Assert.isString(c)).toEqual(true)
        expect(() => {Assert.isString(a)}).toThrowError('? must be a string.')
        expect(() => {Assert.isString(b)}).toThrowError('? must be a string.')

        // check argName is used
        expect(() => {Assert.isString(b,'someArg')}).toThrowError('someArg must be a string.')

    })

    it('checks is enum', () => {
        expect(Assert.isEnum(b,[3,2,1])).toEqual(true)
        expect(Assert.isEnum(c, ['world','hello'])).toEqual(true)

        expect(() => {Assert.isEnum(c, ['world','hello2'])})
            .toThrowError('? must be in enum values: world, hello2.')
        expect(() => {Assert.isEnum(b,[3,2,0], 'someArg')})
            .toThrowError('someArg must be in enum values: 3, 2, 0.')
    })


})