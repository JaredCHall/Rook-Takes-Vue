import Squares64 from "@/classes/Chess/Board/Squares64";
import Piece from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import {Color} from "@/classes/Chess/Color";
import type { SquareType } from "@/classes/Chess/Square/Square";
import type ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import DoublePawnMove from "@/classes/Chess/Move/MoveType/DoublePawnMove";
import CastlesType from "@/classes/Chess/Move/MoveType/CastlesType";

export default class FenNumber {

    /**
     * piecePlacements is undefined between calls of incrementTurn() and setPiecePositions()
     */
    piecePlacements: string

    sideToMove: 'white' | 'black' = 'white'

    castleRights: null | string = null

    enPassantTarget: null | SquareType = null

    halfMoveClock: number = 0

    fullMoveCounter: number = 1

    isCheck: boolean = false

    isMate: boolean = false

    static readonly pieceTypeDictionary = {
        r: 'rook',
        b: 'bishop',
        n: 'knight',
        q: 'queen',
        k: 'king',
        p: 'pawn'
    }

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
            //@ts-ignore
            this.enPassantTarget = parts[3]
        }

        if(parts[4] && parts[4] !== '-'){
            this.halfMoveClock = parseInt(parts[4])
        }

        if(parts[5] && parts[5] !== '-'){
            this.fullMoveCounter = parseInt(parts[5])
        }
    }

    get halfStepCounter(): number
    {
        return this.fullMoveCounter * 2 - 1 + (this.sideToMove === 'black' ? 1 : 0)
    }

    incrementTurn(
        chessMove: ChessMove,
        squares64: Squares64
    ): FenNumber {

        this.#incrementMoveCounters(chessMove)

        this.#switchSideToMove()

        this.#setPiecePlacements(squares64)

        this.#updateEnPassantTargetSquare(chessMove)

        this.#revokeCastleRights(chessMove)

        return this
    }

    #switchSideToMove(): void {
        this.sideToMove = Color.getOpposite(this.sideToMove)
    }

    #updateEnPassantTargetSquare(move: ChessMove): void {
        if(move instanceof DoublePawnMove){
            this.enPassantTarget = move.getEnPassantTargetSquare()
        }else{
            this.enPassantTarget = null
        }
    }

    #incrementMoveCounters(move: ChessMove): void {
        // increment full move counter if black's turn
        if(this.sideToMove === 'black'){
            this.fullMoveCounter++
        }

        // increment or reset half-move clock as required
        if(move.movingPiece.type === 'pawn' || move.capturedPiece){
            this.halfMoveClock = 0
        }else{
            this.halfMoveClock++
        }
    }

    #revokeCastleRights(move: ChessMove): void {
        if(!this.castleRights){
            return
        }

        const isRook = move.movingPiece.type === 'rook'
        const isKing = move.movingPiece.type === 'king'
        const capturedRook = move.capturedPiece?.type === 'rook' ? move.capturedPiece : null



        if( !(isRook || isKing || capturedRook) ){
            return
        }

        const revocations: string[] = []
        if(capturedRook){
            const revokedType = CastlesType.fromRooksSquare(move.newSquare, capturedRook)
            if(revokedType){
                revocations.push(revokedType.type)
            }
        }

        const movingColor = move.movingPiece.color
        if(isKing){
            if(movingColor === 'white' && move.oldSquare === 'e1'){
                revocations.push('KQ')
            }else if(movingColor === 'black' && move.oldSquare === 'e8'){
                revocations.push('kq')
            }
        }else if(isRook){
            const revokedType = CastlesType.fromRooksSquare(move.oldSquare, move.movingPiece)
            if(revokedType){
                revocations.push(revokedType.type)
            }
        }

        for(let i = 0; i<revocations.length; i++){
            this.castleRights = this.castleRights.replace(revocations[i],'')
        }
    }


    #setPiecePlacements(squares64: Squares64): void
    {
        const columnNames = ['a','b','c','d','e','f','g','h']
        let emptySquares = 0

        this.piecePlacements = ''
        for(let row=8;row>=1;row--){
            for(let col =1; col<=8;col++){
                const squareName = columnNames[col - 1] + row.toString()
                //@ts-ignore
                const piece = squares64.get(squareName).piece

                if(piece) {
                    if(emptySquares > 0){
                        this.piecePlacements += emptySquares.toString()
                        emptySquares = 0
                    }
                    this.piecePlacements += FenNumber.getPieceFenType(piece)
                }else{
                    emptySquares++
                }
            }

            if(emptySquares > 0){
                this.piecePlacements += emptySquares.toString()
                emptySquares = 0
            }
            if(row > 1){
                this.piecePlacements += '/'
            }
        }

    }

    updateSquares64(squares64: Squares64): void
    {
        const rows = this.piecePlacements.split('/').reverse()
        if (rows.length !== 8) {
            throw new Error('FEN piece placement must include all eight rows')
        }

        const columnNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const setSquare = function(column: number, row: number, piece: null|Piece)
        {
            const squareName = columnNames[column - 1] + row.toString()
            //@ts-ignore
            squares64.set(squareName, piece)
        }

        for (let rowNumber = 8; rowNumber > 0; rowNumber--) {
            const chars = rows[rowNumber - 1].split('')
            let columnNumber = 1;
            for (let i = 0; i < chars.length; i++) {
                const character = chars[i]
                if (/[1-8]/.test(character)) {
                    const emptySpaces = parseInt(character)
                    const lastEmptySpace = columnNumber + emptySpaces - 1
                    while (columnNumber <= lastEmptySpace) {
                        setSquare(columnNumber, rowNumber, null)
                        columnNumber++
                    }
                } else if (/[rbnqkpRBNQKP]/.test(character)) {
                    // @ts-ignore
                    const piece = FenNumber.makePiece(character)
                    setSquare(columnNumber, rowNumber, piece)
                    columnNumber++
                } else {
                    throw new Error("Unrecognized position character: " + character)
                }
            }
        }
    }


    static makePiece(fenType: ChessPieceType): Piece
    {

        const color = fenType.toLowerCase() === fenType ? Color.BLACK : Color.WHITE

        //@ts-ignore
        fenType = fenType.toLowerCase()
        if(!FenNumber.pieceTypeDictionary.hasOwnProperty(fenType)){
            throw new Error(`Invalid piece type: ${fenType}`)
        }

        return new Piece(
            //@ts-ignore
            FenNumber.pieceTypeDictionary[fenType],
            color
        )
    }

    static getPieceFenType(piece: Piece): string
    {
        const char = piece.type === 'knight' ? 'n' : piece.type.charAt(0)
        if(piece.color === Color.WHITE){
            return char.toUpperCase()
        }
        return char
    }

    toString(includeCounters: boolean = true, includeChecks: boolean = true): string {

        const parts = [
            this.piecePlacements,
            this.sideToMove.charAt(0),
            this.castleRights == null ? '-' : this.castleRights,
            this.enPassantTarget == null ? '-' : this.enPassantTarget,
        ]
        if(includeCounters){
            parts.push(this.halfMoveClock.toString())
            parts.push(this.fullMoveCounter.toString())
        }
        if(includeChecks){
            parts.push(this.isCheck ? '1' : '0')
            parts.push(this.isMate ? '1' : '0')
        }

        return parts.join(' ')
    }

    clone(): FenNumber {
        return new FenNumber(this)
    }
}