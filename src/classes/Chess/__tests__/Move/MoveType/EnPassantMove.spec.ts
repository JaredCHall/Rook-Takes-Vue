import { describe, it, expect, vi } from 'vitest'
import Piece from "@/classes/Chess/Piece";
import ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import EnPassantMove from "@/classes/Chess/Move/MoveType/EnPassantMove";
import MoveStep from "@/classes/Chess/Move/MoveStep";

describe('EnPassantMove', () => {
    it('it constructs itself', () => {

        const piece = new Piece('pawn','black')
        const capturedPiece = new Piece('pawn','white')
        const move = new EnPassantMove(new ChessMove('f4','e3',piece), capturedPiece,'e4')

        expect(move.oldSquare).toEqual('f4')
        expect(move.newSquare).toEqual('e3')
        expect(move.movingPiece).toBe(piece)
        expect(move.capturedPiece).toBe(capturedPiece)
        expect(move.capturedSquare).toBe('e4')

        // test error on invalid en passant target square
        expect(() => {new EnPassantMove('f4','e2',piece, capturedPiece,'e4')}).toThrowError()
    })

    it('it get opponent pawn square', () => {

        let move = new ChessMove('e4','f3')
        expect(EnPassantMove.getOpponentPawnSquare(move)).toEqual('f4')

        move = new ChessMove('c6','d7')
        expect(EnPassantMove.getOpponentPawnSquare(move)).toEqual('d6')
    })

    it('it gets move steps', () => {

        const whitePawn = new Piece('pawn','white')
        const blackPawn = new Piece('pawn','black')

        let move = new EnPassantMove(new ChessMove('f4','e3',blackPawn), whitePawn,'e4')
        expect(move.getMoveSteps()).toEqual([
            new MoveStep('f4', null),
            new MoveStep('e3', blackPawn),
            new MoveStep('e4', null)
        ])

        move = new EnPassantMove(new ChessMove('c5','d6',whitePawn), blackPawn,'d5')
        expect(move.getMoveSteps()).toEqual([
            new MoveStep('c5', null),
            new MoveStep('d6', whitePawn),
            new MoveStep('d5', null)
        ])

    })

    it('it gets undo steps', () => {

        const whitePawn = new Piece('pawn','white')
        const blackPawn = new Piece('pawn','black')

        let move = new EnPassantMove(new ChessMove('f4','e3',blackPawn), whitePawn,'e4')
        expect(move.getUndoSteps()).toEqual([
            new MoveStep('e4', whitePawn),
            new MoveStep('f4', blackPawn),
            new MoveStep('e3', null),

        ])

        move = new EnPassantMove(new ChessMove('c5','d6',whitePawn), blackPawn,'d5')
        expect(move.getUndoSteps()).toEqual([
            new MoveStep('d5', blackPawn),
            new MoveStep('c5', whitePawn),
            new MoveStep('d6', null),
        ])
    })

})