import { describe, it, expect } from 'vitest'
import OutOfBoundsSquare from "@/classes/Chess/Square/OutOfBoundsSquare";


describe('OutOfBoundsSquare', () => {
    it('it constructs itself', () => {
        const square = new OutOfBoundsSquare()
        expect(square).instanceof(OutOfBoundsSquare)
        expect(Object.getOwnPropertyNames(square)).toHaveLength(0)
    })
})