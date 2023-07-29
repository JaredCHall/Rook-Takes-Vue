
import ChessMove from "./ChessMove";
import type Piece from "@/classes/Chess/Piece/Piece";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Square from "@/classes/Chess/Square/Square";

export default class DoublePawnMove extends ChessMove
{

    constructor(oldSquare: SquareType, newSquare: SquareType, movingPiece: Piece) {

        if(movingPiece.type !== 'pawn'){
            throw new Error('requires pawn')
        }
        if([4,5].indexOf(new Square(newSquare).rank) === -1){
            throw new Error('Double pawn moves must end on the 4th or 5th rank')
        }

        super(oldSquare, newSquare, movingPiece, null)
    }

    getEnPassantTargetSquare(): string
    {
        const square = new Square(this.newSquare)

        if(square.rank === 4){ // white moving
            return square.file + '3'
        }
        return square.file + '6'
    }
}