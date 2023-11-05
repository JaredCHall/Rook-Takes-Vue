import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {Piece} from "@/classes/Chess/Piece";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";

export class AlgebraicNotationFormatter {

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
            return this.#formatCastlingMove(this.move)
        }

        const isPawn = this.move.movingPiece.type === 'pawn'
        let moveNotation = isPawn ? '' : this.#formatPieceType(this.move.movingPiece)

        if(isPawn && this.move.capturedPiece){
            moveNotation += this.move.oldSquare.split('')[0]
        }else{
            moveNotation += this.moveDisambiguation
        }

        moveNotation += this.move.capturedPiece ? 'x' : ''
        moveNotation += this.move.newSquare

        if(this.fenAfter.isMate){
            moveNotation += '#'
        }else if(this.fenAfter.isCheck){
            moveNotation += '+'
        }

        return moveNotation
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