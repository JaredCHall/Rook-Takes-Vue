import { describe, it, expect, vi } from 'vitest'
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";

describe('CoordinateNotation', () => {

    it('it errors on invalid inputs', () => {
        expect(() => {CoordinateNotation.fromInput('NaM')}).toThrowError('Unreadable Coordinate notation')
        expect(() => {CoordinateNotation.fromInput('e4e5e6')}).toThrowError('Unreadable Coordinate notation')
        expect(() => {CoordinateNotation.fromInput('a7e8P')}).toThrowError('Unreadable Coordinate notation')
    })

    it('it makes from input with valid coordinates' , () => {
        let notation = CoordinateNotation.fromInput('b4 c6')
        expect(notation.oldSquare).toEqual('b4')
        expect(notation.newSquare).toEqual('c6')
        expect(notation.promoteToType).toBeNull()

        notation = CoordinateNotation.fromInput('b4c6')
        expect(notation.oldSquare).toEqual('b4')
        expect(notation.newSquare).toEqual('c6')
        expect(notation.promoteToType).toBeNull()

    })

    it('it makes from input with pawn promotion', () => {
        let notation = CoordinateNotation.fromInput('e7 f8 Q')
        expect(notation.oldSquare).toEqual('e7')
        expect(notation.newSquare).toEqual('f8')
        expect(notation.promoteToType).toEqual('queen')

        notation = CoordinateNotation.fromInput('e7 f8B')
        expect(notation.promoteToType).toEqual('bishop')

        notation = CoordinateNotation.fromInput('e7f8=N')
        expect(notation.promoteToType).toEqual('knight')
    })
})