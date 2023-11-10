import { describe, it, expect } from 'vitest'
import {Game} from "@/classes/Chess/Game/Game";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {Squares64} from "@/classes/Chess/Position/Squares64";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {Square} from "@/classes/Chess/Square/Square";
import {MoveList} from "@/classes/Chess/Move/MoveList";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {DoublePawnMove} from "@/classes/Chess/Move/MoveType/DoublePawnMove";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {GameResult} from "@/classes/Chess/Game/GameResult";
import {Player} from "@/classes/Chess/Player";
import {GameOptions} from "@/classes/Chess/Game/GameOptions";

describe('Game', () => {

    it('it constructs itself', () => {

        const options = new GameOptions()
        options.timerType = 'Basic'
        options.timerDuration = 60 * 15

        const board = new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', options)
        expect(board.fenNumber).toBeInstanceOf(ExtendedFen)
        expect(board.squares64).toBeInstanceOf(Squares64)
        expect(board.moveArbiter).toBeInstanceOf(MoveArbiter)
        expect(board.moveHistory).toBeInstanceOf(MoveHistory)
        expect(board.moveEngine).toBeInstanceOf(MoveEngine)
        expect(board.playerWhite).toBeInstanceOf(Player)
        expect(board.playerBlack).toBeInstanceOf(Player)
        expect(board.material.white).toEqual(39)
        expect(board.material.black).toEqual(39)
        expect(board.gameClock.timerBlack.timeRemaining).toEqual(900)
        expect(board.gameClock.timerWhite.timeRemaining).toEqual(900)
    })

    it('it makes a new game', () => {
        const board = Game.makeNewGame()
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    })

    it('it makes an empty board', () => {
        const board = Game.makeEmptyBoard()
        expect(board.fenNumber.toString()).toEqual('8/8/8/8/8/8/8/8 w - - 0 1')
        expect(board.materialWhite).toEqual(0)
        expect(board.materialBlack).toEqual(0)
    })

    it('it gets a square', () => {
        const board = Game.makeNewGame()
        const square = board.getSquare('e4')
        expect(square).toBeInstanceOf(Square)
        expect(square.name).toEqual('e4')
    })

    it('it gets moves', () => {
        const board = Game.makeNewGame()
        const moves = board.getMoves('e2')
        expect(moves).toBeInstanceOf(MoveList)
        expect(moves).toHaveLength(2)
    })

    it('it makes a move (or 2) and un-does them', () => {
        const board = Game.makeNewGame()
        const e3 = new ChessMove('e2','e3', Piece.pawnWhite())
        board.makeMove(e3)

        expect(board.getSquare('e2').piece).toBeNull()
        expect(board.getSquare('e3').piece).toEqual(Piece.pawnWhite())
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(1)
        expect(board.moveHistory.moves[0]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[0].move).toEqual(e3)

        const e5 = new DoublePawnMove('e7','e5', Piece.pawnBlack())
        board.makeMove(e5)

        expect(board.getSquare('e7').piece).toBeNull()
        expect(board.getSquare('e5').piece).toEqual(Piece.pawnBlack())
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppp1ppp/8/4p3/8/4P3/PPPP1PPP/RNBQKBNR w KQkq e6 0 2')
        expect(board.moveIndex).toEqual(2)
        expect(board.moveHistory.moves).toHaveLength(2)
        expect(board.moveHistory.moves[1]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[1].move).toEqual(e5)

        board.undoLastMove()

        expect(board.getSquare('e2').piece).toBeNull()
        expect(board.getSquare('e3').piece).toEqual(Piece.pawnWhite())
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(1)
        expect(board.moveHistory.moves[0]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[0].move).toEqual(e3)

    })

    it('it handles setResigns', () => {
        const board = Game.makeNewGame()
        let gameResult

        gameResult = board.setResigns('white')
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('Resign')
        expect(gameResult.winner).toEqual('black')

        gameResult = board.setResigns('black')
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('Resign')
        expect(gameResult.winner).toEqual('white')
    })

    it('it handles setDraw', () => {
        const board = Game.makeNewGame()
        let gameResult

        gameResult = board.setDraw()
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('Draw')
        expect(gameResult.winner).toBeNull()
        expect(gameResult.drawType).toEqual('Agreed')

    })

    it('it handles setOutOfTime', () => {
        const board = Game.makeNewGame()
        let gameResult

        gameResult = board.setOutOfTime('white')
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('OutOfTime')
        expect(gameResult.winner).toEqual('black')

        gameResult = board.setOutOfTime('black')
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('OutOfTime')
        expect(gameResult.winner).toEqual('white')
    })

    it('it handles setPlayer', () => {
        const board = Game.makeNewGame()
        const alice = new Player('white','Alice')
        const claire = new Player('black','Claire')

        board.setPlayer(alice)
        board.setPlayer(claire)

        expect(board.playerWhite).toBe(alice)
        expect(board.playerBlack).toBe(claire)
    })

    it('it displays made move from history', () => {
        const board = Game.makeNewGame()

        board.makeMove( new DoublePawnMove('e2','e4', Piece.pawnWhite())) // e4
        board.makeMove(new DoublePawnMove('d7','d5', Piece.pawnBlack())) // d5
        board.makeMove(new ChessMove('e4','d5', Piece.pawnWhite(), Piece.pawnBlack())) // exd5
        board.makeMove(new ChessMove('d8','d5', Piece.queenBlack(), Piece.pawnWhite())) // Qxd5

        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(Piece.queenBlack())
        expect(board.fenNumber.toString()).toEqual('rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3')
        expect(board.moveIndex).toEqual(4)
        expect(board.moveHistory.moves).toHaveLength(4)


        board.displayMadeMove(3)
        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(Piece.pawnWhite())
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2')
        expect(board.moveIndex).toEqual(3)
        expect(board.moveHistory.moves).toHaveLength(4)

        board.displayMadeMove(1)
        expect(board.getSquare('e4').piece).toEqual(Piece.pawnWhite())
        expect(board.getSquare('d5').piece).toBeNull()
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(4)

        board.displayMadeMove(4)
        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(Piece.queenBlack())
        expect(board.fenNumber.toString()).toEqual('rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3')
        expect(board.moveIndex).toEqual(4)
        expect(board.moveHistory.moves).toHaveLength(4)

        board.displayMadeMove(0)
        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toBeNull()
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(board.moveIndex).toEqual(0)
        expect(board.moveHistory.moves).toHaveLength(4)

    })

    it('it determines game result', () => {

        let board

        // checkmate
        board = new Game('7k/5K2/6PP/8/8/8/8/3R4 w - - 0 1')
        board.makeMove(new ChessMove('d1','d8', Piece.rookWhite()))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Mate')
        expect(board.gameResult.winner).toEqual('white')

        // stalemate
        board = new Game('7k/5K2/6P1/7P/8/8/8/8 w - - 0 1')
        board.makeMove(new ChessMove('h5','h6', Piece.pawnWhite()))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('Stalemate')

        // 50 move rule
        board = new Game('7k/5K2/6P1/7P/8/8/8/8 w - - 49 1')
        board.makeMove(new ChessMove('f7','f6', Piece.kingWhite()))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('50Move')

    })

    it('it determines three-fold repetition', () => {
        const board = new Game('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1')

        const whiteBongClouds = new ChessMove('e1','e2', Piece.kingWhite())
        const whiteReconsiders = new ChessMove('e2','e1', Piece.kingWhite())
        const blackBongClouds = new ChessMove('e8','e7', Piece.kingBlack())
        const blackReconsiders = new ChessMove('e7','e8', Piece.kingBlack())

        board.makeMove(whiteBongClouds)
        board.makeMove(blackBongClouds) // 1st repetition
        board.makeMove(whiteReconsiders)
        board.makeMove(blackReconsiders)
        board.makeMove(whiteBongClouds)
        board.makeMove(blackBongClouds) // 2nd repetition
        board.makeMove(whiteReconsiders)
        board.makeMove(blackReconsiders)
        board.makeMove(whiteBongClouds)
        board.makeMove(blackBongClouds) // 3rd repetition

        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('3Fold')

        expect(() => board.makeMove(whiteReconsiders)).toThrowError('Cannot make move. Game is over.')
    })

    it('it calculates player material', () => {

        let board
        board = new Game('2kr1bnr/ppp1pppp/2n5/5q2/2PP4/4BB2/PP3PPP/RN1QK2R b KQ - 0 8')
        expect(board.material.white).toEqual(35)
        expect(board.material.black).toEqual(35)

        board = new Game('2kr1bnr/ppp1pppp/8/8/2P3q1/4B3/PPQ2PPP/RN3RK1 b - - 1 11')
        expect(board.material.white).toEqual(31)
        expect(board.material.black).toEqual(32)

        board = new Game('3r2r1/5k1p/qpQbp1p1/5pB1/P7/5N1P/5PP1/3R2K1 b - - 4 32')
        expect(board.material.white).toEqual(24)
        expect(board.material.black).toEqual(27)
    })

})