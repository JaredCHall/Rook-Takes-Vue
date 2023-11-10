import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import type {GameOptions} from "@/classes/Chess/Game/GameOptions";
import {Assert} from "@/classes/Assert";
import type {Game} from "@/classes/Chess/Game/Game";

// TODO: support changing timerType mid-game if there are different timing phases
export class GameClock
{

    timerWhite: BasicTimer

    timerBlack: BasicTimer

    game: Game|null

    constructor(timerWhite: BasicTimer, timerBlack: BasicTimer, game: Game|null = null) {

        Assert.isDefined(timerWhite,'timerWhite')
        Assert.isDefined(timerBlack, 'timerBlack')

        this.timerWhite = timerWhite
        this.timerBlack = timerBlack
        this.game = game

        if(game){
            this.timerWhite.setTimeoutCallback(() => {
                game.setOutOfTime('white')
            })
            this.timerBlack.setTimeoutCallback(() => {
                game.setOutOfTime('black')
            })
        }
    }


    //@ts-ignore
    static make(gameOptions: GameOptions, game: Game|null = null): GameClock
    {

        Assert.notNull(gameOptions.timerDuration, 'gameOptions.timer_duration')
        Assert.isEnum(gameOptions.timerType, ['Basic','Delay','Increment'], 'gameOptions.timer_type')

        if(gameOptions.timerType === 'Basic'){
            return new GameClock(
                //@ts-ignore
                new BasicTimer(gameOptions.timerDuration), // white
                //@ts-ignore
                new BasicTimer(gameOptions.timerDuration), // black
                game
            )
        }

        if(gameOptions.timerType === 'Increment'){
            if(!gameOptions.timerIncrement){
                throw new Error('GameConfig must include timer_increment when timer_type is "Increment"')
            }
            return new GameClock(
                //@ts-ignore
                new IncrementTimer(gameOptions.timerDuration, gameOptions.timerIncrement),
                //@ts-ignore
                new IncrementTimer(gameOptions.timerDuration, gameOptions.timerIncrement),
                game
            );

        }
        if(gameOptions.timerType === 'Delay'){
            if(!gameOptions.timerDelay){
                throw new Error('GameConfig must include timer_delay when timer_type is "Delay"')
            }
            return new GameClock(
                //@ts-ignore
                new DelayTimer(gameOptions.timerDuration, gameOptions.timerDelay),
                //@ts-ignore
                new DelayTimer(gameOptions.timerDuration, gameOptions.timerDelay),
                game
            );
        }
    }
}