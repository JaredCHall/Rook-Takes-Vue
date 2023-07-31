import type {SquareType} from "@/classes/Chess/Square/Square";
import Piece from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import Square from "@/classes/Chess/Square/Square";
import type {ColorType} from "@/classes/Chess/Color";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import {Color} from "@/classes/Chess/Color";
import ChessMove from "@/classes/Chess/Moves/ChessMove";

/**
 * A representation of the 64 squares
 */
export default class Squares64
{
    static readonly squaresOrder: SquareType[] = [
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
    ];

    static readonly whiteSquares: SquareType[] = [
        'a8', 'c8', 'e8', 'f8', 'b7', 'd7', 'f7', 'h7',
        'a6', 'c6', 'e6', 'f6', 'b5', 'd5', 'f5', 'h5',
        'a4', 'c4', 'e4', 'f4', 'b3', 'd3', 'f3', 'h3',
        'a2', 'c2', 'e2', 'f2', 'b1', 'd1', 'f1', 'h1',
    ]


    // 64 Square objects which may or may not contain Piece objects
    squares: { [squareType: string]: Square } = {}

    kingSquare: {white: Square|null, black: Square|null} = {
        white: null,
        black: null,
    }

    constructor(fenNumber: FenNumber|null = null) {
        for(const i in Squares64.squaresOrder){
            const squareName = Squares64.squaresOrder[i]
            this.squares[squareName] = new Square(squareName, null)
        }

        if(fenNumber instanceof FenNumber){
            this.#setPiecesFromFenNumber(fenNumber)
        }

    }

    set(squareType: SquareType, piece: null|Piece): void {

        const square = this.get(squareType)

        // set new piece for square
        this.get(squareType).setPiece(piece)

        // if it is the king, update kingSquare
        if(piece && piece.type === 'king'){
            this.kingSquare[piece.color] = square
        }

    }

    getKingSquare(color: ColorType): Square|null {
        return this.kingSquare[color]
    }

    getPieceSquares(color: ColorType, type: ChessPieceType|null = null): Square[]
    {
        const squares: Square[] = []
        this.each((square: Square) => {
            if(square.piece && square.piece.color === color) {
                if(!type || type === square.piece.type){
                    squares.push(square)
                }
            }
        })

        return squares
    }

    get(squareType: SquareType): Square {
        return this.squares[squareType]
    }

    makeMove(move: ChessMove): void
    {
        const moveSteps = move.getMoveSteps()
        for(let i = 0; i < moveSteps.length; i++){
            this.set(moveSteps[i].squareName, moveSteps[i].piece)
        }
    }

    unMakeMove(move: ChessMove): void
    {
        const moveSteps = move.getUndoSteps()
        for(let i = 0; i < moveSteps.length; i++){
            this.set(moveSteps[i].squareName, moveSteps[i].piece)
        }
    }


    each(callback: any): void {
        for(const i in this.squares){
            callback(this.squares[i], i)
        }
    }

    clone(): Squares64 {
        const clone = new Squares64()
        for(const i in this.squares){
            const square = this.squares[i]
            if(square.piece){
                clone.set(square.name, square.piece)
            }
        }
        return clone
    }

    #setPiecesFromFenNumber(fenNumber: FenNumber): void {

        if(fenNumber.piecePlacements === undefined){
            throw new Error('FenNumber.piecePlacements is undefined')
        }

        const rows = fenNumber.piecePlacements.split('/').reverse()
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
                        columnNumber++
                    }
                } else if (/[rbnqkpRBNQKP]/.test(character)) {

                    const squareName = columnNames[columnNumber - 1] + rowNumber.toString()
                    // @ts-ignore
                    const piece = FenNumber.makePiece(character)
                    // @ts-ignore
                    this.set(squareName, piece)
                    columnNumber++
                } else {
                    throw new Error("Unrecognized position character: " + character)
                }
            }
        }
    }

}