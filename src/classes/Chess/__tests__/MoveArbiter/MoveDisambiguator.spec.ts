import { describe, it, expect, vi } from 'vitest'
import {MoveDisambiguator} from "@/classes/Chess/MoveArbiter/MoveDisambiguator";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {Squares144} from "@/classes/Chess/Position/Squares144";

describe('MoveDisambiguator', () => {

    it('constructs itself', () => {

        const arbiter = vi.fn()
        const move = vi.fn()

        const disambiguator = new MoveDisambiguator(arbiter,move)

        expect(disambiguator.moveArbiter).toBe(arbiter)
        expect(disambiguator.move).toBe(move)

    })

    it('it optimally calculates pawn moves', () => {
        const arbiter = {
            squares64: {
                getPieceSquares: vi.fn()
            },
            getLegalMoves: vi.fn()
        }

        // regular pawn move - should never disambiguate
        let move = new ChessMove('e4','e5', Piece.pawnWhite())
        let disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('')
        expect(arbiter.getLegalMoves).toHaveBeenCalledTimes(0)
        expect(arbiter.squares64.getPieceSquares).toHaveBeenCalledTimes(0)

        // pawn captures - show always disambiguate on file
        move = new ChessMove('e4','d5',Piece.pawnWhite(),Piece.pawnBlack())
        disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('e')
        expect(arbiter.getLegalMoves).toHaveBeenCalledTimes(0)
        expect(arbiter.squares64.getPieceSquares).toHaveBeenCalledTimes(0)

    })

    it('it optimally calculates piece moves when only one piece of type', () => {
        const arbiter = {
            squares64: {
                getPieceSquares: vi.fn()
            },
            getLegalMoves: vi.fn()
        }

        // when piece is the only one of its type on the board
        let move = new ChessMove('e4','e5', Piece.bishopWhite())
        let disambiguator = new MoveDisambiguator(arbiter, move)
        arbiter.squares64.getPieceSquares.mockReturnValueOnce([{name: 'e4'}]) // mock only a single bishop square returned

        expect(disambiguator.getDisambiguationString()).toEqual('')
        expect(arbiter.getLegalMoves).toHaveBeenCalledTimes(0) // this heavy operation is not necessary in this scenario
        expect(arbiter.squares64.getPieceSquares).toHaveBeenCalledTimes(1)

    })

    it('it calculates piece moves' , () => {

        const getTestMoveArbiter = (fen) => {
            return new MoveArbiter(new MoveEngine(new Squares144(fen)))
        }

        // no disambiguation
        let arbiter = getTestMoveArbiter('8/8/8/8/8/8/R7/7R w - - 0 1')
        let move = new ChessMove('h1','e1',Piece.rookWhite())
        let disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('')

        // disambiguate on rank
        arbiter = getTestMoveArbiter('8/8/8/8/8/8/8/R6R w - - 0 1')
        move = new ChessMove('h1','e1',Piece.rookWhite())
        disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('h')

        // disambiguate on file
        arbiter = getTestMoveArbiter('3R4/8/8/8/8/8/8/3R4 w - - 0 1')
        move = new ChessMove('d1','d5',Piece.rookWhite())
        disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('1')

        // disambiguate on rank and file
        arbiter = getTestMoveArbiter('8/7Q/8/8/8/8/8/1Q5Q w - - 0 1')
        move = new ChessMove('h1','e4',Piece.queenWhite())
        disambiguator = new MoveDisambiguator(arbiter, move)
        expect(disambiguator.getDisambiguationString()).toEqual('h1')

    })

})