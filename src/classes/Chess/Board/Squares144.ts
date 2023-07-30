import type {SquareType} from "@/classes/Chess/Square/Square";
import Square from "@/classes/Chess/Square/Square";
import Squares64 from "@/classes/Chess/Board/Squares64";
import Piece from "@/classes/Chess/Piece";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import type ChessMove from "@/classes/Chess/Moves/ChessMove";
import PawnPromotionMove from "@/classes/Chess/Moves/PawnPromotionMove";

/**
 * A representation of the 64 squares and all nearby out-of-bounds squares
 *      The out-of-bounds squares make move calculation more efficient.
 *      The first level of out-of-bounds squares is necessary for ray tracing.
 *      The second level is necessary for knight moves.
 */
export default class Squares144 {

    static readonly boardBoundary: (0|1)[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 8
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 7
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 6
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 5
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 4
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 3
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 2
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // rank 1
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

    static isIndexOutOfBounds(index: number): boolean {
        return Squares144.boardBoundary[index] === 0
    }

    static getIndex(name: SquareType): number {
        return Squares144.indexesBySquare[name]
    }

    fenNumber: FenNumber

    squares64: Squares64

    constructor(fen: FenNumber|string) {
        this.fenNumber = fen instanceof FenNumber ? fen.clone() : new FenNumber(fen)
        this.squares64 = new Squares64(this.fenNumber)
    }

    makeMove(move: ChessMove): FenNumber
    {
        const moveSteps = move.getMoveSteps()
        for(let i = 0; i < moveSteps.length; i++){
            this.squares64.set(moveSteps[i].squareName, moveSteps[i].piece)
        }

        this.fenNumber.incrementTurn(move)

        return this.fenNumber
    }

    unMakeMove(move: ChessMove, previousFenNumber: FenNumber): FenNumber
    {
        const moveSteps = move.getUndoSteps()
        for(let i = 0; i < moveSteps.length; i++){
            this.squares64.set(moveSteps[i].squareName, moveSteps[i].piece)
        }

        return this.fenNumber = previousFenNumber
    }

    getSquare(squareType: SquareType): Square {
        return this.squares64.get(squareType)
    }

    getSquareByIndex(index: number): Square {
        // @ts-ignore
        return this.getSquare(Squares144.squaresByIndex[index])
    }

    setPiece(squareType: SquareType, piece: null | Piece): void {
        this.squares64.set(squareType, piece)
    }

}