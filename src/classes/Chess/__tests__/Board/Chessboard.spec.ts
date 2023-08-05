import { describe, it, expect, vi } from 'vitest'

import {Chessboard} from "@/classes/Chess/Board/Chessboard";
import {FenNumber} from "@/classes/Chess/Board/FenNumber";
import {Squares64} from "@/classes/Chess/Board/Squares64";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {Square} from "@/classes/Chess/Square/Square";
import {MoveList} from "@/classes/Chess/Move/MoveList";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Piece} from "@/classes/Chess/Piece";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {DoublePawnMove} from "@/classes/Chess/Move/MoveType/DoublePawnMove";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {GameResult} from "@/classes/Chess/Board/GameResult";

describe('ChessBoard', () => {

    it('it constructs itself', () => {
        const board = new Chessboard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
        expect(board.fenNumber).toBeInstanceOf(FenNumber)
        expect(board.squares64).toBeInstanceOf(Squares64)
        expect(board.moveArbiter).toBeInstanceOf(MoveArbiter)
        expect(board.moveHistory).toBeInstanceOf(MoveHistory)
        expect(board.moveEngine).toBeInstanceOf(MoveEngine)
    })

    it('it makes a new game', () => {
        const board = Chessboard.makeNewGame()
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    })

    it('it makes an empty board', () => {
        const board = Chessboard.makeEmptyBoard()
        expect(board.fenNumber.toString()).toEqual('8/8/8/8/8/8/8/8 w - - 0 1')
    })

    it('it gets a square', () => {
        const board = Chessboard.makeNewGame()
        const square = board.getSquare('e4')
        expect(square).toBeInstanceOf(Square)
        expect(square.name).toEqual('e4')
    })

    it('it gets moves', () => {
        const board = Chessboard.makeNewGame()
        const moves = board.getMoves('e2')
        expect(moves).toBeInstanceOf(MoveList)
        expect(moves).toHaveLength(2)
    })

    it('it makes a move (or 2) and un-does them', () => {
        const board = Chessboard.makeNewGame()
        const e3 = new ChessMove('e2','e3', new Piece('pawn','white'))
        board.makeMove(e3)

        expect(board.getSquare('e2').piece).toBeNull()
        expect(board.getSquare('e3').piece).toEqual(new Piece('pawn','white'))
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(1)
        expect(board.moveHistory.moves[0]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[0].move).toEqual(e3)

        const e5 = new DoublePawnMove('e7','e5', new Piece('pawn','black'))
        board.makeMove(e5)

        expect(board.getSquare('e7').piece).toBeNull()
        expect(board.getSquare('e5').piece).toEqual(new Piece('pawn','black'))
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppp1ppp/8/4p3/8/4P3/PPPP1PPP/RNBQKBNR w KQkq e6 0 2')
        expect(board.moveIndex).toEqual(2)
        expect(board.moveHistory.moves).toHaveLength(2)
        expect(board.moveHistory.moves[1]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[1].move).toEqual(e5)

        board.undoLastMove()

        expect(board.getSquare('e2').piece).toBeNull()
        expect(board.getSquare('e3').piece).toEqual(new Piece('pawn','white'))
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(1)
        expect(board.moveHistory.moves[0]).toBeInstanceOf(MadeMove)
        expect(board.moveHistory.moves[0].move).toEqual(e3)

    })

    it('it handles setResigns', () => {
        const board = Chessboard.makeNewGame()
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
        const board = Chessboard.makeNewGame()
        let gameResult

        gameResult = board.setDraw()
        expect(board.gameResult).toBe(gameResult)
        expect(gameResult).toBeInstanceOf(GameResult)
        expect(gameResult.type).toEqual('Draw')
        expect(gameResult.winner).toBeNull()
        expect(gameResult.drawType).toEqual('Agreed')

    })

    it('it handles setOutOfTime', () => {
        const board = Chessboard.makeNewGame()
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


    it('it displays made move from history', () => {
        const board = Chessboard.makeNewGame()
        const whitePawn = new Piece('pawn','white')
        const blackPawn = new Piece('pawn', 'black')
        const blackQueen = new Piece('queen', 'black')

        const e4 = new DoublePawnMove('e2','e4', whitePawn)
        board.makeMove(e4)
        const d5 = new DoublePawnMove('d7','d5', blackPawn)
        board.makeMove(d5)
        const exd5 = new ChessMove('e4','d5', whitePawn, blackPawn)
        board.makeMove(exd5)
        const Qxd5 = new ChessMove('d8','d5', blackQueen, whitePawn)
        board.makeMove(Qxd5)

        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(blackQueen)
        expect(board.fenNumber.toString()).toEqual('rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3')
        expect(board.moveIndex).toEqual(4)
        expect(board.moveHistory.moves).toHaveLength(4)


        board.displayMadeMove(3)
        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(whitePawn)
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2')
        expect(board.moveIndex).toEqual(3)
        expect(board.moveHistory.moves).toHaveLength(4)

        board.displayMadeMove(1)
        expect(board.getSquare('e4').piece).toEqual(whitePawn)
        expect(board.getSquare('d5').piece).toBeNull()
        expect(board.fenNumber.toString()).toEqual('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
        expect(board.moveIndex).toEqual(1)
        expect(board.moveHistory.moves).toHaveLength(4)

        board.displayMadeMove(4)
        expect(board.getSquare('e4').piece).toBeNull()
        expect(board.getSquare('d5').piece).toEqual(blackQueen)
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
        board = new Chessboard('7k/5K2/6PP/8/8/8/8/3R4 w - - 0 1')
        board.makeMove(new ChessMove('d1','d8', new Piece('rook','white')))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Mate')
        expect(board.gameResult.winner).toEqual('white')

        // stalemate
        board = new Chessboard('7k/5K2/6P1/7P/8/8/8/8 w - - 0 1')
        board.makeMove(new ChessMove('h5','h6', new Piece('pawn','white')))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('Stalemate')

        // 50 move rule
        board = new Chessboard('7k/5K2/6P1/7P/8/8/8/8 w - - 49 1')
        board.makeMove(new ChessMove('f7','f6', new Piece('king','white')))
        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('50Move')

    })

    it('it determines three-fold repetition', () => {
        const board = new Chessboard('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1')

        const whiteKing = new Piece('king','white')
        const blackKing = new Piece('king','black')
        const whiteBongClouds = new ChessMove('e1','e2', whiteKing)
        const whiteReconsiders = new ChessMove('e2','e1', whiteKing)
        const blackBongClouds = new ChessMove('e8','e7', blackKing)
        const blackReconsiders = new ChessMove('e7','e8', blackKing)

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

        console.log(board.moveHistory.repetitionTracker)

        expect(board.gameResult).toBeInstanceOf(GameResult)
        expect(board.gameResult.type).toEqual('Draw')
        expect(board.gameResult.winner).toBeNull()
        expect(board.gameResult.drawType).toEqual('3Fold')

        expect(() => board.makeMove(whiteReconsiders)).toThrowError('Cannot make move. Game is over.')
    })


})