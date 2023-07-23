import Pieces64 from "@/classes/Chess/Board/Pieces64";
import Piece from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import {Color} from "@/classes/Chess/Color";

export default class FenNumber {

    piecePlacements: string = ''

    sideToMove: 'white' | 'black' = 'white'

    castleRights: null | string = null

    enPassantTarget: null | string = null

    halfMoveClock: number = 0

    fullMoveCounter: number = 1

    checkedKingSquare: string | null = null

    isCheck: boolean = false

    isMate: boolean = false

    constructor(fen: string|FenNumber) {

        if(fen instanceof FenNumber){
            this.piecePlacements = fen.piecePlacements
            this.sideToMove = fen.sideToMove
            this.castleRights = fen.castleRights
            this.enPassantTarget = fen.enPassantTarget
            this.halfMoveClock = fen.halfMoveClock
            this.fullMoveCounter = fen.fullMoveCounter
            this.isCheck = fen.isCheck
            this.isMate = fen.isMate

            return
        }

        const parts = fen.split(' ')

        this.piecePlacements = parts[0]
        this.sideToMove = (parts[1] ?? 'w') === 'w' ? 'white' : 'black'
        this.isCheck = (parts[6] ?? null) === '1'
        this.isMate = (parts[7] ?? null) === '1'


        if(parts[2] && parts[2] !== '-'){
            this.castleRights = parts[2]
        }

        if(parts[3] && parts[3] !== '-'){
            this.enPassantTarget = parts[3]
        }

        if(parts[4] && parts[4] !== '-'){
            this.halfMoveClock = parseInt(parts[4])
        }

        if(parts[5] && parts[5] !== '-'){
            this.fullMoveCounter = parseInt(parts[5])
        }

        if(this.castleRights == '-'){
            this.castleRights = null
        }
        if(this.enPassantTarget == '-'){
            this.enPassantTarget = null
        }
    }

    static getPieceType(fenType: string): ChessPieceType
    {
        const map = {
            r: 'rook',
            b: 'bishop',
            n: 'knight',
            q: 'queen',
            k: 'king',
            p: 'pawn'
        }

        const lowerCaseType = fenType.toLowerCase()
        if(!map.hasOwnProperty(lowerCaseType)){
            throw new Error(`Invalid piece type: ${fenType}`)
        }

        //@ts-ignore
        return map[lowerCaseType]
    }

    getPieces64(): Pieces64 {
        const pieces64 = new Pieces64()

        const rows = this.piecePlacements.split('/').reverse()
        if (rows.length !== 8) {
            throw new Error('FEN piece placement must include all eight rows')
        }

        const columnNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        for (let rowNumber = 8; rowNumber > 0; rowNumber--) {
            const chars = rows[rowNumber - 1].split('')
            let columnNumber = 1;
            for (let i = 0; i < chars.length; i++) {
                const character = chars[i]
                if (/[1-8]/.test(character)) {
                    const emptySpaces = parseInt(character)
                    const lastEmptySpace = columnNumber + emptySpaces - 1
                    while (columnNumber <= lastEmptySpace) {
                        const squareName = columnNames[columnNumber - 1] + rowNumber.toString()
                        //@ts-ignore
                        pieces64.set(squareName, null)
                        columnNumber++
                    }
                } else if (/[rbnqkpRBNQKP]/.test(character)) {

                    const squareName = columnNames[columnNumber - 1] + rowNumber.toString()
                    const pieceType = FenNumber.getPieceType(character)
                    const colorType = character.toLowerCase() === character ? Color.BLACK : Color.WHITE
                    // @ts-ignore
                    const piece = new Piece(pieceType, colorType, squareName)
                    // @ts-ignore
                    pieces64.set(squareName, piece)
                    columnNumber++
                } else {
                    throw new Error("Unrecognized position character: " + character)
                }
            }
        }
        return pieces64
    }

    toString(): string {
        return [
            this.piecePlacements,
            this.sideToMove.charAt(0),
            this.castleRights == null ? '-' : this.castleRights,
            this.enPassantTarget == null ? '-' : this.enPassantTarget,
            this.halfMoveClock,
            this.fullMoveCounter,
            this.isCheck ? '0' : '1',
            this.isMate ? '0' : '1',
        ].join(' ')
    }

    clone(): FenNumber {
        return new FenNumber(this)
    }
}