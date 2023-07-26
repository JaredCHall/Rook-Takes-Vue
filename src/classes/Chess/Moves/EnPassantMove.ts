
import ChessMove from "./ChessMove";
import MoveStep from "./MoveStep";
import type Piece from "@/classes/Chess/Piece";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Square from "@/classes/Chess/Square/Square";
export default class EnPassantMove extends ChessMove
{
    capturedPiece: Piece

    constructor(oldSquare: SquareType, newSquare: SquareType, movingPiece: Piece, capturedPiece: Piece) {
        super(oldSquare, newSquare, movingPiece, capturedPiece)
        this.capturedPiece = capturedPiece
    }

    static getOpponentPawnSquare(move: ChessMove): SquareType
    {
        const newSquare = new Square(move.newSquare)
        const oldSquare = new Square(move.oldSquare)

        //@ts-ignore
        return newSquare.file + oldSquare.rank.toString()
    }

    getMoveSteps(): Array<MoveStep>
    {
        let steps = super.getMoveSteps();
        steps.push(new MoveStep(this.capturedPiece.currentSquare, null))

        return steps
    }

    getUndoSteps(): Array<MoveStep> {
        return [
            new MoveStep(this.capturedPiece.currentSquare, this.capturedPiece),
            new MoveStep(this.oldSquare, this.movingPiece),
            new MoveStep(this.newSquare, null),
        ]
    }
}