import Squares144 from "@/classes/Chess/Board/Squares144";
import type ChessMove from "@/classes/Chess/Moves/ChessMove";

export default class MoveArbiter {

    squares144: Squares144

    constructor(squares144: Squares144) {
        this.squares144 = squares144
    }

    isMoveLegal(move: ChessMove): boolean {
        return false
    }

}