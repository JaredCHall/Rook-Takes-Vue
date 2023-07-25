import type Squares144 from "@/classes/Chess/Board/Squares144";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type Piece from "@/classes/Chess/Piece";

export default class MoveFactory {

    squares144: Squares144
    constructor(squares144: Squares144) {
        this.squares144 = squares144
    }

    traceRayVectors(squareType: SquareType, piece: Piece, vectors: number[][], maxRayLength: number=7) {
        const square = this.squares144.getSquare(squareType)
        const startIndex = square.index144




    }

}