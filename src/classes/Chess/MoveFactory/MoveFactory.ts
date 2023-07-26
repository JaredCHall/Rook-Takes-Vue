import type Squares144 from "@/classes/Chess/Board/Squares144";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import MoveArbiter from "@/classes/Chess/MoveFactory/MoveArbiter";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type MoveList from "@/classes/Chess/Moves/MoveList";

export default class MoveFactory {

    squares144: Squares144

    moveEngine: MoveEngine

    moveArbiter: MoveArbiter

    constructor(squares144: Squares144) {
        this.squares144 = squares144
        this.moveEngine = new MoveEngine(this.squares144)
        this.moveArbiter = new MoveArbiter(this.squares144)
    }

    getMovesFromSquare(squareName: SquareType, isLegal: boolean): MoveList
    {
        return this.moveEngine.getPseudoLegalMoves(squareName)
    }
}