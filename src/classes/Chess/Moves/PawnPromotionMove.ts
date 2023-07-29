import ChessMove from "./ChessMove";
import type Piece from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import Square from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";

export default class PawnPromotionMove extends ChessMove
{

    promoteToType: ChessPieceType = 'queen'

    constructor(chessMove: ChessMove) {
        super(chessMove.oldSquare, chessMove.newSquare, chessMove.movingPiece, chessMove.capturedPiece)

        if(chessMove.movingPiece.type !== 'pawn'){
            throw new Error('Not a pawn')
        }

        if(!PawnPromotionMove.squareIsOnFinalRank(this.newSquare, this.movingPiece)){
            throw new Error('Not on final rank')
        }
    }

    static squareIsOnFinalRank(squareName: SquareType, piece: Piece): boolean
    {
        const square = new Square(squareName);

        return square.rank === (piece.color === 'white' ? 8 : 1)
    }

    clone(): ChessMove {
        return new PawnPromotionMove(super.clone())
    }
}