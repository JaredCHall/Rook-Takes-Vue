import type {SquareType} from "@/classes/Chess/Square/Square";
import Piece from "@/classes/Chess/Piece";
import PieceList from "@/classes/Chess/Board/PieceList";
import Square from "@/classes/Chess/Square/Square";

/**
 * A representation of the 64 squares and the pieces on them.
 *
 */
export default class Pieces64
{
    squares: { [squareType: string]: Piece|null } = {}

    set(squareType: SquareType, piece: null|Piece): void {
        this.squares[squareType] = piece
    }

    get(squareType: SquareType): null|Piece {
        return this.squares[squareType]
    }
}