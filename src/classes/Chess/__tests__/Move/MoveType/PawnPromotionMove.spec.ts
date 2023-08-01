import { describe, it, expect, vi } from 'vitest'
import Piece from "@/classes/Chess/Piece";
import ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import PawnPromotionMove from "@/classes/Chess/Move/MoveType/PawnPromotionMove";


describe('PawnPromotionMove', () => {
    it('it constructs itself', () => {

        const pawn = new Piece('pawn','white')
        const move = new PawnPromotionMove(new ChessMove('e7','e8',pawn))

        expect(move).toHaveProperty('oldSquare','e7')
        expect(move).toHaveProperty('newSquare','e8')
        expect(move.movingPiece).toBe(pawn)
        expect(move.promoteToType).toEqual('queen') // always queen for the time-being

        // wrong piece type
        const knight = new Piece('knight','white')
        expect(() => {new PawnPromotionMove('e7','e8', knight)})
            .toThrowError()

        // wrong final ranks
        expect(() => {new PawnPromotionMove('e2','e1', pawn)})
            .toThrowError()

        pawn.color = 'black'
        expect(() => {new PawnPromotionMove('e2','e8', pawn)})
            .toThrowError()

    })

    it.each([
        ['e4','white',false],
        ['e1','white',false],
        ['e8','white',true],
        ['d4','black',false],
        ['d1','black',true],
        ['d8','black',false],
    ])('it determines if %s is on the final rank for %s', (square, color, expected) => {
        const piece = new Piece('pawn', color)
        expect(PawnPromotionMove.squareIsOnFinalRank(square, piece)).toEqual(expected)
    })

    it('it clones itself', () => {

        const pawn = new Piece('pawn','white')
        const move = new PawnPromotionMove(new ChessMove('e7','e8',pawn))
        const clone = move.clone()

        expect(clone).toEqual(move)
        expect(clone).not.toBe(move)

    })

})
