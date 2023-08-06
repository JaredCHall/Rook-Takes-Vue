import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ExtendedFEN} from "@/classes/Chess/Board/ExtendedFEN";
import type {Squares144} from "@/classes/Chess/Board/Squares144";
import type {ColorType} from "@/classes/Chess/Color";

export class MadeMove {

    readonly move: ChessMove

    readonly fenAfter: ExtendedFEN

    readonly halfStepIndex: number

    constructor(move: ChessMove, fenAfter: ExtendedFEN) {
        this.move = move
        this.halfStepIndex = fenAfter.halfStepCounter - 1
        this.fenAfter = fenAfter
    }

    get movingColor(): ColorType {
        return this.move.movingPiece.color
    }
}