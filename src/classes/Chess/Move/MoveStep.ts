import type Piece from "@/classes/Chess/Piece";
import type {SquareType} from "@/classes/Chess/Square/Square";

export default class MoveStep {

    squareName: SquareType

    piece: Piece|null

    constructor(squareName: SquareType, piece: Piece|null) {
        this.squareName = squareName
        this.piece = piece
    }

}