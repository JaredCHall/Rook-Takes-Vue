import type {ColorType} from "@/classes/Chess/Color";
import {Color} from "@/classes/Chess/Color";

export class GameResult
{
    readonly type: 'Draw'|'Stalemate'|'Mate'|'Resign'|'OutOfTime'

    readonly winner: null|ColorType

    readonly drawType: null|'3Fold'|'50Move'|'Agreed'

    constructor(
        type: 'Draw'|'Stalemate'|'Mate'|'Resign'|'OutOfTime',
        winner: null|ColorType,
        drawType: null|'3Fold'|'50Move'|'Agreed' = null
    ) {

        this.type = type
        this.winner = winner
        this.drawType = drawType
    }

    get loser(): null|ColorType {
        if(!this.winner){
            return null
        }

        return Color.getOpposite(this.winner)
    }

}