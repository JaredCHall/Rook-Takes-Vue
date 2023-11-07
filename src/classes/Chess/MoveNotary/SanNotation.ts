import type {SquareType} from "@/classes/Chess/Square/Square";
import {Piece, type ChessPieceType} from "@/classes/Chess/Piece";
import {Square} from "@/classes/Chess/Square/Square";
import {CastlesType} from "@/classes/Chess/Move/MoveType/CastlesType";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {ColorType} from "@/classes/Chess/Color";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";

export class SanNotation {

    readonly newSquare: SquareType

    readonly castlesType: CastlesType|null

    readonly isCapture: boolean

    readonly movingPiece: Piece

    readonly promoteToType: ChessPieceType|null

    // for disambiguation on file
    readonly startFile: string|null

    // for disambiguation on rank
    readonly startRank: number|null

    readonly checkMateToken: '#'|'+'|null

    constructor(
        movingPiece: Piece,
        isCapture: boolean,
        newSquare: SquareType, // nullable for castling moves
        castlesType: CastlesType|null = null,
        promotionType: ChessPieceType|null = null,
        startFile: string|null = null,
        startRank: number|null = null,
        checkMateToken: '#'|'+'|null = null,
    ) {

        this.movingPiece = movingPiece
        this.castlesType = castlesType
        this.newSquare = newSquare
        this.isCapture = isCapture
        this.promoteToType = promotionType
        this.startFile = startFile
        this.startRank = startRank
        this.checkMateToken = checkMateToken

        if(this.isCapture && this.movingPiece.type === 'pawn' && !this.startFile){
            // file disambiguation is always required for pawn captures
            throw new Error('File disambiguation is always required for pawn captures')
        }
    }

    static fromInput(input: string, sideToMove: ColorType) {

        let parts = input.match(/^(O-O-O|O-O)([+#])?$/)
        if(parts){
            //@ts-ignore
            const castlesType = CastlesType.create(parts[1], sideToMove)
            return new SanNotation(
                new Piece('king', sideToMove),
                false,
                castlesType.kingsNewSquare,
                castlesType,
                null,
                null,
                null,
                //@ts-ignore
                parts[2] || null
            )
        }

        parts = input.match(/^([KQBNR])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[QBNR])?([+#])?$/)
        if(parts === null){
            throw new Error('Unreadable SAN notation')
        }
        const pieceType = this.getPieceType(parts[1])
        const startFile = parts[2] || null
        const startRank = parts[3] ? parseInt(parts[3]) : null
        const isCapture = !!parts[4]
        const newSquare = parts[5]
        const promotionType = parts[6] ? this.getPromotionType(parts[6].replace(/=/,'')) : null
        const checkMateToken = parts[7] || null

        return new SanNotation(
            //@ts-ignore
            new Piece(pieceType, sideToMove),
            isCapture,
            //@ts-ignore
            newSquare,
            null,
            promotionType,
            startFile,
            startRank,
            checkMateToken
        )
    }

    static getPromotionType(promotionType: string): ChessPieceType
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

    static getPieceType(pieceType: string): ChessPieceType
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

    serialize(): string
    {
        if(this.castlesType){
            return this.castlesType.notation + (this.checkMateToken ?? '')
        }

        let notation = ''
        if(this.movingPiece.type !== 'pawn'){
            notation += this.#formatPieceType(this.movingPiece.type)
        }
        notation += (this.startFile ?? '')
            + (this.startRank ?? '')
            + (this.isCapture ? 'x' : '')
            + this.newSquare
            + (this.promoteToType ? '=' + this.#formatPieceType(this.promoteToType) : '')
            + (this.checkMateToken ?? '')

        return notation
    }

    #formatPieceType(pieceType: ChessPieceType): string
    {
        const char = pieceType === 'knight' ? 'n' : pieceType.charAt(0)
        return char.toUpperCase()
    }

}