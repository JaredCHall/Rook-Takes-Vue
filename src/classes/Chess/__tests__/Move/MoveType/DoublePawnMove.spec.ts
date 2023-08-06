import { describe, it, expect, vi } from 'vitest'
import {Piece} from "@/classes/Chess/Piece";
import {DoublePawnMove} from "@/classes/Chess/Move/MoveType/DoublePawnMove";

describe('DoublePawnMove', () => {
    it('it constructs itself', () => {

        const piece = Piece.pawnWhite()
        const move = new DoublePawnMove('e2','e4',piece)

        expect(move).toHaveProperty('oldSquare','e2')
        expect(move).toHaveProperty('newSquare','e4')
        expect(move.movingPiece).toBe(piece)
        expect(move.capturedPiece).toBeNull()
    })


    it.each([
        ['white','a2','a4','a3'],
        ['white','e2','e4','e3'],
        ['black','c7','c5','c6'],
        ['black','f7','f5','f6'],
    ])('it gets en-passant target square for %s %s pawn',(
        color,
        oldSquare,
        newSquare,
        expected
    )=>{
        const piece = new Piece('pawn',color,oldSquare)
        const move = new DoublePawnMove(oldSquare,newSquare,piece)

        expect(move.getEnPassantTargetSquare()).toEqual(expected)
    })

})
