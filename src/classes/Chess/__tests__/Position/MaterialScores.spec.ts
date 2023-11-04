import { describe, it, expect } from 'vitest'
import {MaterialScores} from "@/classes/Chess/Position/MaterialScores";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";

describe('MaterialScores', () => {

    it('constructs itself' , () => {

        const scores = new MaterialScores(15,20)
        expect(scores.black).toEqual(20)
        expect(scores.white).toEqual(15)
    })

    it('it adjusts scores onMove and onUnMove', () => {

        const scores = new MaterialScores(20,20)

        // white pawn is captured
        const move1 = new ChessMove('e4','e5', Piece.pawnBlack(), Piece.pawnWhite())
        scores.onMove(move1)
        expect(scores.white).toEqual(19)
        expect(scores.black).toEqual(20)

        // nothing is captured
        const move2 = new ChessMove('e6','e5', Piece.pawnWhite())
        scores.onMove(move2)
        expect(scores.white).toEqual(19)
        expect(scores.black).toEqual(20)

        // pawn is promoted to knight
        const move3 = new PawnPromotionMove(new ChessMove('a7','a8', Piece.pawnBlack()),'knight')
        scores.onMove(move3)
        expect(scores.white).toEqual(19)
        expect(scores.black).toEqual(22) // +3 for knight and -1 for pawn


        // Un-moves... roll it all back
        scores.onUnMove(move3)
        expect(scores.white).toEqual(19)
        expect(scores.black).toEqual(20)

        scores.onUnMove(move2)
        expect(scores.white).toEqual(19)
        expect(scores.black).toEqual(20)

        scores.onUnMove(move1)
        expect(scores.white).toEqual(20)
        expect(scores.black).toEqual(20)

    })
})