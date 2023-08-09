import { describe, it, expect } from 'vitest'
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {Piece} from "@/classes/Chess/Piece";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {DoublePawnMove} from "@/classes/Chess/Move/MoveType/DoublePawnMove";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import {Squares64} from "@/classes/Chess/Position/Squares64";

describe('ExtendedFEN', () => {

    it('it constructs itself', () => {

        const evergreenGame = new ExtendedFen('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1 b kq e4 22 40')

        expect(evergreenGame).toHaveProperty('piecePlacements','r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1')
        expect(evergreenGame).toHaveProperty('sideToMove','black')
        expect(evergreenGame).toHaveProperty('castleRights','kq')
        expect(evergreenGame).toHaveProperty('enPassantTarget','e4')
        expect(evergreenGame).toHaveProperty('halfMoveClock',22)
        expect(evergreenGame).toHaveProperty('fullMoveCounter',40)
        expect(evergreenGame).toHaveProperty('isCheck',false)
        expect(evergreenGame).toHaveProperty('isMate',false)

        const operaGame = new ExtendedFen('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w - - - - 1 1')

        expect(operaGame).toHaveProperty('piecePlacements','r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR')
        expect(operaGame).toHaveProperty('sideToMove','white')
        expect(operaGame).toHaveProperty('castleRights',null)
        expect(operaGame).toHaveProperty('enPassantTarget',null)
        expect(operaGame).toHaveProperty('halfMoveClock',0)
        expect(operaGame).toHaveProperty('fullMoveCounter',1)
        expect(operaGame).toHaveProperty('isCheck',true)
        expect(operaGame).toHaveProperty('isMate',true)

        const immortalGame = new ExtendedFen('rnbqkb1r/pppp1Qpp/2n4n/4P3/2B5/8/PPP2PPP/RNBK1BNR b kq - 0 1')

        expect(immortalGame).toHaveProperty('piecePlacements','rnbqkb1r/pppp1Qpp/2n4n/4P3/2B5/8/PPP2PPP/RNBK1BNR')
        expect(immortalGame).toHaveProperty('sideToMove','black')
        expect(immortalGame).toHaveProperty('castleRights','kq')
        expect(immortalGame).toHaveProperty('enPassantTarget',null)
        expect(immortalGame).toHaveProperty('halfMoveClock',0)
        expect(immortalGame).toHaveProperty('fullMoveCounter',1)
        expect(immortalGame).toHaveProperty('isCheck',false)
        expect(immortalGame).toHaveProperty('isMate',false)

    })

    it('it gets piece type', () => {
        expect(ExtendedFen.makePiece('p')).toEqual(Piece.pawnBlack())
        expect(ExtendedFen.makePiece('P')).toEqual(Piece.pawnWhite())
        expect(ExtendedFen.makePiece('r')).toEqual(Piece.rookBlack())
        expect(ExtendedFen.makePiece('R')).toEqual(Piece.rookWhite())
        expect(ExtendedFen.makePiece('n')).toEqual(Piece.knightBlack())
        expect(ExtendedFen.makePiece('N')).toEqual(Piece.knightWhite())
        expect(ExtendedFen.makePiece('b')).toEqual(Piece.bishopBlack())
        expect(ExtendedFen.makePiece('B')).toEqual(Piece.bishopWhite())
        expect(ExtendedFen.makePiece('q')).toEqual(Piece.queenBlack())
        expect(ExtendedFen.makePiece('Q')).toEqual(Piece.queenWhite())
        expect(ExtendedFen.makePiece('k')).toEqual(Piece.kingBlack())
        expect(ExtendedFen.makePiece('K')).toEqual(Piece.kingWhite())

        expect(() => ExtendedFen.makePiece('Z')).toThrowError('Invalid piece type')

    })

    it('it stringifies itself', () => {
        const gameOfTheCentury = new ExtendedFen('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42')
        expect(gameOfTheCentury.toString()).toEqual('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42')

        const operaGame = new ExtendedFen('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w KQkq e4 0 1 0 1 -')
        expect(operaGame.toString(true,true))
            .toEqual('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w KQkq e4 0 1 0 1 0')
    })

    it('it updates moveResult', () => {
        const gameOfTheCentury = new ExtendedFen('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42')
        gameOfTheCentury.updateMoveResult(true,true)
        expect(gameOfTheCentury.isCheck).toBe(true)
        expect(gameOfTheCentury.isMate).toBe(true)
        expect(gameOfTheCentury.isStalemate).toBe(false)

        gameOfTheCentury.updateMoveResult(true,false)
        expect(gameOfTheCentury.isCheck).toBe(true)
        expect(gameOfTheCentury.isMate).toBe(false)
        expect(gameOfTheCentury.isStalemate).toBe(false)

        gameOfTheCentury.updateMoveResult(false,false)
        expect(gameOfTheCentury.isCheck).toBe(false)
        expect(gameOfTheCentury.isMate).toBe(false)
        expect(gameOfTheCentury.isStalemate).toBe(false)

        gameOfTheCentury.updateMoveResult(false,true)
        expect(gameOfTheCentury.isCheck).toBe(false)
        expect(gameOfTheCentury.isMate).toBe(false)
        expect(gameOfTheCentury.isStalemate).toBe(true)

    })


    it('it clones itself', () => {
        const evergreenGame = new ExtendedFen('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1 b kq e4 22 40')
        const clone = evergreenGame.clone()

        expect(clone).toEqual(evergreenGame)
        expect(clone).not.toBe(evergreenGame)
    })

    it('it increments turn', () => {
        const gameFen = new ExtendedFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        const squares64 = new Squares64(new ExtendedFen('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1'))

        // 1. e4
        gameFen.incrementTurn(new DoublePawnMove('e2','e4', Piece.pawnWhite()), squares64)
        expect(gameFen.piecePlacements).toEqual('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1')
        expect(gameFen.enPassantTarget).toEqual('e3')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.sideToMove).toEqual('black')
        expect(gameFen.halfMoveClock).toEqual(0)
        expect(gameFen.fullMoveCounter).toEqual(1)

        // 1. ... e5
        gameFen.incrementTurn(new DoublePawnMove('e7','e5', Piece.pawnBlack()), squares64)
        expect(gameFen.enPassantTarget).toEqual('e6')
        expect(gameFen.sideToMove).toEqual('white')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(0)
        expect(gameFen.fullMoveCounter).toEqual(2)

        // 2. Bb5
        gameFen.incrementTurn(new ChessMove('f1','b5', Piece.bishopWhite()), squares64)
        expect(gameFen.enPassantTarget).toBeNull()
        expect(gameFen.sideToMove).toEqual('black')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(1)
        expect(gameFen.fullMoveCounter).toEqual(2)

        // 2. ... Bb4
        gameFen.incrementTurn(new ChessMove('f8','b4', Piece.bishopBlack()), squares64)
        expect(gameFen.enPassantTarget).toBeNull()
        expect(gameFen.sideToMove).toEqual('white')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(2)
        expect(gameFen.fullMoveCounter).toEqual(3)

        // check position with no castle rights
        const gameFen2 = new ExtendedFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1')
        gameFen2.incrementTurn(new DoublePawnMove('e2','e4', Piece.pawnWhite()), squares64)
        expect(gameFen2.enPassantTarget).toEqual('e3')
        expect(gameFen2.castleRights).toEqual(null)
        expect(gameFen2.sideToMove).toEqual('black')
        expect(gameFen2.halfMoveClock).toEqual(0)
        expect(gameFen2.fullMoveCounter).toEqual(1)

    })

    it('it revokes castleRights when incrementing turn', () => {

        const squares64 = new Squares64(new ExtendedFen('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1'))

        let gameFen
        const getTestFen = () => {
            return new ExtendedFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
        }

        //


        // white long castles
        expect(getTestFen().incrementTurn(
            new CastlingMove(
                'e1',
                'c1',
                Piece.kingWhite(),
                Piece.rookWhite(),
                'Q'
            ), squares64
        ).castleRights).toEqual('kq')

        // white short castles
        expect(getTestFen().incrementTurn(
            new CastlingMove(
                'e1',
                'g1',
                Piece.kingWhite(),
                Piece.rookWhite(),
                'K'
            ), squares64
        ).castleRights).toEqual('kq')


        // black long castles
        expect(getTestFen().incrementTurn(
            new CastlingMove(
                'e8',
                'c8',
                Piece.kingBlack(),
                Piece.rookBlack(),
                'q'
            ), squares64
        ).castleRights).toEqual('KQ')

        // black short castles
        expect(getTestFen().incrementTurn(new CastlingMove(
            'e8',
            'g8',
            Piece.kingBlack(),
            Piece.rookBlack(),
            'k'
        ), squares64).castleRights).toEqual('KQ')

        // white moves their king
        expect(getTestFen().incrementTurn(new ChessMove(
            'e1',
            'e2',
            Piece.kingWhite(),
        ), squares64).castleRights).toEqual('kq')

        // white moves their king-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h1',
            'h2',
            Piece.rookWhite(),
        ), squares64).castleRights).toEqual('Qkq')

        // white moves their queen-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a1',
            'b1',
            Piece.rookWhite(),
        ), squares64).castleRights).toEqual('Kkq')

        // black moves their king
        expect(getTestFen().incrementTurn(new ChessMove(
            'e8',
            'e7',
            Piece.kingBlack(),
        ), squares64).castleRights).toEqual('KQ')

        // black moves their king-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h8',
            'h7',
            Piece.rookBlack(),
        ), squares64).castleRights).toEqual('KQq')

        // black moves their queen-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a8',
            'a7',
            Piece.rookBlack(),
        ), squares64).castleRights).toEqual('KQk')

        // black takes whites h rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h8',
            'h1',
            Piece.rookBlack(),
            Piece.rookWhite(),
        ), squares64).castleRights).toEqual('Qq')

        // white takes blacks a rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a1',
            'a8',
            Piece.rookWhite(),
            Piece.rookBlack(),
        ), squares64).castleRights).toEqual('Kk')

    })

    it('it updates squares64' , () => {
        const fenNumber = new ExtendedFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        const squares64 = new Squares64()

        fenNumber.updateSquares64(squares64)

        expect(squares64.squares.a1.piece).toEqual(Piece.rookWhite())
        expect(squares64.squares.a8.piece).toEqual(Piece.rookBlack())
        expect(squares64.squares.d1.piece).toEqual(Piece.queenWhite())
        expect(squares64.squares.d8.piece).toEqual(Piece.queenBlack())
        expect(squares64.squares.a1.piece).toEqual(Piece.rookWhite())
        expect(squares64.squares.d4.piece).toBeNull()
        expect(squares64.squares.d5.piece).toBeNull()
        expect(squares64.squares.e4.piece).toBeNull()
        expect(squares64.squares.e5.piece).toBeNull()

        let invalidFen
        invalidFen = new ExtendedFen('rnbqkbPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(() => {invalidFen.updateSquares64(new Squares64())})
            .toThrowError('FEN piece placement must include all eight rows')

        invalidFen = new ExtendedFen('rnbqkbnr/pppppMpp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(() => {invalidFen.updateSquares64(new Squares64())})
            .toThrowError('Unrecognized position character: M')

    })

})