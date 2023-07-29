import type {ColorType} from "@/classes/Chess/Color";
import type {SquareType} from "@/classes/Chess/Square/Square";

export type ChessPieceType = 'pawn'|'rook'|'knight'|'bishop'|'queen'|'king'

export default class Piece
{
    type: ChessPieceType

    color: ColorType

    constructor(type: ChessPieceType, color: ColorType) {
        this.type = type
        this.color = color
    }

    clone(): Piece {
        return new Piece(this.type, this.color)
    }
}