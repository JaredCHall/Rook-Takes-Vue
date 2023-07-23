import type {ColorType} from "@/classes/Chess/Color";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import Piece from "@/classes/Chess/Piece";

interface PieceSet {
    king: Piece|null,
    queen: Piece[],
    rook: Piece[],
    knight: Piece[],
    bishop: Piece[],
    pawn: Piece[],
}

export default class PieceList {

    whitePieces: PieceSet = {
        king: null,
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    blackPieces: PieceSet = {
        king: null,
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    add(piece: Piece){
        const list = this.#getListForColor(piece.color)

        if(piece.type === 'king'){
            list.king = piece

            return
        }

        list[piece.type].push(piece)
    }

    remove(piece: Piece){
        const pieceSet = this.#getListForColor(piece.color)

        if(piece.type === 'king'){
            pieceSet.king = null

            return
        }

        //@ts-ignore
        const pieceList = pieceSet[piece.type]

        for(let i = 0; i < pieceList.length; i++){
            if(piece === pieceList[i]){
                pieceList.splice(i,1)
            }
        }
    }

    getPieces(color: ColorType, type: ChessPieceType|null=null): Piece[]
    {
        const pieceSet = this.#getListForColor(color)

        if(type === null){
            return this.#getAllPiecesForColor(color)
        }

        if(type === 'king'){
            return pieceSet.king ? [pieceSet.king] : []
        }

        // @ts-ignore
        return pieceSet[type]
    }

    getKing(color: ColorType): Piece
    {
        const pieceSet = this.#getListForColor(color)
        if(!pieceSet.king){
            throw new Error('there is no king!')
        }

        return pieceSet.king
    }

    #getAllPiecesForColor(color: ColorType): Piece[]{
        const pieceSet = this.#getListForColor(color)

        if(pieceSet.king === null){
            throw new Error(color+' does not have a king!')
        }

        let pieces = []
        pieces.push(pieceSet.king)
        pieces = pieces.concat(
            pieceSet.queen,
            pieceSet.rook,
            pieceSet.knight,
            pieceSet.bishop,
            pieceSet.pawn,
        )

        console.log(pieces)

        return pieces
    }

    #getListForColor(color: ColorType): PieceSet {
        return color === 'white' ? this.whitePieces : this.blackPieces
    }

}
