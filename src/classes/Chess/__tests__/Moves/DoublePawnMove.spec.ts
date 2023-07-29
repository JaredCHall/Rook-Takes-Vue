import { describe, it, expect, vi } from 'vitest'
import Piece from "@/classes/Chess/Piece";
import MoveStep from "@/classes/Chess/Moves/MoveStep";
import ChessMove from "@/classes/Chess/Moves/ChessMove";
import DoublePawnMove from "@/classes/Chess/Moves/DoublePawnMove";
import Square from "@/classes/Chess/Square/Square";


describe('DoublePawnMove', () => {
    it('it constructs itself', () => {

        const piece = new Piece('pawn','white')
        const move = new DoublePawnMove('e2','e4',piece)

        expect(move).toHaveProperty('oldSquare','e2')
        expect(move).toHaveProperty('newSquare','e4')
        expect(move.movingPiece).toBe(piece)
        expect(move.capturedPiece).toBeNull()


        // test throws

        const knight = new Piece('knight','white')
        expect(() => {new DoublePawnMove('e2','e1', knight)})
            .toThrowError('requires pawn')

        expect(() => {new DoublePawnMove('e2','e1', piece)})
            .toThrowError('Double pawn moves must end on the 4th or 5th rank')

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
