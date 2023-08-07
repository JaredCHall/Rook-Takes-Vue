import type {ExtendedFEN} from "@/classes/Chess/Board/ExtendedFEN";
import type {GameClock} from "@/classes/Chess/GameClock/GameClock";
import type {MaterialScores} from "@/classes/Chess/Board/MaterialScores";



export class GamePosition
{
    readonly extendedFEN: ExtendedFEN

    readonly materialWhite: number|null = null
    readonly materialBlack: number|null = null

    readonly clockWhite: number|null = null
    readonly clockBlack: number|null = null

    constructor(
        extendedFEN: ExtendedFEN,
        materialScores: MaterialScores|null = null,
        gameClock: GameClock|null = null
    ) {

        this.extendedFEN = extendedFEN.clone()

        if(materialScores){
            this.materialWhite = materialScores.white
            this.materialBlack = materialScores.black
        }

        if(gameClock){
            this.clockWhite = gameClock.timerWhite.timeRemaining
            this.clockBlack = gameClock.timerBlack.timeRemaining
        }
    }
}