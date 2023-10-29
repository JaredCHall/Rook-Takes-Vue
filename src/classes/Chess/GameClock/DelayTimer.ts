import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {Assert} from "@/classes/Assert";

export class DelayTimer extends BasicTimer
{
    delay: number //seconds

    constructor(timeLimit: number, delay: number)
    {
        super(timeLimit);
        Assert.isNumber(delay, 'delay')
        this.delay = delay
    }

    start()
    {
        this.turnStartTimeRemaining = this.timeRemaining
        this.turnStartTimestamp = new Date().getTime() + this.delay * 1000
        this.intervalId = setInterval(() => {this.decrementTime()}, 1000)
    }

    decrementTime()
    {
        const elapsed = this.timeElapsed()
        if(elapsed > 0){
            this.timeRemaining = this.turnStartTimeRemaining - this.timeElapsed()
        }

        if(this.timeRemaining <= 0){
            this.outOfTime()
        }
    }
}