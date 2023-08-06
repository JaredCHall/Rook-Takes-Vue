import type {ColorType} from "@/classes/Chess/Color";

export type ChessPieceType = 'pawn'|'rook'|'knight'|'bishop'|'queen'|'king'

export class Piece
{
    type: ChessPieceType

    color: ColorType

    constructor(type: ChessPieceType, color: ColorType) {
        this.type = type
        this.color = color
    }

    getMaterialValue(): number {
        switch(this.type){
            case 'pawn':
                return 1
            case 'knight':
            case 'bishop':
                return 3
            case 'rook':
                return 5
            case 'queen':
                return 9
        }
        return 0
    }

    clone(): Piece {
        return new Piece(this.type, this.color)
    }

    static pawnWhite(): Piece
    {
        return new Piece('pawn','white')
    }
    static pawnBlack(): Piece
    {
        return new Piece('pawn','black')
    }

    static rookWhite(): Piece {
        return new Piece('rook', 'white');
    }

    static rookBlack(): Piece {
        return new Piece('rook', 'black');
    }

    static knightWhite(): Piece {
        return new Piece('knight', 'white');
    }

    static knightBlack(): Piece {
        return new Piece('knight', 'black');
    }

    static bishopWhite(): Piece {
        return new Piece('bishop', 'white');
    }

    static bishopBlack(): Piece {
        return new Piece('bishop', 'black');
    }

    static queenWhite(): Piece {
        return new Piece('queen', 'white');
    }

    static queenBlack(): Piece {
        return new Piece('queen', 'black');
    }

    static kingWhite(): Piece {
        return new Piece('king', 'white');
    }

    static kingBlack(): Piece {
        return new Piece('king', 'black');
    }

}