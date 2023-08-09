import { describe, it, expect } from 'vitest'
import {Squares144} from "@/classes/Chess/Position/Squares144";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {Squares64} from "@/classes/Chess/Position/Squares64";
import {Piece} from "@/classes/Chess/Piece";
import {Square} from "@/classes/Chess/Square/Square";

describe('Squares144', () => {

    it('it constructs itself', () => {

        const fenNumber = new ExtendedFen('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const squares144 = new Squares144(fenNumber)

        // fenNumber should be cloned
        expect(squares144.fenNumber).toEqual(fenNumber)
        expect(squares144.fenNumber).not.toBe(fenNumber)

        // squares 64 created
        expect(squares144).toHaveProperty('squares64')
        expect(squares144.squares64).toBeInstanceOf(Squares64)

    })
    it('it constructs itself from string fen', () => {

        const squares144 = new Squares144('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')

        // fenNumber object created
        expect(squares144.fenNumber).toBeInstanceOf(ExtendedFen)

        // squares 64 created
        expect(squares144).toHaveProperty('squares64')
        expect(squares144.squares64).toBeInstanceOf(Squares64)

    })

    it('it calculates out-of-bounds indexes',() =>{

        let j = 0;

        const assertNextSquaresAre = function(count: number, isOutOfBounds: boolean){
            let i;
            for(i = j; i < j+count; i++){
                expect(Squares144.isIndexOutOfBounds(i)).toEqual(isOutOfBounds)
            }
            j = i
        }

        assertNextSquaresAre(26, true)
        for(let n=0;n<8;n++){
            assertNextSquaresAre(8, false) // rank 8
            assertNextSquaresAre(4, true)
        }
        assertNextSquaresAre(22, true)
    })

    it('it gets indexes by square type',()=>{

        expect(Squares144.getIndex('e4')).toEqual(78)
        expect(Squares144.getIndex('c7')).toEqual(40)
        expect(Squares144.getIndex('f1')).toEqual(115)
        expect(Squares144.getIndex('a8')).toEqual(26)

        expect(Squares144.getIndex('h7')).toEqual(45)
        expect(Squares144.getIndex('b7')).toEqual(39)
        expect(Squares144.getIndex('h1')).toEqual(117)
        expect(Squares144.getIndex('c1')).toEqual(112)

        expect(Squares144.getIndex('h5')).toEqual(69)
        expect(Squares144.getIndex('g4')).toEqual(80)
        expect(Squares144.getIndex('e8')).toEqual(30)
        expect(Squares144.getIndex('a2')).toEqual(98)
    })


    it('it gets a square',() => {

        const fenNumber = new ExtendedFen('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const squares144 = new Squares144(fenNumber)

        expect(squares144.getSquare('e4'))
            .toBe(squares144.squares64.get('e4'))

    })

    it('it sets a piece',() => {
        const squares144 = new Squares144('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')

        const king = Piece.kingWhite();
        squares144.setPiece('e4',king)

        expect(squares144.squares64.squares['e4'].piece).toBe(king)
    })

    it('it determines if a square is adjacent to another', () => {
        const squares144 = new Squares144('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')

        // samples
        expect(squares144.isSquareAdjacent('e3','e4')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','f4')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','f3')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','f2')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','f1')).toBe(false)
        expect(squares144.isSquareAdjacent('e3','e2')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','e1')).toBe(false)
        expect(squares144.isSquareAdjacent('e3','d2')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','d3')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','d4')).toBe(true)
        expect(squares144.isSquareAdjacent('e3','a3')).toBe(false)
        expect(squares144.isSquareAdjacent('e3','b8')).toBe(false)

        // test same square edge case
        expect(squares144.isSquareAdjacent('a1','a1')).toBe(false)

        // test squares passed as objects
        expect(squares144.isSquareAdjacent(
            new Square('g3'),
            new Square('h2')
        )).toBe(true)

    })

})