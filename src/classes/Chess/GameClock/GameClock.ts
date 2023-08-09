import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import type {GameOptions} from "@/classes/Chess/Game/GameOptions";

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


    static make(gameOptions: GameOptions): GameClock
    {

        if(!gameOptions.timer_duration){
            throw new Error('GameConfig must include timer_duration when timer_type is not null')
        }

        if(gameOptions.timer_type === 'Basic'){
            return new GameClock(
                new BasicTimer(gameOptions.timer_duration), // white
                new BasicTimer(gameOptions.timer_duration) // black
            )
        }

        if(gameOptions.timer_type === 'Increment'){
            if(!gameOptions.timer_increment){
                throw new Error('GameConfig must include timer_increment when timer_type is "Increment"')
            }
            return new GameClock(
                new IncrementTimer(gameOptions.timer_duration, gameOptions.timer_increment),
                new IncrementTimer(gameOptions.timer_duration, gameOptions.timer_increment),
            );

        }
        if(gameOptions.timer_type === 'Delay'){
            if(!gameOptions.timer_delay){
                throw new Error('GameConfig must include timer_delay when timer_type is "Delay"')
            }
            return new GameClock(
                new DelayTimer(gameOptions.timer_duration, gameOptions.timer_delay),
                new DelayTimer(gameOptions.timer_duration, gameOptions.timer_delay),
            );
        }

        throw new Error('expected timer_typer')

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