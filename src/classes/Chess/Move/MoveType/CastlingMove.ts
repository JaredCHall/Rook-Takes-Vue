import {MoveStep} from "@/classes/Chess/Move/MoveStep";
import {Piece} from "@/classes/Chess/Piece";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {CastlesType} from "@/classes/Chess/Move/MoveType/CastlesType";
import type {SquareType} from "@/classes/Chess/Square/Square";

export class CastlingMove extends ChessMove
{
    rook: Piece

    castlesType: CastlesType

    static create(castlesType: 'K'|'Q'|'k'|'q'): CastlingMove
    {
        const type = CastlesType.create(castlesType)
        const color = castlesType.toUpperCase() === castlesType ? 'white' : 'black'
        return new CastlingMove(
            type.kingsOldSquare,
            type.kingsNewSquare,
            new Piece('king', color),
            new Piece('rook', color),
            castlesType
        )
    }

    constructor(oldSquare: SquareType, newSquare: SquareType, movingPiece: Piece, rook: Piece, castlesType: 'K'|'Q'|'k'|'q'|CastlesType) {
        super(oldSquare, newSquare, movingPiece, null)
        this.castlesType = castlesType instanceof CastlesType ? castlesType : CastlesType.create(castlesType)
        this.rook = rook
    }

    getMoveSteps(): Array<MoveStep> {
        const steps = super.getMoveSteps()
        const rookMoveSteps = this.getRookMove().getMoveSteps()

        return steps.concat(rookMoveSteps)
    }

    getUndoSteps(): Array<MoveStep> {
        const kingUndoSteps = super.getUndoSteps();
        const rookUndoSteps = this.getRookMove().getUndoSteps()

        return kingUndoSteps.concat(rookUndoSteps)
    }

    getRookMove(): ChessMove
    {
        return new ChessMove(
            this.castlesType.rooksOldSquare,
            this.castlesType.rooksNewSquare,
            this.rook
        )
    }

    clone(): CastlingMove {
        const movingPiece = this.movingPiece.clone()
        const rook = this.rook.clone()
        return new CastlingMove(this.oldSquare, this.newSquare, movingPiece, rook, this.castlesType)
    }

}