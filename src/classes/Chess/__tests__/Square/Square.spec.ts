import { describe, it, expect } from 'vitest'
import {Square} from "@/classes/Chess/Square/Square";
import {Piece} from "@/classes/Chess/Piece";
import {SquareCoordinates} from "@/classes/Chess/Square/SquareCoordinates";


describe('Square', () => {
    it('it gets coordinates by square name', () => {


        const a1 = Square.getCoordinates('a1')

        expect(a1).toHaveProperty('white.column',0)
        expect(a1).toHaveProperty('white.row',7)
        expect(a1).toHaveProperty('black.column',7)
        expect(a1).toHaveProperty('black.row',0)

        const e4 = Square.getCoordinates('e4')

        expect(e4).toHaveProperty('white.column',4)
        expect(e4).toHaveProperty('white.row',4)
        expect(e4).toHaveProperty('black.column',3)
        expect(e4).toHaveProperty('black.row',3)

        const h5 = Square.getCoordinates('h5')

        expect(h5).toHaveProperty('white.column',7)
        expect(h5).toHaveProperty('white.row',3)
        expect(h5).toHaveProperty('black.column',0)
        expect(h5).toHaveProperty('black.row',4)
    })

    it('it constructs itself', () => {


        const f3 = new Square('f3')

        expect(f3).toHaveProperty('name','f3')
        expect(f3).toHaveProperty('color','white')
        expect(f3).toHaveProperty('rank',3)
        expect(f3).toHaveProperty('file','f')
        expect(f3).toHaveProperty('index144',91)
        expect(f3).toHaveProperty('piece',null)
        expect(f3.coordinatesWhite).toBeInstanceOf(SquareCoordinates)
        expect(f3.coordinatesBlack).toBeInstanceOf(SquareCoordinates)
    })

    it('it sets piece', () => {


        const f3 = new Square('f3')
        expect(f3).toHaveProperty('piece',null)

        f3.setPiece(Piece.knightWhite());
        expect(f3.piece).toBeInstanceOf(Piece)

        f3.setPiece(null)
        expect(f3).toHaveProperty('piece',null)
    })

    it('it gets piece', () => {

        const d3 = new Square('f3')
        expect(d3.getPiece()).toBeNull()

        const h8 = new Square('h8', Piece.rookBlack())
        expect(h8.getPiece()).toBeInstanceOf(Piece)
    })

})