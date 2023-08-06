import { describe, it, expect } from 'vitest'

import {ExtendedFEN} from "@/classes/Chess/Board/ExtendedFEN";
import {Squares144} from "@/classes/Chess/Board/Squares144";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {Squares64} from "@/classes/Chess/Board/Squares64";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";


const getTestMoveArbiter = (fen) => {
    return new MoveArbiter(new MoveEngine(new Squares144(fen)))
}

describe('MoveArbiter', () => {
    it('it constructs itself', () => {

        const squares144 = new Squares144('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const engine = new MoveEngine(squares144)
        const arbiter = new MoveArbiter(engine)

        expect(arbiter.squares144).toBe(squares144)
        expect(arbiter.moveEngine).toBe(engine)
        expect(arbiter.squares64).toBeInstanceOf(Squares64)
        expect(arbiter.fenNumber).toBeInstanceOf(ExtendedFEN)
    })

    it('it determines if move is legal', () => {

        let arbiter = getTestMoveArbiter('rn2kb1r/ppp2ppp/5n2/8/4P1Nq/5P2/PPP1B1PP/RNBQK2R w KQkq')
        const fenNumber = arbiter.fenNumber.clone()
        const squares64 = arbiter.squares64.clone()

        expect(arbiter.isMoveLegal(new ChessMove(
            'g4',
            'f2',
            Piece.knightWhite()
        ))).toBe(true)
        expect(arbiter.fenNumber).toEqual(fenNumber)
        expect(arbiter.squares64).toEqual(squares64)

        // not allowed to capture a king
        expect(arbiter.isMoveLegal(new ChessMove(
            'g4',
            'f2',
            Piece.knightWhite(),
            Piece.kingWhite()
        ))).toBe(false)

        expect(arbiter.isMoveLegal(new ChessMove(
            'e2',
            'b5',
            Piece.bishopWhite()
        ))).toBe(false)

        expect(arbiter.isMoveLegal(new ChessMove(
            'g2',
            'g3',
            Piece.pawnWhite()
        ))).toBe(true)

        expect(arbiter.isMoveLegal(new ChessMove(
            'e1',
            'f1',
            Piece.kingWhite()
        ))).toBe(true)

        expect(arbiter.isMoveLegal(new ChessMove(
            'g4',
            'f6',
            Piece.knightWhite(),
            Piece.knightBlack()
        ))).toBe(false)

    })

    it('it determines if castling move is legal', () => {

        let arbiter

        //check that normal castles are still legal
        arbiter = getTestMoveArbiter('r3k2r/ppp2ppp/3b1n2/5q2/3nP1N1/5P2/PPP1B1PP/R3K2R b KQkq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(true)

        // checks on king prevent castling
        arbiter = getTestMoveArbiter('r3k2r/ppp2ppp/3b4/1Q3q2/1q2P3/5P2/PPP3PP/R3K2R b KQkq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

        // check that knight threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('r3k2r/ppp1Nppp/3b4/5q2/4P3/5P2/PPP1n1PP/R3K2R b KQkq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

        // check that queen threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('r3k2r/ppp1p1pp/3bQ3/8/8/4qP2/PPP1P1PP/R3K2R b KQkq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

        // check that rook threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('r3k3/ppp1p1pp/8/3R4/3r4/8/PPP1P1PP/R3K3 b Qq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)
        arbiter = getTestMoveArbiter('r3k3/ppp1p1pp/8/5R2/5r2/8/PPP1P1PP/R3K3 b Qq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(true)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(true)

        // check that bishop threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('4k3/ppp1p1pp/4B3/8/8/4b3/PPP1P1PP/4K3 b - - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

        // check that pawn threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('r3k2r/ppp1P1pp/8/8/8/8/PPP1p1PP/R3K2R b Qq - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

        // check that king threats on squares the king passes through prevent castling
        arbiter = getTestMoveArbiter('r3k2r/pKp3Kp/8/8/8/8/PkP3kP/R3K2R b Aa - 0 1')
        expect(arbiter.isMoveLegal(CastlingMove.create('K'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('Q'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('k'))).toBe(false)
        expect(arbiter.isMoveLegal(CastlingMove.create('q'))).toBe(false)

    })

    it('it determines if there are no legal moves from square', () => {

        let arbiter
        arbiter = getTestMoveArbiter('rnbqkbnr/pppp1Qpp/2n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4')
        expect(arbiter.getLegalMoves('e8')).toHaveLength(0)
        expect(arbiter.getLegalMoves('c6')).toHaveLength(0)
        expect(arbiter.getLegalMoves('d8')).toHaveLength(0)
        expect(arbiter.getLegalMoves('f8')).toHaveLength(0)
        expect(arbiter.getLegalMoves('g8')).toHaveLength(0)

        arbiter = getTestMoveArbiter('3R2k1/ppp2ppp/8/8/8/8/PPP2PPP/5RK1 b - - 0 1')
        expect(arbiter.getLegalMoves('g8')).toHaveLength(0)
        expect(arbiter.getLegalMoves('f7')).toHaveLength(0)
        expect(arbiter.getLegalMoves('g7')).toHaveLength(0)
        expect(arbiter.getLegalMoves('h7')).toHaveLength(0)

    })

    it('it determines if there are legal moves from square', () => {

        let arbiter
        arbiter = getTestMoveArbiter('rnbqkbnr/pppp2pp/2n5/4p3/4P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4')
        expect(arbiter.getLegalMoves('e8')).not.toHaveLength(0)
        expect(arbiter.getLegalMoves('c6')).not.toHaveLength(0)
        expect(arbiter.getLegalMoves('d8')).not.toHaveLength(0)
        expect(arbiter.getLegalMoves('f8')).not.toHaveLength(0)
        expect(arbiter.getLegalMoves('g8')).not.toHaveLength(0)

    })

    it('it determines if there are no legal moves for player', () => {

        let arbiter

        // smothered mate
        arbiter = getTestMoveArbiter('6rk/pp3Npp/8/8/8/8/PPP2PPP/RNBQKBNR b KQ - 0 1')
        expect(arbiter.doesPlayerHaveLegalMoves('black')).toBe(false)
        expect(arbiter.doesPlayerHaveLegalMoves('white')).toBe(true)

        // almost smothered mate
        arbiter = getTestMoveArbiter('6rk/pp4pp/6N1/8/8/8/PPP2PPP/RNBQKBNR b KQ - 0 1')
        expect(arbiter.doesPlayerHaveLegalMoves('black')).toBe(true)
        expect(arbiter.doesPlayerHaveLegalMoves('white')).toBe(true)

        // stalemate pawn + king endgame
        arbiter = getTestMoveArbiter('7k/5K1P/6P1/8/8/8/8/8 b - - 0 1')
        expect(arbiter.doesPlayerHaveLegalMoves('black')).toBe(false)
        expect(arbiter.doesPlayerHaveLegalMoves('white')).toBe(true)

    })

    it('it makes a move', () => {
        let arbiter
        arbiter = getTestMoveArbiter('rn2k2r/ppp2ppp/5n2/2b5/4P1Nq/5P1P/PPP1B1P1/RNBQK2R w KQkq - 0 1')

        const madeMove = arbiter.makeMove(new ChessMove(
            'g4',
            'f6',
            Piece.knightWhite(),
            Piece.knightBlack()
        ))

        expect(madeMove.fenAfter.piecePlacements).toEqual('rn2k2r/ppp2ppp/5N2/2b5/4P2q/5P1P/PPP1B1P1/RNBQK2R')
        expect(madeMove.fenAfter.sideToMove).toEqual('black')
        expect(madeMove.halfStepIndex).toEqual(1)
        expect(arbiter.fenNumber.piecePlacements).toEqual('rn2k2r/ppp2ppp/5N2/2b5/4P2q/5P1P/PPP1B1P1/RNBQK2R')
        expect(arbiter.fenNumber.sideToMove).toEqual('black')
        expect(madeMove.halfStepIndex).toEqual(1)
    })

    it('it unmakes a move', () => {
        let arbiter
        arbiter = getTestMoveArbiter('rn2k2r/ppp2ppp/5N2/2b5/4P2q/5P1P/PPP1B1P1/RNBQK2R b KQkq - 0 1')

        const fenBefore = new ExtendedFEN('rn2k2r/ppp2ppp/5n2/2b5/4P1Nq/5P1P/PPP1B1P1/RNBQK2R w KQkq - 0 1');
        arbiter.unMakeMove(new ChessMove(
            'g4',
            'f6',
            Piece.knightWhite(),
            Piece.knightBlack()
        ), fenBefore)

        expect(arbiter.fenNumber).toEqual(fenBefore)
        expect(arbiter.squares64.get('f6').piece).toEqual(Piece.knightBlack())

    })

})
