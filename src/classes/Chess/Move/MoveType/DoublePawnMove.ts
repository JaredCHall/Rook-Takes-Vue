import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Square, type SquareType} from "@/classes/Chess/Square/Square";
import type {Piece} from "@/classes/Chess/Piece";

export class DoublePawnMove extends ChessMove
{

    constructor(oldSquare: SquareType, newSquare: SquareType, movingPiece: Piece) {
        super(oldSquare, newSquare, movingPiece, null)
    }

    getEnPassantTargetSquare(): SquareType
    {
        const square = new Square(this.newSquare)

        if(square.rank === 4){ // white moving
            //@ts-ignore
            return square.file + '3'
        }
        //@ts-ignore
        return square.file + '6'
    }
}