import { describe, it, expect } from 'vitest'
import {Piece} from "@/classes/Chess/Piece";
import {MoveStep} from "@/classes/Chess/Move/MoveStep";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import {CastlesType} from "@/classes/Chess/Move/MoveType/CastlesType";

describe('CastlingMove', () => {
    it('it constructs itself', () => {

        const king = Piece.kingWhite()
        const rook = Piece.rookWhite()
        const move = new CastlingMove('e1','c1',king, rook, 'Q')

        expect(move).toHaveProperty('oldSquare','e1')
        expect(move).toHaveProperty('newSquare','c1')
        expect(move.movingPiece).toBe(king)
        expect(move.capturedPiece).toBeNull()
        expect(move.rook).toBe(rook)
        expect(move.castlesType).toBeInstanceOf(CastlesType)
        expect(move.castlesType.rooksOldSquare).toEqual('a1')

    })

    it('it gets move steps', () => {
        const king = Piece.kingWhite()
        const rook = Piece.rookWhite()
        const move = new CastlingMove('e1','c1',king, rook, 'Q')

        const steps = move.getMoveSteps()
        expect(steps).toEqual([
            new MoveStep('e1',null),
            new MoveStep('c1', king),
            new MoveStep('a1', null),
            new MoveStep('d1', rook)
        ])
    })

    it('it gets undo steps', () => {
        const king = Piece.kingWhite()
        const rook = Piece.rookWhite()
        const move = new CastlingMove('e1','c1',king, rook, 'Q')

        const steps = move.getUndoSteps()
        expect(steps).toEqual([
            new MoveStep('c1',null),
            new MoveStep('e1', king),
            new MoveStep('d1', null),
            new MoveStep('a1', rook)
        ])
    })

    it('it clones itself', () => {
        const king = Piece.kingWhite()
        const rook = Piece.rookWhite()
        const move = new CastlingMove('e1','c1',king, rook, 'Q')

        const clone = move.clone()
        expect(clone.movingPiece).toEqual(king)
        expect(clone.movingPiece).not.toBe(king)
        expect(clone.rook).toEqual(rook)
        expect(clone.rook).not.toBe(rook)
        expect(clone.oldSquare).toEqual(move.oldSquare)
        expect(clone.newSquare).toEqual(move.newSquare)
        expect(clone.castlesType).toEqual(move.castlesType)
        expect(clone.capturedPiece).toBeNull()

    })

    it('it static creates itself', () => {
        expect(CastlingMove.create('K').castlesType.type).toEqual('K')
        expect(CastlingMove.create('Q').castlesType.type).toEqual('Q')
        expect(CastlingMove.create('k').castlesType.type).toEqual('k')
        expect(CastlingMove.create('q').castlesType.type).toEqual('q')
    })

})
