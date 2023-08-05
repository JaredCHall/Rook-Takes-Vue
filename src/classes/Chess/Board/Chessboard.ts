import {Square} from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import {Squares144} from "@/classes/Chess/Board/Squares144";
import {FenNumber} from "@/classes/Chess/Board/FenNumber";
import {Squares64} from "@/classes/Chess/Board/Squares64";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import type {MoveList} from "@/classes/Chess/Move/MoveList";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {GameResult} from "@/classes/Chess/Board/GameResult";
import type {MadeMove} from "@/classes/Chess/Move/MadeMove";
import type {ColorType} from "@/classes/Chess/Color";
import {Color} from "@/classes/Chess/Color";

export class Chessboard
{

    static makeNewGame(): Chessboard
    {
        return new Chessboard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }

    static makeEmptyBoard(): Chessboard
    {
        return new Chessboard('8/8/8/8/8/8/8/8 w - -')
    }

    fenNumber: FenNumber

    squares64: Squares64

    moveArbiter: MoveArbiter

    moveHistory: MoveHistory

    moveIndex: number = 0 // index of the currently displayed move

    gameResult: null|GameResult = null

    constructor(fen: string) {
        this.fenNumber = new FenNumber(fen)
        this.squares64 = new Squares64(this.fenNumber)
        this.moveArbiter = new MoveArbiter(new MoveEngine(new Squares144(this.fenNumber)))
        this.moveHistory = new MoveHistory(this.fenNumber.clone())
    }

    get moveEngine(): MoveEngine {
        return this.moveArbiter.moveEngine
    }

    getSquare(squareType: SquareType): Square
    {
        return this.squares64.get(squareType)
    }

    getMoves(squareType: SquareType): MoveList
    {
        return this.moveArbiter.getLegalMoves(squareType)
    }

    displayMadeMove(moveIndex: number){
        if(moveIndex === 0){
            this.fenNumber = this.moveHistory.startFen.clone()
        }else{
            this.fenNumber = this.moveHistory.get(moveIndex).fenAfter.clone()
        }
        this.fenNumber.updateSquares64(this.squares64)
        this.moveIndex = moveIndex
    }


    makeMove(move: ChessMove): void {

        if(this.gameResult){
            throw new Error('Cannot make move. Game is over.')
        }

        const madeMove = this.moveArbiter.makeMove(move)
        this.fenNumber = madeMove.fenAfter.clone()
        this.squares64.makeMove(madeMove.move)
        this.moveHistory.add(madeMove)
        this.moveIndex = madeMove.halfStepIndex
        this.#determineGameResult(madeMove)
    }

    undoLastMove(): void {
        const fenBefore = this.moveHistory.getFenBefore(this.moveIndex)
        const lastMove = this.moveHistory.pop()
        this.moveArbiter.unMakeMove(lastMove.move, fenBefore)
        this.fenNumber = fenBefore.clone()
        this.moveIndex--
    }

    setResigns(color: ColorType)
    {
        return this.gameResult = new GameResult('Resign', Color.getOpposite(color))
    }

    setDraw()
    {
        return this.gameResult = new GameResult('Draw', null, 'Agreed')
    }

    setOutOfTime(color: ColorType)
    {
        return this.gameResult = new GameResult('OutOfTime', Color.getOpposite(color))
    }

    #determineGameResult(move: MadeMove)
    {
        if(move.fenAfter.isMate){
            return this.gameResult = new GameResult('Mate', move.movingColor)
        }
        if(move.fenAfter.isStalemate){
            return this.gameResult = new GameResult('Draw', null, 'Stalemate')
        }

        if(this.moveArbiter.doesMoveDrawBy3FoldRepetition(this.moveHistory, move)){
            return this.gameResult = new GameResult('Draw',null, '3Fold');
        }
        if(this.moveArbiter.doesMoveDrawBy50MoveRule(move)){
            return this.gameResult = new GameResult('Draw',null, '50Move');
        }

        return null
    }

}