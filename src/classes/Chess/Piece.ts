import type {ColorType} from "@/classes/Chess/Color";

export type ChessPieceType = 'pawn'|'rook'|'knight'|'bishop'|'queen'|'king'

export class Piece
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