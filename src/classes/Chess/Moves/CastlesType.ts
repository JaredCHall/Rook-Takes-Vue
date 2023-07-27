import type {SquareType} from "@/classes/Chess/Square/Square";
import type {ColorType} from "@/classes/Chess/Color";

export default class CastlesType {
    readonly rooksOldSquare: SquareType
    readonly rooksNewSquare: SquareType
    readonly kingsOldSquare: SquareType
    readonly kingsNewSquare: SquareType
    readonly squaresThatMustBeEmpty: SquareType[]
    readonly squaresThatMustBeSafe: SquareType[]
    readonly notation: 'O-O'|'O-O-O'

    constructor(
        rooksOldSquare: SquareType,
        rooksNewSquare: SquareType,
        kingsOldSquare: SquareType,
        kingsNewSquare: SquareType,
        squaresThatMustBeEmpty: SquareType[],
        squaresThatMustBeSafe: SquareType[],
        notation: 'O-O'|'O-O-O'
    ) {
        this.rooksOldSquare = rooksOldSquare
        this.rooksNewSquare = rooksNewSquare
        this.kingsOldSquare = kingsOldSquare
        this.kingsNewSquare = kingsNewSquare
        this.squaresThatMustBeEmpty = squaresThatMustBeEmpty
        this.squaresThatMustBeSafe = squaresThatMustBeSafe
        this.notation = notation
    }


    static create(castlesType: 'K'|'Q'|'q'|'k')
    {
        switch(castlesType){
            case 'Q': return new CastlesType(
                'a1',
                'd1',
                'e1',
                'c1',
                ['d1','c1','b1'],
                ['d1','c1','b1'],
                'O-O-O'
                )
            case 'K': return new CastlesType(
                'h1',
                'f1',
                'e1',
                'g1',
                ['f1','g1'],
                ['e1','f1','g1'],
                'O-O',
            )
            case 'q': return new CastlesType(
                'a8',
                'd8',
                'e8',
                'c8',
                ['d8','c8','b8'],
                ['e8','d8','c8'],
                'O-O-O'
            )
            case 'k': return new CastlesType(
                'h8',
                'f8',
                'e8',
                'g8',
                ['f8','g8'],
                ['e8','f8','g8'],
                'O-O'
            )
        }
    }

    static forColor(color: ColorType, castleRights: string): CastlesType[]
    {
        const typeNames = color === 'black' ? ['k','q'] : ['K','Q']

        let types = [];
        for(const i in typeNames){
            const type = typeNames[i];
            if(castleRights.indexOf(type)){
                continue
            }

            //@ts-ignore
            types.push(CastlesType.create(type))
        }

        return types
    }

}