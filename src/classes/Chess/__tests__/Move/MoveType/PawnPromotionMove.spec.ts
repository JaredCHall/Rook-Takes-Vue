import { describe, it, expect, vi } from 'vitest'
import Piece from "@/classes/Chess/Piece";
import ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import PawnPromotionMove from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import EnPassantMove from "@/classes/Chess/Move/MoveType/EnPassantMove";
import MoveStep from "@/classes/Chess/Move/MoveStep";


describe('PawnPromotionMove', () => {
    it('it constructs itself', () => {

        const pawn = new Piece('pawn','white')
        const move = new PawnPromotionMove(new ChessMove('e7','e8',pawn))

        expect(move).toHaveProperty('oldSquare','e7')
        expect(move).toHaveProperty('newSquare','e8')
        expect(move.movingPiece).toBe(pawn)
        expect(move.promoteToType).toEqual('queen') // always queen for the time-being

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

    it('it gets move steps', () => {
        const whitePawn = new Piece('pawn','white')
        const blackPawn = new Piece('pawn','black')

        let move

        move = new PawnPromotionMove(new ChessMove('f7','f8',whitePawn),'queen')
        expect(move.getMoveSteps()).toEqual([
            new MoveStep('f7', null),
            new MoveStep('f8', new Piece('queen','white')),
        ])

        move = new PawnPromotionMove(new ChessMove('f7','f8',whitePawn),'knight')
        expect(move.getMoveSteps()).toEqual([
            new MoveStep('f7', null),
            new MoveStep('f8', new Piece('knight','white')),
        ])

        move = new PawnPromotionMove(new ChessMove('c7','d8',blackPawn, whitePawn), 'rook')
        expect(move.getMoveSteps()).toEqual([
            new MoveStep('c7', null),
            new MoveStep('d8', new Piece('rook','black')),
        ])
    })

    it('it gets undo steps', () => {
        const whitePawn = new Piece('pawn','white')
        const blackPawn = new Piece('pawn','black')

        let move

        move = new PawnPromotionMove(new ChessMove('f7','f8',whitePawn),'queen')
        expect(move.getUndoSteps()).toEqual([
            new MoveStep('f8', null),
            new MoveStep('f7', new Piece('pawn','white')),
        ])

        move = new PawnPromotionMove(new ChessMove('f7','f8',whitePawn),'knight')
        expect(move.getUndoSteps()).toEqual([
            new MoveStep('f8', null),
            new MoveStep('f7', new Piece('pawn','white')),
        ])

        move = new PawnPromotionMove(new ChessMove('c7','d8',blackPawn, whitePawn), 'rook')
        expect(move.getUndoSteps()).toEqual([
            new MoveStep('d8', null),
            new MoveStep('c7', new Piece('pawn','black')),
        ])
    })

})
