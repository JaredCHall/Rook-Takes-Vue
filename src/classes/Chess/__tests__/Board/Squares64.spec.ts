import { describe, it, expect } from 'vitest'
import {Squares64} from "@/classes/Chess/Board/Squares64";
import {Piece} from "@/classes/Chess/Piece";
import {Square} from "@/classes/Chess/Square/Square";
import {ExtendedFen} from "@/classes/Chess/Board/ExtendedFEN";

describe('Squares64', () =>{

    it('it constructs itself', () => {

        const squares64 = new Squares64()

        // builds squares array property
        expect(Object.keys(squares64.squares)).toHaveLength(64)

        // spot check some individual squares

        expect(squares64.squares.a8).toBeInstanceOf(Square)
        expect(squares64.squares.a8.color).toEqual('white')
        expect(squares64.squares.a8.piece).toBeNull()
        expect(squares64.squares.h1).toBeInstanceOf(Square)
        expect(squares64.squares.h1.color).toEqual('white')
        expect(squares64.squares.a1.piece).toBeNull()

        expect(squares64.squares.d4).toBeInstanceOf(Square)
        expect(squares64.squares.d4.color).toEqual('black')
        expect(squares64.squares.d4.piece).toBeNull()
        expect(squares64.squares.e5).toBeInstanceOf(Square)
        expect(squares64.squares.e5.color).toEqual('black')
        expect(squares64.squares.e5.piece).toBeNull()




    })

    it('it constructs itself with FenNumber', () => {

        const squares = new Squares64(new ExtendedFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
        expect(squares.squares.e1.piece).toEqual(Piece.kingWhite())
        expect(squares.squares.e8.piece).toEqual(Piece.kingBlack())
    })

    it('it sets squares', () => {

        const squares64 = new Squares64()
        const a8Rook = Piece.rookBlack()
        const a1Rook = Piece.rookWhite()

        squares64.set('a8',a8Rook)
        squares64.set('b8', null)

        // a1Rook captures a8Rook
        squares64.set('a8',a1Rook)
        expect(squares64.squares['a8'].piece).toBe(a1Rook)

        // Act of god captures a1Rook
        squares64.set('a8',null)
        expect(squares64.squares['a8'].piece).toBeNull()

    })


    it('it gets a square', () => {
        const squares64 = new Squares64()
        expect(squares64.get('a2')).toBeInstanceOf(Square)

        expect(squares64.get('e5')).toBeInstanceOf(Square)
    })

    it('has correct static squaresOrder',() => {
        expect(Squares64.squaresOrder).toEqual([
            'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
            'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
            'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
            'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
            'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
            'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
            'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
            'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        ])
    })

    it('has correct static whiteSquares',() => {
        expect(Squares64.whiteSquares).toEqual([
            'a8', 'c8', 'e8', 'f8', 'b7', 'd7', 'f7', 'h7',
            'a6', 'c6', 'e6', 'f6', 'b5', 'd5', 'f5', 'h5',
            'a4', 'c4', 'e4', 'f4', 'b3', 'd3', 'f3', 'h3',
            'a2', 'c2', 'e2', 'f2', 'b1', 'd1', 'f1', 'h1',
        ])
    })

    it.each([
        'black',
        'white',
    ])('tracks the %s kings square', (color) => {
        const squares64 = new Squares64()
        const king = new Piece('king',color)

        squares64.set('e1',king)
        let actual = squares64.getKingSquare(color)

        expect(actual.piece).toBe(king)
        expect(actual.name).toEqual('e1')


        squares64.set('e2',king)
        actual = squares64.getKingSquare(color)

        expect(actual.piece).toBe(king)
        expect(actual.name).toEqual('e2')

    })

    it('get all pieces of a color/type', () => {
        const squares64 = new Squares64()

        const blackKing = Piece.kingBlack()
        const blackQueen = Piece.queenBlack()
        const whiteKing = Piece.kingWhite()
        const whiteQueen = Piece.queenWhite()

        squares64.set('a8',blackKing)
        squares64.set('b8',blackQueen)
        squares64.set('c8',whiteKing)
        squares64.set('d8',whiteQueen)

        expect(squares64.getPieceSquares('black')).toEqual([
            new Square('a8', blackKing),
            new Square('b8', blackQueen)
        ])

        expect(squares64.getPieceSquares('white')).toEqual([
            new Square('c8', whiteKing),
            new Square('d8', whiteQueen)
        ])

        squares64.set('e8', blackQueen)
        squares64.set('f8', whiteQueen)


        expect(squares64.getPieceSquares('black','king')).toEqual([
            new Square('a8', blackKing),
        ])

        expect(squares64.getPieceSquares('black','queen')).toEqual([
            new Square('b8', blackQueen),
            new Square('e8', blackQueen)
        ])

        expect(squares64.getPieceSquares('white','king')).toEqual([
            new Square('c8', whiteKing),
        ])

        expect(squares64.getPieceSquares('white','queen')).toEqual([
            new Square('d8', whiteQueen),
            new Square('f8', whiteQueen)
        ])

    })

})
