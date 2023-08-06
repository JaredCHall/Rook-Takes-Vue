import { describe, it, expect, vi } from 'vitest'
import {Piece} from "@/classes/Chess/Piece";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";


describe('ChessMove', () => {
    it('it constructs itself', () => {

        const piece = Piece.knightWhite()
        const move = new ChessMove('f3','f2',piece, null)

        expect(move).toHaveProperty('oldSquare','f3')
        expect(move).toHaveProperty('newSquare','f2')
        expect(move.movingPiece).toBe(piece)
        expect(move.capturedPiece).toBeNull()

    })
    it('it clones itself',() => {
        const piece = Piece.knightWhite()
        const piece2 = Piece.bishopBlack()
        const move = new ChessMove('f3','f2',piece, piece2)

        const clone = move.clone()

        expect(clone).toEqual(move)
        expect(clone).not.toBe(move)

        expect(clone).toHaveProperty('oldSquare','f3')
        expect(clone).toHaveProperty('newSquare','f2')
        expect(clone.movingPiece).toEqual(piece)
        expect(clone.movingPiece).not.toBe(piece)
        expect(clone.capturedPiece).toEqual(piece2)
        expect(clone.capturedPiece).not.toBe(piece2)

    })

    it('it gets move steps', () => {
        const piece = Piece.knightWhite()
        const move = new ChessMove('f3','f2',piece, null)
        const steps = move.getMoveSteps()

        expect(steps).toHaveLength(2)
        expect(steps[0]).toHaveProperty('squareName','f3')
        expect(steps[0]).toHaveProperty('piece',null)
        expect(steps[1]).toHaveProperty('squareName','f2')
        expect(steps[1]).toHaveProperty('piece',piece)

    })

    it('it gets capture undo steps', () => {
        const piece = Piece.knightWhite()
        const piece2 = Piece.bishopBlack()
        const move = new ChessMove('f3','f2',piece, piece2)
        const steps = move.getUndoSteps()

        expect(steps).toHaveLength(2)
        expect(steps[0]).toHaveProperty('squareName','f2')
        expect(steps[0]).toHaveProperty('piece', piece2)
        expect(steps[1]).toHaveProperty('squareName','f3')
        expect(steps[1]).toHaveProperty('piece', piece)
    })


    it('it gets undo steps', () => {
        const piece = Piece.knightWhite()
        const move = new ChessMove('f3','f2',piece, null)
        const steps = move.getUndoSteps()

        expect(steps).toHaveLength(2)
        expect(steps[0]).toHaveProperty('squareName','f2')
        expect(steps[0]).toHaveProperty('piece',null)
        expect(steps[1]).toHaveProperty('squareName','f3')
        expect(steps[1]).toHaveProperty('piece',piece)
    })

})
