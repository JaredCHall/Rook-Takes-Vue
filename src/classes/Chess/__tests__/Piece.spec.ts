import {describe, it, expect} from 'vitest'
import {Piece} from "@/classes/Chess/Piece";

describe('Piece', () => {
    it('it constructs itself', () => {

        const piece = new Piece('king', 'white')

        expect(piece).toBeInstanceOf(Piece)
        expect(piece.color).toEqual('white')
        expect(piece.type).toEqual('king')

    })

    it('it makes all piece types', () => {

        expect(Piece.pawnWhite()).toEqual(new Piece('pawn', 'white'))
        expect(Piece.pawnBlack()).toEqual(new Piece('pawn', 'black'))

        expect(Piece.rookWhite()).toEqual(new Piece('rook', 'white'));
        expect(Piece.rookBlack()).toEqual(new Piece('rook', 'black'));

        expect(Piece.knightWhite()).toEqual(new Piece('knight', 'white'));
        expect(Piece.knightBlack()).toEqual(new Piece('knight', 'black'));

        expect(Piece.bishopWhite()).toEqual(new Piece('bishop', 'white'));
        expect(Piece.bishopBlack()).toEqual(new Piece('bishop', 'black'));

        expect(Piece.queenWhite()).toEqual(new Piece('queen', 'white'));
        expect(Piece.queenBlack()).toEqual(new Piece('queen', 'black'));

        expect(Piece.kingWhite()).toEqual(new Piece('king', 'white'));
        expect(Piece.kingBlack()).toEqual(new Piece('king', 'black'));

    })


})
