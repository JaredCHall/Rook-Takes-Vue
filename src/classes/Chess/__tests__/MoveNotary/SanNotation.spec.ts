import { describe, it, expect, vi } from 'vitest'
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {Piece} from "@/classes/Chess/Piece";
import {CastlesType} from "@/classes/Chess/Move/MoveType/CastlesType";

describe('SanNotation' , () => {

    it('constructs itself' , () => {

        let notation = new SanNotation(
            Piece.pawnWhite(),
            false,
            'e8',
            null,
            'knight',
            null,
            null,
            '#'
        )
        expect(notation.movingPiece).toEqual(Piece.pawnWhite())
        expect(notation.promoteToType).toEqual('knight')
        expect(notation.newSquare).toEqual('e8')
        expect(notation.checkMateToken).toEqual('#')
        expect(notation.isCapture).toEqual(false)
        expect(notation.castlesType).toBeNull()
        expect(notation.startFile).toBeNull()
        expect(notation.startRank).toBeNull()
    })

    it('it requires file disambiguation for pawn captures', () => {

        expect(() => {
            const notation = new SanNotation(
                Piece.pawnBlack(),
                true,
                'd4',
                null,
                null,
                null,
                null,
                null
            )
        }).toThrowError('File disambiguation is always required for pawn captures')
    })

    it('it handles pawn move', () => {
        const notation = SanNotation.fromInput('e6','black')
        expect(notation.serialize()).toEqual('e6')
        expect(notation.movingPiece).toEqual(Piece.pawnBlack())
    })

    it('it handles pawn capture', () => {

        const notation = SanNotation.fromInput('dxe5','white')
        expect(notation.serialize()).toEqual('dxe5')
        expect(notation.movingPiece).toEqual(Piece.pawnWhite())
    })

    it('it handles pawn promotion' , () => {
        const notation = SanNotation.fromInput('e8=B','white')
        expect(notation.serialize()).toEqual('e8=B')
        expect(notation.movingPiece).toEqual(Piece.pawnWhite())
        expect(notation.promoteToType).toEqual('bishop')
    })

    it('it handles capture', () => {
        const notation = SanNotation.fromInput('Rxe1','black')
        expect(notation.serialize()).toEqual('Rxe1')
        expect(notation.movingPiece).toEqual(Piece.rookBlack())
        expect(notation.isCapture).toEqual(true)
    })

    it('it handles move with file disambiguation', () => {
        const notation = SanNotation.fromInput('Qfd6','black')
        expect(notation.serialize()).toEqual('Qfd6')
        expect(notation.movingPiece).toEqual(Piece.queenBlack())
        expect(notation.startFile).toEqual('f')
    })

    it('it handles move with rank disambiguation', () => {
        const notation = SanNotation.fromInput('Q7d6','black')
        expect(notation.serialize()).toEqual('Q7d6')
        expect(notation.movingPiece).toEqual(Piece.queenBlack())
        expect(notation.startRank).toEqual(7)
    })

    it('it handles check', () => {
        const notation = SanNotation.fromInput('Nb3+','black')
        expect(notation.serialize()).toEqual('Nb3+')
        expect(notation.movingPiece).toEqual(Piece.knightBlack())
        expect(notation.checkMateToken).toEqual('+')
    })

    it('it handles mate' , () => {
        const notation = SanNotation.fromInput('Rxh8#','white')
        expect(notation.serialize()).toEqual('Rxh8#')
        expect(notation.movingPiece).toEqual(Piece.rookWhite())
        expect(notation.checkMateToken).toEqual('#')
    })

    it('it handles short castles' , () => {
        const notation = SanNotation.fromInput('O-O','white')
        expect(notation.serialize()).toEqual('O-O')
        expect(notation.movingPiece).toEqual(Piece.kingWhite())
        expect(notation.castlesType).toEqual(CastlesType.create('K'))
    })

    it('it handles long castles' , () => {
        const notation = SanNotation.fromInput('O-O-O','white')
        expect(notation.serialize()).toEqual('O-O-O')
        expect(notation.movingPiece).toEqual(Piece.kingWhite())
        expect(notation.castlesType).toEqual(CastlesType.create('Q'))
    })

})