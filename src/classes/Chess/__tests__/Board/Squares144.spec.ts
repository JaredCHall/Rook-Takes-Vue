import { describe, it, expect, vi } from 'vitest'
import Squares144 from "@/classes/Chess/Board/Squares144";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares64 from "@/classes/Chess/Board/Squares64";
import Piece from "@/classes/Chess/Piece";

vi.mock('@/classes/Chess/Board/Squares64')

describe('Squares144', () => {

    it('it constructs itself', () => {

        const fenNumber = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const squares144 = new Squares144(fenNumber)

        // fenNumber should be cloned
        expect(squares144.fenNumber).toEqual(fenNumber)
        expect(squares144.fenNumber).not.toBe(fenNumber)

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

        const fenNumber = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const squares144 = new Squares144(fenNumber)

        squares144.getSquare('e4')
        expect(squares144.squares64.get).toHaveBeenCalledWith('e4')

    })

    it('it sets a piece',() => {

        const fenNumber = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const squares144 = new Squares144(fenNumber)

        vi.clearAllMocks()

        const king = new Piece('king','white','e4');
        squares144.setPiece('e4',king)

        expect(squares144.squares64.set).toHaveBeenCalledWith('e4',king)

    })

})