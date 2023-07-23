import type {ColorType} from "@/classes/Chess/Color";
import type {SquareType} from "@/classes/Chess/Square/Square";

export type ChessPieceType = 'pawn'|'rook'|'knight'|'bishop'|'queen'|'king'

export default class Piece
{
    type: ChessPieceType

    color: ColorType

    startingSquare: SquareType

    currentSquare: SquareType

    constructor(type: ChessPieceType, color: ColorType, startingSquare: SquareType, currentSquare: null|SquareType=null) {
        this.type = type
        this.color = color
        this.startingSquare = startingSquare
        this.currentSquare = currentSquare ?? startingSquare
    }

    clone(): Piece {
        return new Piece(this.type, this.color, this.startingSquare, this.currentSquare)
    }
}