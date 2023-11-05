import { describe, it, expect, vi } from 'vitest'
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {MoveNotary} from "@/classes/Chess/MoveArbiter/MoveNotary";
import {Piece} from "@/classes/Chess/Piece";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";

describe('MoveNotary' , () => {

    it('constructs itself' , () => {
        const move = vi.fn()
        const fenAfter = vi.fn()
        const moveDisambiguation = vi.fn()

        const notary = new MoveNotary(move,fenAfter,moveDisambiguation)
        expect(notary.move).toBe(move)
        expect(notary.fenAfter).toBe(fenAfter)
        expect(notary.moveDisambiguation).toBe(moveDisambiguation)
    })

    it('it formats simple pawn moves' , () => {
        const move = new ChessMove('e6','e5', Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1np1/2p1p3/2B1PP1N/2NP4/PPP3PP/R1B1QRK1 w - - 0 10 0 0')

        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('e5')
    })


    it('it adds disambiguation' , () => {
        const move = new ChessMove('e6','e5', Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1np1/2p1p3/2B1PP1N/2NP4/PPP3PP/R1B1QRK1 w - - 0 10 0 0')

        let notary = new MoveNotary(move, fenAfter, 'd')
        expect(notary.format()).toEqual('de5')
    })

    it('it formats pawn captures' , () => {
        const move = new ChessMove('f4','e5', Piece.pawnWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1np1/2p1P3/2B1P2N/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 0 0')

        // including the file is a disambiguation and handled before invoking the notary
        let notary = new MoveNotary(move, fenAfter, 'f')
        expect(notary.format()).toEqual('fxe5')
    })

    it('it formats piece captures' , () => {
        // knight takes in a grand prix
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10')

        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('Nxg6')
    })

    it('it marks check' , () => {
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 1 0')

        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('Nxg6+')
    })

    it('it marks mate' , () => {
        const move = new ChessMove('h4','g6', Piece.knightWhite(), Piece.pawnBlack())
        const fenAfter = new ExtendedFen('rnbq1rk1/1p3pbp/p2p1nN1/2p1p3/2B1PP2/2NP4/PPP3PP/R1B1QRK1 b - - 0 10 1 1')

        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('Nxg6#')
    })

    it('it marks pawn promotions' , () => {
        const baseMove = new ChessMove('d7','d8', Piece.pawnWhite())
        const move = new PawnPromotionMove(baseMove, 'knight')
        const fenAfter = new ExtendedFen('3N3R/5k1p/5ppK/8/8/8/4R3/8 b - - 0 1 1 1')

        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('d8=N#')
    })

    it('it marks castling moves' , () => {
        let move = CastlingMove.create('Q')
        let fenAfter = new ExtendedFen('2rknb1r/ppp1nppp/5q2/1B5b/4PB2/4QP2/PPP3PP/2KR3R b - - 3 12 1 0')
        let notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('O-O-O+')

        move = CastlingMove.create('K')
        fenAfter = new ExtendedFen('2rknb1r/ppp1nppp/5q2/1B5b/4PB2/4QP2/PPP3PP/2KR3R b - - 3 12 0 0')
        notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('O-O')

        move = CastlingMove.create('q')
        notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('O-O-O')

        move = CastlingMove.create('k')
        notary = new MoveNotary(move, fenAfter, '')
        expect(notary.format()).toEqual('O-O')
    })
})