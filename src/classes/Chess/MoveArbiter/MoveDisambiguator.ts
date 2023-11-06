import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Square} from "@/classes/Chess/Square/Square";

export class MoveDisambiguator {

    moveArbiter: MoveArbiter

    move: ChessMove

    constructor(moveArbiter: MoveArbiter, move: ChessMove)
    {
        this.moveArbiter = moveArbiter
        this.move = move
    }


}