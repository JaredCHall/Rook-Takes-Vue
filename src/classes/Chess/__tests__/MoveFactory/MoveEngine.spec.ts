import { describe, it, expect, vi } from 'vitest'

import Squares144 from "@/classes/Chess/Board/Squares144";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import Piece from "@/classes/Chess/Piece";
import DoublePawnMove from "@/classes/Chess/Move/MoveType/DoublePawnMove";
import PawnPromotionMove from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import EnPassantMove from "@/classes/Chess/Move/MoveType/EnPassantMove";


describe('MoveEngine', () => {
    it('it constructs itself', () => {
        const squares144 = new Squares144('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const moveEngine = new MoveEngine(squares144)

        expect(moveEngine.squares144).toBe(squares144)
    })

    it('it gets pawn moves', (color, square, expected) => {

        const squares144 = new Squares144('1P6/p2p1ppp/4PP2/6P1/2p5/3pp3/P1PP1P1P/5p2');
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        // pawns calculate in N, NE, NW or S, SW, SE order depending on color

        let moves = getEngineMoves('a2')
        expect(moves).toEqual(['a3','a4'])

        moves = getEngineMoves('a7')
        expect(moves).toEqual(['a6','a5'])

        moves = getEngineMoves('b8')
        expect(moves).toEqual([])

        moves = getEngineMoves('c2')
        expect(moves).toEqual(['c3', 'd3'])

        moves = getEngineMoves('c4')
        expect(moves).toEqual(['c3'])

        moves = getEngineMoves('d2')
        expect(moves).toEqual(['e3'])

        moves = getEngineMoves('d3')
        expect(moves).toEqual(['c2'])

        moves = getEngineMoves('e3')
        expect(moves).toEqual(['e2','d2','f2'])

        moves = getEngineMoves('e6')
        expect(moves).toEqual(['e7', 'f7','d7'])

        moves = getEngineMoves('f1')
        expect(moves).toEqual([])

        moves = getEngineMoves('f6')
        expect(moves).toEqual(['g7'])

        moves = getEngineMoves('f7')
        expect(moves).toEqual(['e6'])

        moves = getEngineMoves('g5')
        expect(moves).toEqual(['g6'])

        moves = getEngineMoves('g7')
        expect(moves).toEqual(['g6', 'f6'])

        moves = getEngineMoves('h2')
        expect(moves).toEqual(['h3','h4'])

        moves = getEngineMoves('h7')
        expect(moves).toEqual(['h6','h5'])

    })

    it('it gets double pawn moves', () => {
        const squares144 = new Squares144('1P6/p4ppp/4PP2/6P1/2p5/3pp3/P1PP3P/5p2 w');
        const moveEngine = new MoveEngine(squares144)

        let moves = moveEngine.getPseudoLegalMoves('a2').moves
        expect(moves[1]).toBeInstanceOf(DoublePawnMove)

        moves = moveEngine.getPseudoLegalMoves('a7').moves
        expect(moves[1]).toBeInstanceOf(DoublePawnMove)

        moves = moveEngine.getPseudoLegalMoves('h2').moves
        expect(moves[1]).toBeInstanceOf(DoublePawnMove)

        moves = moveEngine.getPseudoLegalMoves('h7').moves
        expect(moves[1]).toBeInstanceOf(DoublePawnMove)
    })

    it('it gets pawn promotion pawn moves', () => {
        const squares144 = new Squares144('8/4P3/8/8/8/8/1p6/8');
        const moveEngine = new MoveEngine(squares144)

        let moves = moveEngine.getPseudoLegalMoves('b2').moves
        expect(moves[0]).toBeInstanceOf(PawnPromotionMove)

        moves = moveEngine.getPseudoLegalMoves('e7').moves
        expect(moves[0]).toBeInstanceOf(PawnPromotionMove)
    })

    it('it gets en passant pawn moves', () => {
        const squares144 = new Squares144('8/8/8/5pP1/3Pp3/8/8/8 w - d3 0 1');
        const moveEngine = new MoveEngine(squares144)

        let moves = moveEngine.getPseudoLegalMoves('e4','d3').moves
        expect(moves[1]).toBeInstanceOf(EnPassantMove)
        expect(moves[1].newSquare).toEqual('d3')
        expect(moves[1].capturedPiece).toEqual(new Piece('pawn','white'))
        expect(moves[1].capturedSquare).toEqual('d4')

        moves = moveEngine.getPseudoLegalMoves('g5', 'f6').moves
        expect(moves[1]).toBeInstanceOf(EnPassantMove)
        expect(moves[1].newSquare).toEqual('f6')
        expect(moves[1].capturedPiece).toEqual(new Piece('pawn','black'))
        expect(moves[1].capturedSquare).toEqual('f5')


    })

    it('it gets rooks moves', () => {
        const squares144 = new Squares144('6r1/2R5/8/3r4/4R1r1/4R3/8/R1r5')
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        // rooks calculate directions in N, E, S, W order
        expect(getEngineMoves('a1')).toEqual([
            'a2','a3','a4','a5','a6','a7','a8',
            'b1','c1'
        ])

        expect(getEngineMoves('c1')).toEqual([
            'c2','c3','c4','c5','c6','c7',
            'd1','e1','f1','g1','h1',
            'b1','a1'
        ])

        expect(getEngineMoves('c7')).toEqual([
            'c8',
            'd7','e7','f7','g7','h7',
            'c6','c5','c4','c3','c2','c1',
            'b7', 'a7',
        ])

        expect(getEngineMoves('e3')).toEqual([
            'f3','g3','h3',
            'e2','e1',
            'd3','c3','b3','a3'
        ])

        expect(getEngineMoves('g8')).toEqual([
            'h8',
            'g7','g6','g5',
            'f8','e8','d8','c8','b8','a8'
        ])

    })

    it('it gets bishop moves', () => {
        const squares144 = new Squares144('B7/1B6/8/3B4/3b4/8/1b4B1/7b')
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        // bishops calculate directions in NE, SE, SW, NW order
        expect(getEngineMoves('a8')).toEqual([])

        expect(getEngineMoves('b2')).toEqual([
            'c3','c1','a1','a3'
        ])

        expect(getEngineMoves('d5')).toEqual([
            'e6','f7','g8',
            'e4','f3',
            'c4','b3','a2',
            'c6'
        ])

        expect(getEngineMoves('h1')).toEqual(['g2'])

    })

    it('it gets knight moves', () => {
        const squares144 = new Squares144('1n4n1/3N4/5n2/3N4/4n1n1/2N5/8/7N')
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        // knights calculate directions in NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW order
        expect(getEngineMoves('c3')).toEqual([
            'e4','e2','d1','b1','a2','a4','b5'
        ])

        expect(getEngineMoves('b8')).toEqual([
            'd7','c6','a6'
        ])

        expect(getEngineMoves('f6')).toEqual([
            'h7','h5','d5','d7','e8'
        ])
    })

    it('it gets queen moves', () => {

        const squares144 = new Squares144('4QqqQ/5qq1/8/3Qq3/3qQ3/8/8/8')
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        expect(getEngineMoves('h8')).toEqual([
            'h7','h6','h5','h4','h3','h2','h1',
            'g7','g8'
        ])

        expect(getEngineMoves('g8')).toEqual([
            'h8','h7'
        ])

        expect(getEngineMoves('e5')).toEqual([
            'e6','e7','e8',
            'f6',
            'f5','g5','h5',
            'f4', 'g3', 'h2',
            'e4',
            'd5',
            'd6', 'c7', 'b8',
        ])

    })

    it('it gets king moves', () => {

        const squares144 = new Squares144('8/8/8/8/8/3Kk3/1KKKk3/1kKKk3')
        const moveEngine = new MoveEngine(squares144)

        const getEngineMoves = (square) => {
            return moveEngine.getPseudoLegalMoves(square).moves.map((move) => move.newSquare)
        }

        expect(getEngineMoves('b1')).toEqual([
            'b2','c2','c1','a1','a2'
        ])

        expect(getEngineMoves('c1')).toEqual(['b1'])

        expect(getEngineMoves('e3')).toEqual([
            'e4','f4','f3','f2','d2','d3','d4'
        ])

    })

    it('it gets castling moves', () => {

        const squares144 = new Squares144('r3k2r/8/8/8/8/8/8/R3K2R w KQkq')
        const moveEngine = new MoveEngine(squares144)
        let moves

        moves = moveEngine.getPseudoLegalMoves('e1',null,'KQkq').moves
        // white short castles
        expect(moves[5].newSquare).toEqual('g1')
        expect(moves[5].castlesType.notation).toEqual('O-O')
        // white long castles
        expect(moves[6].newSquare).toEqual('c1')
        expect(moves[6].castlesType.notation).toEqual('O-O-O')


        moves = moveEngine.getPseudoLegalMoves('e8',null,'KQkq').moves
        // black short castles
        expect(moves[5].newSquare).toEqual('g8')
        expect(moves[5].castlesType.notation).toEqual('O-O')
        // black long castles
        expect(moves[6].newSquare).toEqual('c8')
        expect(moves[6].castlesType.notation).toEqual('O-O-O')

        // no castling moves if there are no castle rights
        expect(moves = moveEngine.getPseudoLegalMoves('e1').moves).toHaveLength(5)
        expect(moves = moveEngine.getPseudoLegalMoves('e8').moves).toHaveLength(5)

    })

    it('it determines if a square is threatened', () => {
        const squares144 = new Squares144('6k1/pp4pp/8/3PnB2/3p4/8/q4PPP/1N2R1K1 b - - 1 18')
        const moveEngine = new MoveEngine(squares144)

        // test Square|string parameter
        expect(moveEngine.isSquareThreatenedBy(squares144.getSquare('e5'),'white')).toBe(true)
        // can't threaten own piece
        expect(moveEngine.isSquareThreatenedBy('e5','black')).toBe(false)
        // pawn threats
        expect(moveEngine.isSquareThreatenedBy('c5','black')).toBe(false) // can't capture backward
        expect(moveEngine.isSquareThreatenedBy('c4','white')).toBe(false)
        expect(moveEngine.isSquareThreatenedBy('e3','black')).toBe(true)
        // king threats
        expect(moveEngine.isSquareThreatenedBy('h1','white')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('h8','black')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('e6','black')).toBe(false)
        // random selections
        expect(moveEngine.isSquareThreatenedBy('g3','white')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('f1','white')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('b5','white')).toBe(false)
        expect(moveEngine.isSquareThreatenedBy('c3','black')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('c3','white')).toBe(true)
        expect(moveEngine.isSquareThreatenedBy('b5','black')).toBe(false)
        expect(moveEngine.isSquareThreatenedBy('b1','black')).toBe(true)

    })

    it('it only gets pseudo-legal moves for squares that have a piece',() => {
        const squares144 = new Squares144('r4rk1/pp3ppp/8/3PnB2/3p4/8/q4PPP/1N2R1K1 b - - 1 18')
        const moveEngine = new MoveEngine(squares144)

        expect(() => moveEngine.getPseudoLegalMoves('f1')).toThrowError('No piece on square f1')
    })
})
