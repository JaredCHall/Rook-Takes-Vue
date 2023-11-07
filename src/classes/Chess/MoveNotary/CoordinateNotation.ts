import type {SquareType} from "@/classes/Chess/Square/Square";
import {Square} from "@/classes/Chess/Square/Square";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";

export class CoordinateNotation {

    readonly oldSquare: SquareType

    readonly newSquare: SquareType

    readonly promoteToType: ChessPieceType|null

    constructor(oldSquare: SquareType,newSquare: SquareType, promotionType: string|null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.promoteToType = promotionType ? SanNotation.getPromotionType(promotionType) : null
    }

    static fromInput(input: string)
    {
        const parts = input.match(/^([a-h][1-8])(\s)?([a-h][1-8])(\s)?(=)?([QBNR])?$/)
        if(parts === null){
            throw new Error('Unreadable Coordinate notation')
        }

        const oldSquare = parts[1]
        const newSquare = parts[3]
        const promoteType = parts[6] || null

        //@ts-ignore
        return new CoordinateNotation(oldSquare, newSquare, promoteType)
    }

}