import type {SquareType} from "@/classes/Chess/Square/Square";
import {Piece, type ChessPieceType} from "@/classes/Chess/Piece";
import {Square} from "@/classes/Chess/Square/Square";
import type {CastlesType} from "@/classes/Chess/Move/MoveType/CastlesType";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {ColorType} from "@/classes/Chess/Color";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";

export class SanNotation {

    readonly newSquare: SquareType

    readonly castlesType: CastlesType|null

    readonly isCapture: boolean

    readonly movingPiece: Piece

    readonly promotionType: ChessPieceType|null

    readonly startFile: string|null

    readonly startRank: number|null

    readonly checkMateToken: '#'|'+'|null

    constructor(
        movingPieceType: string,
        movingPieceColor: string,
        isCapture: boolean,
        newSquare: string|null,
        castlesType: string|CastlesType|null = null,
        promotionType: string|null = null,
        startFile: string|null = null,
        startRank: number|null = null,
        checkMateToken: string|null = null,
    ) {

        // handle castles type
        if(typeof castlesType === 'string'){
            castlesType = castlesType === 'O-O-O' ? 'q' : 'k'
            if(movingPieceColor === 'white'){
                castlesType = castlesType.toUpperCase()
            }
            //@ts-ignore
            castlesType = CastlesType.create(castlesType)
        }
        this.castlesType = castlesType
        if(this.castlesType){
            this.newSquare = this.castlesType.kingsNewSquare
        }

        //@ts-ignore
        this.newSquare = newSquare ? (new Square(newSquare)).name : null
        //@ts-ignore
        this.movingPiece = new Piece(SanNotation.getPieceType(movingPieceType), movingPieceColor)
        this.isCapture = isCapture
        this.promotionType = promotionType ? SanNotation.getPromotionType(promotionType) : null
        this.startFile = startFile
        this.startRank = startRank
        //@ts-ignore
        this.checkMateToken = checkMateToken

        if(this.isCapture && this.movingPiece.type === 'pawn'){
            this.startFile = Square.getFileAndRank(this.newSquare)[0]
        }
    }

    serialize(): string
    {
        if(this.castlesType){
            return this.castlesType + (this.checkMateToken ?? '')
        }

        let notation = ''
        if(this.movingPiece.type !== 'pawn'){
            notation += this.#formatPieceType(this.movingPiece)
        }
        notation += (this.startFile ?? '')
            + (this.startRank ?? '')
            + (this.isCapture ? 'x' : '')
            + this.newSquare
            + (this.promotionType ? '='+this.promotionType : '')
            + (this.checkMateToken ?? '')

        return notation
    }


    #formatPieceType(piece: Piece): string
    {
        const char = piece.type === 'knight' ? 'n' : piece.type.charAt(0)
        return char.toUpperCase()
    }
    static fromInput(input: string, sideToMove: ColorType) {

        let parts = input.match(/^(O-O-O|O-O)([+#])?$/)
        if(parts){
            return new SanNotation(
                'king',
                sideToMove,
                false,
                null,
                parts[1],
                null,
                null,
                null,
                parts[2],
            )
        }

        parts = input.match(/^([KQBNR])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[QBNR])?([+#])?$/)
        if(parts === null){
            throw new Error('Unreadable SAN notation')
        }
        const pieceType = parts[1]
        const startFile = parts[2] || null
        const startRank = parts[3] ? parseInt(parts[2]) : null
        const isCapture = !!parts[4]
        const newSquare = parts[5]
        const promotionType = parts[6] ? parts[6].replace(/=/,'') : null
        const checkMateToken = parts[7] || null

        return new SanNotation(
            pieceType,
            sideToMove,
            isCapture,
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
            case 'Q': return 'queen'
            case 'R': return 'rook'
            case 'N': return 'knight'
            case 'B': return 'bishop'
        }
        throw new Error('Invalid promotion type.')
    }

    static getPieceType(pieceType: string): ChessPieceType
    {
        switch(pieceType){
            case 'K':
            case 'king':
                return 'king'
            case 'Q':
            case 'queen':
                return 'queen'
            case 'R':
            case 'rook':
                return 'rook'
            case 'N':
            case 'knight':
                return 'knight'
            case 'B':
            case 'bishop':
                return 'bishop'
            default:
                return 'pawn'
        }
    }

}