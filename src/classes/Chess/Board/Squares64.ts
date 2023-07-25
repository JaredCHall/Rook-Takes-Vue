import type {SquareType} from "@/classes/Chess/Square/Square";
import Piece from "@/classes/Chess/Piece";
import PieceList from "@/classes/Chess/Board/PieceList";
import Square from "@/classes/Chess/Square/Square";

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

    pieceList: PieceList

    constructor() {
        this.pieceList = new PieceList()
        for(const i in Squares64.squaresOrder){
            const squareName = Squares64.squaresOrder[i]
            this.squares[squareName] = new Square(squareName, null)
        }
    }

    set(squareType: SquareType, piece: null|Piece): void {

        const capturedPiece = this.get(squareType).piece

        // set new piece for square
        this.squares[squareType].setPiece(piece)

        // remove existing piece, if it is being captured
        if(capturedPiece instanceof Piece){
            this.pieceList.remove(capturedPiece)
        }
    }

    get(squareType: SquareType): Square {
        return this.squares[squareType]
    }

    each(callback: any): void {
        for(const i in this.squares){
            callback(this.squares[i], i)
        }
    }
}