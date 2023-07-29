import { describe, it, expect, vi } from 'vitest'

import FenNumber from "@/classes/Chess/Board/FenNumber";
import Piece from "@/classes/Chess/Piece/Piece";


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
        expect(FenNumber.getPieceType('p')).toEqual('pawn')
        expect(FenNumber.getPieceType('P')).toEqual('pawn')
        expect(FenNumber.getPieceType('R')).toEqual('rook')
        expect(FenNumber.getPieceType('r')).toEqual('rook')
        expect(FenNumber.getPieceType('n')).toEqual('knight')
        expect(FenNumber.getPieceType('N')).toEqual('knight')
        expect(FenNumber.getPieceType('B')).toEqual('bishop')
        expect(FenNumber.getPieceType('b')).toEqual('bishop')
        expect(FenNumber.getPieceType('q')).toEqual('queen')
        expect(FenNumber.getPieceType('Q')).toEqual('queen')
        expect(FenNumber.getPieceType('k')).toEqual('king')
        expect(FenNumber.getPieceType('K')).toEqual('king')

        expect(() => FenNumber.getPieceType('Z')).toThrowError('Invalid piece type')

    })

    it('it serializes to Squares64', () => {
        const gameOfTheCentury = new FenNumber('1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42 1 1')
        const squares64 = gameOfTheCentury.toSquares64()

        expect(Object.keys(squares64.squares)).toHaveLength(64)

        expect(squares64).toHaveProperty('squares.b8.piece.type','queen')
        expect(squares64).toHaveProperty('squares.b8.piece.color','white')

        expect(squares64).toHaveProperty('squares.f7.piece.type','pawn')
        expect(squares64).toHaveProperty('squares.f7.piece.color','black')

        expect(squares64).toHaveProperty('squares.g7.piece.type','king')
        expect(squares64).toHaveProperty('squares.g7.piece.color','black')

        expect(squares64).toHaveProperty('squares.e5.piece.type','knight')
        expect(squares64).toHaveProperty('squares.e5.piece.color','white')

        expect(squares64).toHaveProperty('squares.c3.piece.type','knight')
        expect(squares64).toHaveProperty('squares.c3.piece.color','black')

        expect(squares64).toHaveProperty('squares.c2.piece.type','rook')
        expect(squares64).toHaveProperty('squares.c2.piece.color','black')

        expect(squares64).toHaveProperty('squares.c1.piece.type','king')
        expect(squares64).toHaveProperty('squares.c1.piece.color','white')
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

})