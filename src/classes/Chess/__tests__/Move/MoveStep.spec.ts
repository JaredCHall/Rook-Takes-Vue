import { describe, it, expect, vi } from 'vitest'
import Piece from "@/classes/Chess/Piece";
import MoveStep from "@/classes/Chess/Move/MoveStep";


describe('MoveStep', () => {
    it('it constructs itself', () => {

        const piece = new Piece('knight','white')
        let moveStep = new MoveStep('e4', piece)

        expect(moveStep).toHaveProperty('squareName', 'e4')
        expect(moveStep.piece).toBe(piece)

        moveStep = new MoveStep('e4', null)

        expect(moveStep).toHaveProperty('squareName', 'e4')
        expect(moveStep.piece).toBeNull()

    })

})
