import type {ColorType} from "@/classes/Chess/Color";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import Piece from "@/classes/Chess/Piece";

interface PieceSet {
    king: Piece[],
    queen: Piece[],
    rook: Piece[],
    knight: Piece[],
    bishop: Piece[],
    pawn: Piece[],
}

export default class PieceList {

    whitePieces: PieceSet = {
        king: [],
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    blackPieces: PieceSet = {
        king: [],
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    add(piece: Piece){
        const list = this.#getListForColor(piece.color)

        list[piece.type].push(piece)
    }

    remove(piece: Piece){
        const pieceSet = this.#getListForColor(piece.color)

        const pieceList = pieceSet[piece.type]

        for(let i = 0; i < pieceList.length; i++){
            if(piece === pieceList[i]){
                pieceList.splice(i,1)

                break
            }
        }
    }

    getPieces(color: ColorType, type: ChessPieceType|null=null): Piece[]
    {
        const pieceSet = this.#getListForColor(color)

        if(type === null){
            return this.#getAllPiecesForColor(color)
        }

        return pieceSet[type]
    }

    getKing(color: ColorType): null|Piece
    {
        const pieceSet = this.#getListForColor(color)

        return pieceSet.king[0] ?? null
    }

    #getAllPiecesForColor(color: ColorType): Piece[]{
        const pieceSet = this.#getListForColor(color)

        return pieceSet.king.concat(
            pieceSet.queen,
            pieceSet.rook,
            pieceSet.knight,
            pieceSet.bishop,
            pieceSet.pawn,
        )
    }

    #getListForColor(color: ColorType): PieceSet {
        return color === 'white' ? this.whitePieces : this.blackPieces
    }

}
