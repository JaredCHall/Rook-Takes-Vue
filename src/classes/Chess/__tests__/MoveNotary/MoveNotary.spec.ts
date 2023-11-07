import { describe, it, expect, vi } from 'vitest'
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {MoveNotary} from "@/classes/Chess/MoveNotary/MoveNotary";
import {Piece} from "@/classes/Chess/Piece";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";

describe('MoveNotary' , () => {

    it('constructs itself' , () => {
        const arbiter = vi.fn()

        const notary = new MoveNotary(arbiter)
        expect(notary.moveArbiter).toBe(arbiter)
    })

    it('it formats simple pawn moves' , () => {
        const move = new ChessMove('e6','e5', Piece.pawnBlack())
        const fenAfter = 'rnbq1rk1/1p3pbp/p2p1np1/2p1p3/2B1PP1N/2NP4/PPP3PP/R1B1QRK1 w - - 0 10 0 0'
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move,'').serialize()).toEqual('e5')
    })

    it('it adds disambiguation' , () => {
        const move = new ChessMove('e6','e5', Piece.pawnBlack())
        const fenAfter = 'rnbq1rk1/1p3pbp/p2p1np1/2p1p3/2B1PP1N/2NP4/PPP3PP/R1B1QRK1 w - - 0 10 0 0'
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move,'d').serialize()).toEqual('de5')
    })

    it('it formats pawn captures' , () => {
        const move = new ChessMove('f4','e5', Piece.pawnWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1np1/2p1P3/2B1P2N/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 0 0')
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move,'f').serialize()).toEqual('fxe5')
    })

    it('it formats piece captures' , () => {
        // knight takes in a grand prix
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10')
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move).serialize()).toEqual('Nxg6')
    })

    it('it marks check' , () => {
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 1 0')
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move).serialize()).toEqual('Nxg6+')
    })

    it('it marks mate' , () => {
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 1 1')
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move).serialize()).toEqual('Nxg6#')
    })

    it('it marks pawn promotions' , () => {
        const baseMove = new ChessMove('d7','d8', Piece.pawnWhite())
        const move = new PawnPromotionMove(baseMove, 'knight')
        const fenAfter = new ExtendedFen('3N3R/5k1p/5ppK/8/8/8/4R3/8 b - - 0 1 1 1')
        const notary = new MoveNotary(MoveArbiter.fromFen(fenAfter))
        expect(notary.getSanNotation(move).serialize()).toEqual('d8=N#')
    })

    it('it marks castling moves' , () => {
        let move = CastlingMove.create('Q')
        let notary = new MoveNotary(MoveArbiter.fromFen('2rknb1r/ppp1nppp/5q2/1B5b/4PB2/4QP2/PPP3PP/2KR3R b - - 3 12 1 0'))
        expect(notary.getSanNotation(move).serialize()).toEqual('O-O-O+')

        move = CastlingMove.create('K')
        notary = new MoveNotary(MoveArbiter.fromFen('2rknb1r/ppp1nppp/5q2/1B5b/4PB2/4QP2/PPP3PP/2KR3R b - - 3 12 0 0'))
        expect(notary.getSanNotation(move).serialize()).toEqual('O-O')

        move = CastlingMove.create('q')
        notary = new MoveNotary(MoveArbiter.fromFen('r4rk1/pbppqppp/1pn1pn2/8/1PBPP3/1P3N2/P4PPP/RNBQ1RK1 w - - 5 9'))
        expect(notary.getSanNotation(move).serialize()).toEqual('O-O-O')

        move = CastlingMove.create('k')
        notary = new MoveNotary(MoveArbiter.fromFen('2kr3r/pbppqppp/1pn1pn2/8/1PBPP3/1P3N2/P4PPP/RNBQ1RK1 w - - 5 9'))
        expect(notary.getSanNotation(move).serialize()).toEqual('O-O')
    })
})