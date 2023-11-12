import { describe, it, expect, vi } from 'vitest'
import {MoveFactory} from "@/classes/Chess/MoveNotary/MoveFactory";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {MoveNotary} from "@/classes/Chess/MoveNotary/MoveNotary";

describe('MoveFactory' , () => {


    it('it makes notation from input' , () => {

        const factory = new MoveFactory(MoveArbiter.fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
        expect(() => {
            //@ts-ignore
            factory.makeNotation('abc', 'CustomNotation')
        }).toThrowError('Unrecognized input type: must be SAN or Coordinate')


        expect(factory.makeNotation('e2e4','Coordinate')).toBeInstanceOf(CoordinateNotation)
        expect(factory.makeNotation('e4','SAN')).toBeInstanceOf(SanNotation)

    })

    it('it makes move from san notation' , () => {

        //8/6P1/8/8/8/8/8/4K2k w - - 0 1
        const factory = new MoveFactory(MoveArbiter.fromFen('8/6P1/8/8/8/8/8/4K2k w - - 0 1'))
        const notation = SanNotation.fromInput('g8=R','white')
        const move = factory.make(notation)

        expect(move.oldSquare).toEqual('g7')
        expect(move.newSquare).toEqual('g8')
        expect(move).toBeInstanceOf(PawnPromotionMove)
        //@ts-ignore
        expect(move.promoteToType).toEqual('rook')

    })

    it('it makes move from coordinate notation' , () => {

        const factory = new MoveFactory(MoveArbiter.fromFen('8/6P1/8/8/8/8/8/4K2k w - - 0 1'))
        const notation = new CoordinateNotation('g7','g8','R')
        const move = factory.make(notation)

        expect(move.oldSquare).toEqual('g7')
        expect(move.newSquare).toEqual('g8')
        expect(move).toBeInstanceOf(PawnPromotionMove)
        //@ts-ignore
        expect(move.promoteToType).toEqual('rook')

    })

    it('it does not make illegal moves' ,() => {
        const factory = new MoveFactory(MoveArbiter.fromFen('8/6P1/8/8/8/8/8/4K2k w - - 0 1'))

        expect(() => {
            factory.make(new CoordinateNotation('a6','a7'))
        }).toThrowError('No piece on square a6')

        expect(() => {
            factory.make(new CoordinateNotation('g7','g6'))
        }).toThrowError('Move is illegal.')

        expect(() => {
            factory.make(SanNotation.fromInput('a7','white'))
        }).toThrowError('Move is illegal.')

    })

    it('it makes move from SAN with file disambiguation' , () => {
        const factory = new MoveFactory(MoveArbiter.fromFen('rnbq1rk1/1p3pbp/p1NpNn2/2p1pP2/2B1P3/3P4/PPP3PP/R1B1QRK1 w - - 0 10'))
        const notation = SanNotation.fromInput('Nexd8','white')
        expect(factory.make(notation)).toEqual(new ChessMove(
            'e6',
            'd8',
            Piece.knightWhite(),
            Piece.queenBlack(),
        ))

    })

    it('it makes move from SAN with rank disambiguation' , () => {
        const factory = new MoveFactory(MoveArbiter.fromFen('rnbqNrk1/1p3pbp/p2pNn2/2p1pP2/2B1P3/3P4/PPP3PP/R1B1QRK1 w - - 0 10'))
        const notation = SanNotation.fromInput('N8xg7','white')
        expect(factory.make(notation)).toEqual(new ChessMove(
            'e8',
            'g7',
            Piece.knightWhite(),
            Piece.bishopBlack()
        ))

    })

    it('it makes move from SAN with file and rank disambiguation' , () => {
        const factory = new MoveFactory(MoveArbiter.fromFen('rNbq1rk1/1p3pbp/pN1p1N2/2p1pP2/2B1P3/3P4/PPP3PP/R1B1QRK1 w - - 0 10'))
        const notation = SanNotation.fromInput('Nb6d7','white')
        expect(factory.make(notation)).toEqual(new ChessMove(
            'b6',
            'd7',
            Piece.knightWhite(),
        ))
    })

    it('it handles invalid disambiguation' , () => {
        const factory = new MoveFactory(MoveArbiter.fromFen('rNbq1rk1/1p3pbp/pN1p1N2/2p1pP2/2B1P3/3P4/PPP3PP/R1B1QRK1 w - - 0 10'))

        expect(() => {
            factory.make(SanNotation.fromInput('N6d7','white'))
        }).toThrowError('Move is ambiguous.')


        expect(() => {
            factory.make(SanNotation.fromInput('Na6d7','white'))
        }).toThrowError('Move disambiguation invalid.')

    })

})