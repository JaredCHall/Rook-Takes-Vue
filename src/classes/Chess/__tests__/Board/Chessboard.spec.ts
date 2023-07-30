import { describe, it, expect, vi } from 'vitest'

import Chessboard from "@/classes/Chess/Board/Chessboard";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares64 from "@/classes/Chess/Board/Squares64";
import MoveFactory from "@/classes/Chess/MoveFactory/MoveFactory";

vi.mock('@/classes/Chess/Board/FenNumber')
vi.mock('@/classes/Chess/Board/Squares64')
vi.mock('@/classes/Chess/MoveFactory/MoveFactory')

describe('ChessBoard', () => {

    it('it constructs itself', () => {
        const board = new Chessboard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(board.fenNumber).toBeInstanceOf(FenNumber)
        expect(board.squares64).toBeInstanceOf(Squares64)
        expect(board.moveFactory).toBeInstanceOf(MoveFactory)

        expect(FenNumber).toHaveBeenCalledWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(MoveFactory).toHaveBeenCalledWith(board.fenNumber)
        expect(Squares64).toHaveBeenCalledWith(board.fenNumber)
    })

    it('it makes a new game', () => {
        const board = Chessboard.makeNewGame()
        expect(FenNumber).toHaveBeenCalledWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    })

    it('it makes an empty board', () => {
        const board = Chessboard.makeEmptyBoard()
        expect(FenNumber).toHaveBeenCalledWith('8/8/8/8/8/8/8/8 w - -')
    })

})