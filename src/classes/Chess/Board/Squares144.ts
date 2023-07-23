import type {SquareType} from "@/classes/Chess/Square/Square";
import Square from "@/classes/Chess/Square/Square";
import OutOfBoundsSquare from "@/classes/Chess/Square/OutOfBoundsSquare";
import type Pieces64 from "@/classes/Chess/Board/Pieces64";
import Piece from "@/classes/Chess/Piece";
import type FenNumber from "@/classes/Chess/Board/FenNumber";
import PieceList from "@/classes/Chess/Board/PieceList";

/**
 * A representation of the 64 squares and all nearby out-of-bounds squares
 *      The out-of-bounds squares make move calculation more efficient.
 *      The first level of out-of-bounds squares is necessary for ray tracing.
 *      The second level is necessary for knight moves.
 */
export default class Squares144 {

    // 'x' indicates out of bounds squares. null indicates a real/named square
    static readonly seed = [
        'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x',
        'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x',
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 8
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 7
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 6
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 5
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 4
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 3
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 2
        'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 1
        'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x',
        'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x',
    ]

    static squaresByIndex: { [index: number]: SquareType } = {
        26: 'a8', 27: 'b8', 28: 'c8', 29: 'd8', 30: 'e8', 31: 'f8', 32: 'g8', 33: 'h8', // rank 8
        38: 'a7', 39: 'b7', 40: 'c7', 41: 'd7', 42: 'e7', 43: 'f7', 44: 'g7', 45: 'h7', // rank 7
        50: 'a6', 51: 'b6', 52: 'c6', 53: 'd6', 54: 'e6', 55: 'f6', 56: 'g6', 57: 'h6', // rank 6
        62: 'a5', 63: 'b5', 64: 'c5', 65: 'd5', 66: 'e5', 67: 'f5', 68: 'g5', 69: 'h5', // rank 5
        74: 'a4', 75: 'b4', 76: 'c4', 77: 'd4', 78: 'e4', 79: 'f4', 80: 'g4', 81: 'h4', // rank 4
        86: 'a3', 87: 'b3', 88: 'c3', 89: 'd3', 90: 'e3', 91: 'f3', 92: 'g3', 93: 'h3', // rank 3
        98: 'a2', 99: 'b2', 100: 'c2', 101: 'd2', 102: 'e2', 103: 'f2', 104: 'g2', 105: 'h2', // rank 2
        110: 'a1', 111: 'b1', 112: 'c1', 113: 'd1', 114: 'e1', 115: 'f1', 116: 'g1', 117: 'h1', // rank 1
    }

    static indexesBySquare: { [name: string]: number }; // flipped version of squaresByIndex

    static {
        // flip keys and values of the addressesByIndex property
        Squares144.indexesBySquare = Object.fromEntries(Object.entries(this.squaresByIndex).map(([key, value]) => [value, parseInt(key)]))
    }

    static getIndex(name: SquareType): number {
        return Squares144.indexesBySquare[name]
    }

    static getSquareType(index: number): SquareType {
        return Squares144.squaresByIndex[index]
    }

    cells: (Square | OutOfBoundsSquare)[]

    fenNumber: FenNumber

    pieceList: PieceList

    constructor(fenNumber: FenNumber) {

        this.fenNumber = fenNumber.clone()
        this.pieceList = new PieceList()

        const pieces64 = fenNumber.getPieces64()

        this.cells = [];
        for (let i = 0; i < Squares144.seed.length; i++) {
            const seedValue = Squares144.seed[i]

            // out-of-bounds squares
            if (seedValue === 'x') {
                this.cells[i] = new OutOfBoundsSquare()
                continue;
            }

            // set real squares and their pieces
            const squareType = Squares144.getSquareType(i)
            const piece = pieces64.get(squareType)
            this.cells[i] = new Square(squareType, piece)

            if (piece instanceof Piece) {
                this.pieceList.add(piece)
            }
        }
    }

    getCell(index: number): Square | OutOfBoundsSquare {
        return this.cells[index]
    }

    getSquare(squareType: SquareType): Square {
        const square = this.getCell(Squares144.getIndex(squareType))
        if (square instanceof OutOfBoundsSquare) {
            throw new Error('Square with index ${index} is out of bounds')
        }
        return square
    }

    setPiece(squareType: SquareType, piece: null | Piece): void {
        const square = this.getSquare(squareType)

        // update pieceList, if captures
        const capturedPiece = square.getPiece()
        if (piece === null && capturedPiece instanceof Piece) {
            this.pieceList.remove(capturedPiece)
        }

        square.setPiece(piece)
    }

    getSquares(): Square[] {
        const squares = []
        for (const index in Squares144.squaresByIndex){
            //@ts-ignore
            squares.push(this.getCell(index))
        }
        //@ts-ignore
        return squares
    }

}