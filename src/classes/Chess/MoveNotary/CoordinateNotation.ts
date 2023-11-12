import type {SquareType} from "@/classes/Chess/Square/Square";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import type {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {MoveNotation} from "@/classes/Chess/MoveNotary/MoveNotation";

export class CoordinateNotation extends MoveNotation {

    readonly oldSquare: SquareType

    readonly newSquare: SquareType

    readonly promoteToType: ChessPieceType|null

    constructor(oldSquare: SquareType,newSquare: SquareType, promotionType: string|null = null) {
        super()
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.promoteToType = promotionType ? CoordinateNotation.getPromotionType(promotionType) : null
    }

    getPromoteToType(): ChessPieceType | null {
        return this.promoteToType;
    }

    setFenAfter(fenAfter: ExtendedFen): void {}

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

    serialize(): string
    {
        return this.oldSquare
            + this.newSquare
            + (this.promoteToType ?? '')
    }
}