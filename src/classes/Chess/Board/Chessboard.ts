import Square from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Squares144 from "@/classes/Chess/Board/Squares144";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares64 from "@/classes/Chess/Board/Squares64";
import MoveArbiter from "@/classes/Chess/MoveFactory/MoveArbiter";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import MoveHistory from "@/classes/Chess/Move/MoveHistory";
import type MoveList from "@/classes/Chess/Move/MoveList";
import type ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";

export default class Chessboard
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

    constructor(fen: string) {
        this.fenNumber = new FenNumber(fen)
        this.squares64 = new Squares64(this.fenNumber)
        this.moveArbiter = new MoveArbiter(new MoveEngine(new Squares144(this.fenNumber)))
        this.moveHistory = new MoveHistory()
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

    makeMove(move: ChessMove): void {
        const madeMove = this.moveArbiter.makeMove(move)
        this.fenNumber = madeMove.fenAfter.clone()
        this.squares64.makeMove(madeMove.move)
        this.moveHistory.add(madeMove)

    }

    undoLastMove(): void {
        const lastMove = this.moveHistory.pop()
        this.moveArbiter.unMakeMove(lastMove.move)
        this.fenNumber = lastMove.fenAfter.clone()
    }


}