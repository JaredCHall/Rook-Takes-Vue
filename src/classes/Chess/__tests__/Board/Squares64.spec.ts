import { describe, it, expect, vi } from 'vitest'
import Squares64 from "@/classes/Chess/Board/Squares64";
import PieceList from "@/classes/Chess/Board/PieceList";
import Piece from "@/classes/Chess/Piece";
import Square from "@/classes/Chess/Square/Square";

vi.mock('@/classes/Chess/Board/PieceList')

describe('Squares64', () =>{

    it('it constructs itself', () => {

        const squares64 = new Squares64()

        // inits pieceList
        expect(PieceList).toHaveBeenCalledOnce()
        expect(squares64.pieceList).toBeInstanceOf(PieceList)
        expect(squares64.pieceList.add).not.toHaveBeenCalledOnce()
        expect(squares64.pieceList.remove).not.toHaveBeenCalledOnce()

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

    it('it sets squares', () => {

        const squares64 = new Squares64()
        const a8Rook = new Piece('rook','black','a8')
        const a1Rook = new Piece('rook','white','a1')

        squares64.set('a8',a8Rook)
        squares64.set('b8', null)

        vi.clearAllMocks()

        // a1Rook captures a8Rook
        squares64.set('a8',a1Rook)
        expect(squares64.squares['a8'].piece).toBe(a1Rook)
        expect(squares64.pieceList.add).not.toHaveBeenCalledOnce()
        expect(squares64.pieceList.remove).toHaveBeenCalledWith(a8Rook)

        // Act of god captures a1Rook
        vi.clearAllMocks()
        squares64.set('a8',null)
        expect(squares64.squares['a8'].piece).toBeNull()
        expect(squares64.pieceList.add).not.toHaveBeenCalledOnce()
        expect(squares64.pieceList.remove).toHaveBeenCalledWith(a1Rook)

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

})
