import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import type {ColorType} from "@/classes/Chess/Color";
import type {GamePosition} from "@/classes/Chess/Position/GamePosition";

export class MadeMove {

    readonly move: ChessMove

    readonly positionAfter: GamePosition

    readonly halfStepIndex: number

    readonly notation: string

    constructor(move: ChessMove, algebraicNotation: string, positionAfter: GamePosition) {
        this.move = move
        this.notation = algebraicNotation
        this.positionAfter = positionAfter
        this.halfStepIndex = positionAfter.extendedFEN.halfStepCounter - 1
    }

    get fenAfter(): ExtendedFen
    {
        return this.positionAfter.extendedFEN
    }

    get movingColor(): ColorType {
        return this.move.movingPiece.color
    }
}