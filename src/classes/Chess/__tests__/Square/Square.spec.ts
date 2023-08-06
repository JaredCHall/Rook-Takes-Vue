import { describe, it, expect } from 'vitest'
import {Square} from "@/classes/Chess/Square/Square";
import {Piece} from "@/classes/Chess/Piece";
import {SquareCoordinates} from "@/classes/Chess/Square/SquareCoordinates";


describe('Square', () => {
    it('it gets coordinates by square name', () => {

        const a1 = Square.getCoordinates('a1')
        expect(a1.white.column).toEqual(0)
        expect(a1.white.row).toEqual(7)
        expect(a1.black.column).toEqual(7)
        expect(a1.black.row).toEqual(0)

        const e4 = Square.getCoordinates('e4')
        expect(e4.white.column).toEqual(4)
        expect(e4.white.row).toEqual(4)
        expect(e4.black.column).toEqual(3)
        expect(e4.black.row).toEqual(3)

        const h5 = Square.getCoordinates('h5')
        expect(h5.white.column).toEqual(7)
        expect(h5.white.row).toEqual(3)
        expect(h5.black.column).toEqual(0)
        expect(h5.black.row).toEqual(4)
    })

    it('it constructs itself', () => {


        const f3 = new Square('f3')

        expect(f3.name).toEqual('f3')
        expect(f3.color).toEqual('white')
        expect(f3.rank).toEqual(3)
        expect(f3.file).toEqual('f')
        expect(f3.index144).toEqual(91)
        expect(f3.piece).toBeNull()
        expect(f3.coordinatesWhite).toBeInstanceOf(SquareCoordinates)
        expect(f3.coordinatesBlack).toBeInstanceOf(SquareCoordinates)
    })

    it('it sets piece', () => {

        const f3 = new Square('f3')
        expect(f3.piece).toBeNull()

        f3.setPiece(Piece.knightWhite());
        expect(f3.piece).toBeInstanceOf(Piece)

        f3.setPiece(null)
        expect(f3.piece).toBeNull()
    })

    it('it gets piece', () => {

        const d3 = new Square('f3')
        expect(d3.getPiece()).toBeNull()

        const h8 = new Square('h8', Piece.rookBlack())
        expect(h8.getPiece()).toBeInstanceOf(Piece)
    })

})