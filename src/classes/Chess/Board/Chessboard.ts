import Square from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import Squares144 from "@/classes/Chess/Board/Squares144";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares64 from "@/classes/Chess/Board/Squares64";
import MoveFactory from "@/classes/Chess/MoveFactory/MoveFactory";

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

    fenNumber: FenNumber

    squares64: Squares64

    moveFactory: MoveFactory

    constructor(fen: string) {
        this.fenNumber = new FenNumber(fen)
        this.squares64 = new Squares64(this.fenNumber)
        this.moveFactory = new MoveFactory(this.fenNumber)
    }

    getSquare(squareType: SquareType): Square
    {
        return this.squares64.get(squareType)
    }

    getMoves(squareType: SquareType): []
    {
        return []
    }
}