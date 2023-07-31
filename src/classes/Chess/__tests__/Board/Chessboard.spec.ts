import { describe, it, expect, vi } from 'vitest'

import Chessboard from "@/classes/Chess/Board/Chessboard";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares64 from "@/classes/Chess/Board/Squares64";
import MoveArbiter from "@/classes/Chess/MoveFactory/MoveArbiter";

vi.mock('@/classes/Chess/Board/FenNumber')
vi.mock('@/classes/Chess/Board/Squares64')
vi.mock('@/classes/Chess/Board/MoveArbiter')

describe('ChessBoard', () => {

    it('it constructs itself', () => {
        const board = new Chessboard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(board.fenNumber).toBeInstanceOf(FenNumber)
        expect(board.squares64).toBeInstanceOf(Squares64)
        expect(board.moveArbiter).toBeInstanceOf(MoveArbiter)

        expect(FenNumber).toHaveBeenCalledWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
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