import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import type {GameOptions} from "@/classes/Chess/Game/GameOptions";
import {Assert} from "@/classes/Assert";

// TODO: support changing timerType mid-game if there are different timing phases
// TODO: support withIncrement AND withDelay???
export class GameClock
{

    timerWhite: BasicTimer

    timerBlack: BasicTimer

    constructor(timerWhite: BasicTimer, timerBlack: BasicTimer) {

        Assert.isDefined(timerWhite,'timerWhite')
        Assert.isDefined(timerBlack, 'timerBlack')

        this.timerWhite = timerWhite
        this.timerBlack = timerBlack
    }


    //@ts-ignore
    static make(gameOptions: GameOptions): GameClock
    {

        Assert.notNull(gameOptions.timer_duration, 'gameOptions.timer_duration')
        Assert.isEnum(gameOptions.timer_type, ['Basic','Delay','Increment'], 'gameOptions.timer_type')

        if(gameOptions.timer_type === 'Basic'){
            return new GameClock(
                //@ts-ignore
                new BasicTimer(gameOptions.timer_duration), // white
                //@ts-ignore
                new BasicTimer(gameOptions.timer_duration) // black
            )
        }

        if(gameOptions.timer_type === 'Increment'){
            if(!gameOptions.timer_increment){
                throw new Error('GameConfig must include timer_increment when timer_type is "Increment"')
            }
            return new GameClock(
                //@ts-ignore
                new IncrementTimer(gameOptions.timer_duration, gameOptions.timer_increment),
                //@ts-ignore
                new IncrementTimer(gameOptions.timer_duration, gameOptions.timer_increment),
            );

        }
        if(gameOptions.timer_type === 'Delay'){
            if(!gameOptions.timer_delay){
                throw new Error('GameConfig must include timer_delay when timer_type is "Delay"')
            }
            return new GameClock(
                //@ts-ignore
                new DelayTimer(gameOptions.timer_duration, gameOptions.timer_delay),
                //@ts-ignore
                new DelayTimer(gameOptions.timer_duration, gameOptions.timer_delay),
            );
        }
    }
}