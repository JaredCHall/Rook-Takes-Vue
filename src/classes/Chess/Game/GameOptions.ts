
export class GameOptions {

    drawBy3foldRepetition: boolean = true

    drawBy50moveRule: boolean = true

    countMaterial: boolean = true

    timerType: null|'Basic'|'Increment'|'Delay' = null

    timerDuration: null|number = null

    timerIncrement: null|number = null

    timerDelay: null|number = null

    inputType: 'SAN'|'Coordinate' = 'SAN'

}