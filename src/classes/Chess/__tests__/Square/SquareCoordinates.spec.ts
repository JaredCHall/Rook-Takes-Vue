import { describe, it, expect } from 'vitest'
import {SquareCoordinates} from "@/classes/Chess/Square/SquareCoordinates";


describe('SquareCoordinates', () => {
    it('it constructs itself', () => {
        const square = new SquareCoordinates(5,4)
        expect(square).instanceof(SquareCoordinates)
        expect(square.column).toEqual(5)
        expect(square.row).toEqual(4)
    })
})