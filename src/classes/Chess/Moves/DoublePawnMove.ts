
import ChessMove from "./ChessMove";
import type Piece from "@/classes/Chess/Piece";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Square from "@/classes/Chess/Square/Square";

export default class DoublePawnMove extends ChessMove
{

    constructor(oldSquare: SquareType, newSquare: SquareType, movingPiece: Piece) {
        super(oldSquare, newSquare, movingPiece, null)
    }

    getEnPassantTargetSquare(): string
    {
        if(this.newSquare === null){
            throw new Error('this.newSquare is null')
        }

        if(this.movingPiece === null){
            throw new Error('this.piece is null')
        }

        const isWhiteMoving = this.movingPiece.color == 'white'
        const newSquare = new Square(this.newSquare)

        // target square is one square back from the new square
        const targetRank = newSquare.rank - (isWhiteMoving ? 1 : -1)
        return newSquare.file + targetRank.toString()
    }

}