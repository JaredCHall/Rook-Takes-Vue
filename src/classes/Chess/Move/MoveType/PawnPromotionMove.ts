import ChessMove from "./ChessMove";
import Piece from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import Square from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import MoveStep from "@/classes/Chess/Move/MoveStep";

export default class PawnPromotionMove extends ChessMove
{

    promoteToType: ChessPieceType

    constructor(chessMove: ChessMove, promoteToType: ChessPieceType = 'queen') {
        super(chessMove.oldSquare, chessMove.newSquare, chessMove.movingPiece, chessMove.capturedPiece)
        this.promoteToType = promoteToType
    }

    getMoveSteps(): Array<MoveStep> {
        return [
            new MoveStep(this.oldSquare, null),
            new MoveStep(
                this.newSquare,
                new Piece(this.promoteToType, this.movingPiece.color)
            ),
        ]
    }

    getUndoSteps(): Array<MoveStep> {
        return [
            new MoveStep(this.newSquare, null),
            new MoveStep(
                this.oldSquare,
                new Piece('pawn', this.movingPiece.color)
            ),
        ]
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