import type {ChessPieceType} from "@/classes/Chess/Piece";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";

export abstract class MoveNotation
{
    // string representation of the move
    abstract serialize(): string;

    // the pawn's promote to type
    abstract getPromoteToType(): null|ChessPieceType
    // if any changes need to be made to notation after move
    // for SAN, the check and mate tokens are added
    // for Coordinate, nothing happens
    setFenAfter(fenAfter: ExtendedFen): void {}

    protected static getPromotionType(promotionType: string): ChessPieceType
    {
        promotionType = promotionType.replace(/=/,'')
        switch(promotionType){
            case 'Q': case 'queen':  return 'queen'
            case 'R': case 'rook':   return 'rook'
            case 'N': case 'knight': return 'knight'
            case 'B': case 'bishop': return 'bishop'
        }
        throw new Error('Invalid promotion type.')
    }

    protected static getPieceType(pieceType: string): ChessPieceType
    {
        switch(pieceType){
            case 'K': case 'king':   return 'king'
            case 'Q': case 'queen':  return 'queen'
            case 'R': case 'rook':   return 'rook'
            case 'N': case 'knight': return 'knight'
            case 'B': case 'bishop': return 'bishop'
            default: return 'pawn'
        }
    }
}