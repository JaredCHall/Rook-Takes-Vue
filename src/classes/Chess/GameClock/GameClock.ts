import type {ColorType} from "@/classes/Chess/Color";
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";

// TODO: support changing timerType mid-game if there are different timing phases
// TODO: support withIncrement AND withDelay???
export class GameClock
{

    timerWhite: BasicTimer

    timerBlack: BasicTimer

    constructor(timerWhite: BasicTimer, timerBlack: BasicTimer) {
        this.timerWhite = timerWhite
        this.timerBlack = timerBlack
    }


    static make(timeLimit: number): GameClock
    {
        return new GameClock(
            new BasicTimer(timeLimit), // white
            new BasicTimer(timeLimit) // black
        )
    }

    static withIncrement(timerLimit: number, increment: number): GameClock
    {
        return new GameClock(
            new IncrementTimer(timerLimit, increment),
            new IncrementTimer(timerLimit, increment),
        );
    }

    static withDelay(timerLimit: number, delay: number): GameClock
    {
        return new GameClock(
            new DelayTimer(timerLimit, delay),
            new DelayTimer(timerLimit, delay),
        );
    }


}