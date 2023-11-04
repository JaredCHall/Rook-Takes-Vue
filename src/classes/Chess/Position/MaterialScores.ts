import type {Squares64} from "@/classes/Chess/Position/Squares64";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import {Piece} from "@/classes/Chess/Piece";

export class MaterialScores
{
    white: number

    black: number

    constructor(white: number = 0, black: number = 0) {
        this.white = white
        this.black = black
    }

    static make(squares64: Squares64): MaterialScores{

        // zeroed-out scores
        const scores = new MaterialScores()

        // count material
        const pieces = squares64.getPieces()
        for(const i in pieces){

            if(pieces[i].color === 'white'){
                scores.white += pieces[i].getMaterialValue()
                continue
            }
            scores.black += pieces[i].getMaterialValue()
        }
        return scores
    }

    onMove(move: ChessMove){
        if(move.capturedPiece){
            this[move.capturedPiece.color] -= move.capturedPiece.getMaterialValue()
        }
        if(move instanceof PawnPromotionMove){
            this[move.movingPiece.color] += this.#getPromotedPieceValue(move.promoteToType) - 1
        }
    }

    onUnMove(move: ChessMove) {
        if(move.capturedPiece){
            this[move.capturedPiece.color] += move.capturedPiece.getMaterialValue()
        }
        if(move instanceof PawnPromotionMove){
            this[move.movingPiece.color] -= this.#getPromotedPieceValue(move.promoteToType) - 1
        }
    }

    #getPromotedPieceValue(pieceType: ChessPieceType): number
    {
        return (new Piece(pieceType,'white')).getMaterialValue()
    }

}