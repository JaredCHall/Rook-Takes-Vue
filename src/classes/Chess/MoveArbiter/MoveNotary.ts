import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import {Piece} from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";

export class MoveNotary {

    move: ChessMove

    fenAfter: ExtendedFen

    moveDisambiguation: string

    constructor(move: ChessMove, fenAfter: ExtendedFen, moveDisambiguation: string) {
        this.move = move
        this.fenAfter = fenAfter
        this.moveDisambiguation = moveDisambiguation
    }

    format(): string
    {
        if(this.move instanceof CastlingMove){
            return this.#formatCastlingMove(this.move) + this.#formatCheckAndMate(this.fenAfter)
        }

        const isPawn = this.move.movingPiece.type === 'pawn'
        let moveNotation = isPawn ? '' : this.#formatPieceType(this.move.movingPiece)

        moveNotation += this.moveDisambiguation
        moveNotation += this.move.capturedPiece ? 'x' : ''
        moveNotation += this.move.newSquare
        if(this.move instanceof PawnPromotionMove){
            moveNotation += this.#formatPawnPromotion(this.move.promoteToType)
        }
        moveNotation += this.#formatCheckAndMate(this.fenAfter)

        return moveNotation
    }

    #formatCheckAndMate(fenAfter: ExtendedFen)
    {
        if(fenAfter.isMate){
            return '#'
        }
        if(fenAfter.isCheck){
            return '+'
        }
        return ''
    }

    #formatPawnPromotion(pieceType: ChessPieceType): string
    {
        const promotionPieceType = this.#formatPieceType(
            new Piece(pieceType, 'white')
        )
        return `=${promotionPieceType}`
    }

    #formatPieceType(piece: Piece): string
    {
        const char = piece.type === 'knight' ? 'n' : piece.type.charAt(0)
        return char.toUpperCase()
    }

    #formatCastlingMove(move: CastlingMove): string
    {
        switch(move.castlesType.type){
            case 'K':
            case 'k':
                return 'O-O'
            default:
                return 'O-O-O'
        }
    }
}