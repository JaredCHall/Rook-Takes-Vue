import type {ColorType} from "@/classes/Chess/Color";

export class Player {

    readonly color: ColorType

    readonly name: string

    readonly elo: null|number

    readonly title: null|'FM'|'NM'|'IM'|'GM'

    constructor(color: ColorType, name: string, elo: null|number = null, title: null|'FM'|'NM'|'IM'|'GM' = null) {
        this.color = color
        this.name = name
        this.elo = elo
        this.title = title
    }

    static defaultWhite(): Player
    {
        return new Player('white','White')
    }
    static defaultBlack(): Player
    {
        return new Player('black','Black')
    }

}