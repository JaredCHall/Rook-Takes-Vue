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

    promote(type: ChessPieceType): void {
        if(this.type !== 'pawn'){
            throw new Error('Only pawn may promote')
        }
        if(['pawn','king'].indexOf(type) !== -1){
            throw new Error('Invalid promotion type')
        }

        this.type = type
    }

}