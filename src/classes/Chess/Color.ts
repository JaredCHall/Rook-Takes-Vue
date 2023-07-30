

export type ColorType = 'white'|'black'

export class Color
{
    static readonly WHITE = 'white'
    static readonly BLACK = 'black'

    static getOpposite(color: ColorType): ColorType {
        if(color === 'white'){
            return 'black'
        }
        return 'white'
    }

}

