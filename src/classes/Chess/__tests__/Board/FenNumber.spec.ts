import { describe, it, expect, vi } from 'vitest'

import FenNumber from "@/classes/Chess/Board/FenNumber";
import Piece from "@/classes/Chess/Piece";
import ChessMove from "@/classes/Chess/Moves/ChessMove";
import DoublePawnMove from "@/classes/Chess/Moves/DoublePawnMove";
import CastlingMove from "@/classes/Chess/Moves/CastlingMove";


describe('FenNumber', () => {

    it('it constructs itself', () => {

        const evergreenGame = new FenNumber('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1 b kq e4 22 40')

        expect(evergreenGame).toHaveProperty('piecePlacements','r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1')
        expect(evergreenGame).toHaveProperty('sideToMove','black')
        expect(evergreenGame).toHaveProperty('castleRights','kq')
        expect(evergreenGame).toHaveProperty('enPassantTarget','e4')
        expect(evergreenGame).toHaveProperty('halfMoveClock',22)
        expect(evergreenGame).toHaveProperty('fullMoveCounter',40)
        expect(evergreenGame).toHaveProperty('isCheck',false)
        expect(evergreenGame).toHaveProperty('isMate',false)

        const operaGame = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w - - - - 1 1')

        expect(operaGame).toHaveProperty('piecePlacements','r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR')
        expect(operaGame).toHaveProperty('sideToMove','white')
        expect(operaGame).toHaveProperty('castleRights',null)
        expect(operaGame).toHaveProperty('enPassantTarget',null)
        expect(operaGame).toHaveProperty('halfMoveClock',0)
        expect(operaGame).toHaveProperty('fullMoveCounter',1)
        expect(operaGame).toHaveProperty('isCheck',true)
        expect(operaGame).toHaveProperty('isMate',true)

        const immortalGame = new FenNumber('rnbqkb1r/pppp1Qpp/2n4n/4P3/2B5/8/PPP2PPP/RNBK1BNR b kq - 0 1')

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
        expect(FenNumber.makePiece('p')).toEqual(new Piece('pawn','black'))
        expect(FenNumber.makePiece('P')).toEqual(new Piece('pawn','white'))
        expect(FenNumber.makePiece('r')).toEqual(new Piece('rook','black'))
        expect(FenNumber.makePiece('R')).toEqual(new Piece('rook','white'))
        expect(FenNumber.makePiece('n')).toEqual(new Piece('knight','black'))
        expect(FenNumber.makePiece('N')).toEqual(new Piece('knight','white'))
        expect(FenNumber.makePiece('b')).toEqual(new Piece('bishop','black'))
        expect(FenNumber.makePiece('B')).toEqual(new Piece('bishop','white'))
        expect(FenNumber.makePiece('q')).toEqual(new Piece('queen','black'))
        expect(FenNumber.makePiece('Q')).toEqual(new Piece('queen','white'))
        expect(FenNumber.makePiece('k')).toEqual(new Piece('king','black'))
        expect(FenNumber.makePiece('K')).toEqual(new Piece('king','white'))

        expect(() => FenNumber.makePiece('Z')).toThrowError('Invalid piece type')

    })

    it('it stringifies itself', () => {
        const gameOfTheCentury = new FenNumber('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42 1 1')
        expect(gameOfTheCentury.toString()).toEqual('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42 1 1')

        const operaGame = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w KQkq e4')
        expect(operaGame.toString()).toEqual('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w KQkq e4 0 1 0 0')
    })

    it('it clones itself', () => {
        const evergreenGame = new FenNumber('r2q1rk1/ppp2ppp/2np4/2b1p1B1/2B1P1n1/2NP1N2/PPP2PPP/R2Q1RK1 b kq e4 22 40')
        const clone = evergreenGame.clone()

        expect(clone).toEqual(evergreenGame)
        expect(clone).not.toBe(evergreenGame)
    })

    it('it increments turn', () => {
        const gameFen = new FenNumber('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

        // 1. e4
        gameFen.incrementTurn(new DoublePawnMove('e2','e4', new Piece('pawn','white')))
        expect(gameFen.piecePlacements).toEqual(undefined)
        expect(gameFen.enPassantTarget).toEqual('e3')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.sideToMove).toEqual('black')
        expect(gameFen.halfMoveClock).toEqual(0)
        expect(gameFen.fullMoveCounter).toEqual(1)

        // 1. ... e5
        gameFen.incrementTurn(new DoublePawnMove('e7','e5', new Piece('pawn','black')))
        expect(gameFen.enPassantTarget).toEqual('e6')
        expect(gameFen.sideToMove).toEqual('white')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(0)
        expect(gameFen.fullMoveCounter).toEqual(2)

        // 2. Bb5
        gameFen.incrementTurn(new ChessMove('f1','b5', new Piece('bishop','white')))
        expect(gameFen.enPassantTarget).toBeNull()
        expect(gameFen.sideToMove).toEqual('black')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(1)
        expect(gameFen.fullMoveCounter).toEqual(2)

        // 2. ... Bb4
        gameFen.incrementTurn(new ChessMove('f8','b4', new Piece('bishop','black')))
        expect(gameFen.enPassantTarget).toBeNull()
        expect(gameFen.sideToMove).toEqual('white')
        expect(gameFen.castleRights).toEqual('KQkq')
        expect(gameFen.halfMoveClock).toEqual(2)
        expect(gameFen.fullMoveCounter).toEqual(3)

    })

    it('it revokes castleRights when incrementing turn', () => {
        let gameFen

        const getTestFen = () => {
            return new FenNumber('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
        }

        // white long castles
        expect(getTestFen().incrementTurn(
            new CastlingMove(
                'e1',
                'c1',
                new Piece('king','white'),
                new Piece('rook','white'),
                'Q'
            )
        ).castleRights).toEqual('kq')

        // white short castles
        expect(getTestFen().incrementTurn(
            new CastlingMove(
                'e1',
                'g1',
                new Piece('king','white'),
                new Piece('rook','white'),
                'K'
            )
        ).castleRights).toEqual('kq')


        // black long castles
        expect(getTestFen().incrementTurn(new CastlingMove(
            'e8',
            'c8',
            new Piece('king','black'),
            new Piece('rook','black'),
            'q'
        )).castleRights).toEqual('KQ')

        // black short castles
        expect(getTestFen().incrementTurn(new CastlingMove(
            'e8',
            'g8',
            new Piece('king','black'),
            new Piece('rook','black'),
            'k'
        )).castleRights).toEqual('KQ')

        // white moves their king
        expect(getTestFen().incrementTurn(new ChessMove(
            'e1',
            'e2',
            new Piece('king','white'),
        )).castleRights).toEqual('kq')

        // white moves their king-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h1',
            'h2',
            new Piece('rook','white'),
        )).castleRights).toEqual('Qkq')

        // white moves their queen-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a1',
            'b1',
            new Piece('rook','white'),
        )).castleRights).toEqual('Kkq')

        // black moves their king
        expect(getTestFen().incrementTurn(new ChessMove(
            'e8',
            'e7',
            new Piece('king','black'),
        )).castleRights).toEqual('KQ')

        // black moves their king-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h8',
            'h7',
            new Piece('rook','black'),
        )).castleRights).toEqual('KQq')

        // black moves their queen-side rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a8',
            'a7',
            new Piece('rook','black'),
        )).castleRights).toEqual('KQk')

        // black takes whites h rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'h8',
            'h1',
            new Piece('rook','black'),
            new Piece('rook','white'),
        )).castleRights).toEqual('Qq')

        // white takes blacks a rook
        expect(getTestFen().incrementTurn(new ChessMove(
            'a1',
            'a8',
            new Piece('rook','white'),
            new Piece('rook','black'),
        )).castleRights).toEqual('Kk')

    })

})