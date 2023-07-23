import {Color, type ColorType} from "@/classes/Chess/Color";
import SquareCoordinates from "@/classes/Chess/Square/SquareCoordinates";
import type Piece from "@/classes/Chess/Piece";
import Squares144 from "@/classes/Chess/Board/Squares144";

export type SquareType = 'a1'|'a2'|'a3'|'a4'|'a5'|'a6'|'a7'|'a8'|
    'b1'|'b2'|'b3'|'b4'|'b5'|'b6'|'b7'|'b8'|
    'c1'|'c2'|'c3'|'c4'|'c5'|'c6'|'c7'|'c8'|
    'd1'|'d2'|'d3'|'d4'|'d5'|'d6'|'d7'|'d8'|
    'e1'|'e2'|'e3'|'e4'|'e5'|'e6'|'e7'|'e8'|
    'f1'|'f2'|'f3'|'f4'|'f5'|'f6'|'f7'|'f8'|
    'g1'|'g2'|'g3'|'g4'|'g5'|'g6'|'g7'|'g8'|
    'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'h7'|'h8'

export default class Square {
    static readonly A1 = 'a1'
    static readonly A2 = 'a2'
    static readonly A3 = 'a3'
    static readonly A4 = 'a4'
    static readonly A5 = 'a5'
    static readonly A6 = 'a6'
    static readonly A7 = 'a7'
    static readonly A8 = 'a8'

    static readonly B1 = 'b1'
    static readonly B2 = 'b2'
    static readonly B3 = 'b3'
    static readonly B4 = 'b4'
    static readonly B5 = 'b5'
    static readonly B6 = 'b6'
    static readonly B7 = 'b7'
    static readonly B8 = 'b8'

    static readonly C1 = 'c1'
    static readonly C2 = 'c2'
    static readonly C3 = 'c3'
    static readonly C4 = 'c4'
    static readonly C5 = 'c5'
    static readonly C6 = 'c6'
    static readonly C7 = 'c7'
    static readonly C8 = 'c8'

    static readonly D1 = 'd1'
    static readonly D2 = 'd2'
    static readonly D3 = 'd3'
    static readonly D4 = 'd4'
    static readonly D5 = 'd5'
    static readonly D6 = 'd6'
    static readonly D7 = 'd7'
    static readonly D8 = 'd8'

    static readonly E1 = 'e1'
    static readonly E2 = 'e2'
    static readonly E3 = 'e3'
    static readonly E4 = 'e4'
    static readonly E5 = 'e5'
    static readonly E6 = 'e6'
    static readonly E7 = 'e7'
    static readonly E8 = 'e8'

    static readonly F1 = 'f1'
    static readonly F2 = 'f2'
    static readonly F3 = 'f3'
    static readonly F4 = 'f4'
    static readonly F5 = 'f5'
    static readonly F6 = 'f6'
    static readonly F7 = 'f7'
    static readonly F8 = 'f8'

    static readonly G1 = 'g1'
    static readonly G2 = 'g2'
    static readonly G3 = 'g3'
    static readonly G4 = 'g4'
    static readonly G5 = 'g5'
    static readonly G6 = 'g6'
    static readonly G7 = 'g7'
    static readonly G8 = 'g8'

    static readonly H1 = 'h1'
    static readonly H2 = 'h2'
    static readonly H3 = 'h3'
    static readonly H4 = 'h4'
    static readonly H5 = 'h5'
    static readonly H6 = 'h6'
    static readonly H7 = 'h7'
    static readonly H8 = 'h8'

    static readonly squaresOrder = [
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
    ];

    static readonly whiteSquares = [
        'a8', 'c8', 'e8', 'f8', 'b7', 'd7', 'f7', 'h7',
        'a6', 'c6', 'e6', 'f6', 'b5', 'd5', 'f5', 'h5',
        'a4', 'c4', 'e4', 'f4', 'b3', 'd3', 'f3', 'h3',
        'a2', 'c2', 'e2', 'f2', 'b1', 'd1', 'f1', 'h1',
    ]

    static getCoordinates(squareName: SquareType) {
        const index = Square.squaresOrder.indexOf(squareName);
        const col = index % 8;
        const row = Math.floor(index / 8)

        // return coordinates for both orientations
        return {
            white: new SquareCoordinates(col, row),
            black: new SquareCoordinates(col * -1 + 7, row * -1 + 7)
        }
    }

    name: SquareType

    color: ColorType

    rank: number

    file: string

    whiteCoordinates: SquareCoordinates

    blackCoordinates: SquareCoordinates

    index144: number

    piece: Piece | null

    constructor(name: SquareType, piece: Piece | null = null) {

        this.name = name

        // @ts-ignore
        this.color = Square.whiteSquares.indexOf(this.name) !== -1 ? Color.WHITE : Color.BLACK

        this.rank = parseInt(name.charAt(1))

        this.file = name.charAt(0)

        this.index144 = Squares144.getIndex(this.name)

        this.piece = piece

        const coordinates = Square.getCoordinates(this.name)
        this.whiteCoordinates = coordinates.white
        this.blackCoordinates = coordinates.black

    }

    setPiece(piece:null|Piece): void
    {
        this.piece = piece
    }

    getPiece(): null|Piece
    {
        return this.piece
    }

}