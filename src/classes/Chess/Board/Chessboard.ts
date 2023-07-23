import Square from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Squares144 from "@/classes/Chess/Board/Squares144";
import FenNumber from "@/classes/Chess/Board/FenNumber";

export default class Chessboard
{

    static makeNewGame(): Chessboard
    {
        return new Chessboard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }

    static makeEmptyBoard(): Chessboard
    {
        return new Chessboard('8/8/8/8/8/8/8/8 w - -')
    }


    squares144: Squares144

    fenNumber: FenNumber

    constructor(fen:string) {
        this.fenNumber = new FenNumber(fen)
        this.squares144 = new Squares144(this.fenNumber)
    }

    getSquare(squareType: SquareType): Square
    {
        return this.squares144.getSquare(squareType)
    }

    getMoves(squareType: SquareType): []
    {
        return []
    }
}