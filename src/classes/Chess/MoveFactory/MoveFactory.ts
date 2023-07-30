import Squares144 from "@/classes/Chess/Board/Squares144";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import MoveArbiter from "@/classes/Chess/MoveFactory/MoveArbiter";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type MoveList from "@/classes/Chess/Moves/MoveList";
import type ChessMove from "@/classes/Chess/Moves/ChessMove";
import type FenNumber from "@/classes/Chess/Board/FenNumber";

export default class MoveFactory {

    squares144: Squares144

    moveEngine: MoveEngine

    moveArbiter: MoveArbiter

    constructor(fenNumber: FenNumber) {
        this.squares144 = new Squares144(fenNumber)
        this.moveEngine = new MoveEngine(this.squares144)
        this.moveArbiter = new MoveArbiter(this.squares144)
    }

    getMovesFromSquare(squareName: SquareType, isLegal: boolean): MoveList
    {
        const moves = this.moveEngine.getPseudoLegalMoves(squareName, this.squares144.fenNumber)

        if(isLegal){
            moves.filter((move: ChessMove) => this.moveArbiter.isMoveLegal(move))
        }

        return moves
    }
}