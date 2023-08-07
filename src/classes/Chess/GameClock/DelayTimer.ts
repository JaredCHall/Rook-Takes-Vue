import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";

export class DelayTimer extends BasicTimer
{
    delay: number //seconds

    constructor(timeLimit: number, delay: number) {
        super(timeLimit);
        this.delay = delay
    }

    start()
    {
        this.startTimestamp = (new Date().getTime()) + this.delay * 1000
        this.intervalId = setInterval(this.decrementTime)
    }

    decrementTime()
    {
        const elapsed = this.timeElapsed()
        if(elapsed > 0){
            this.timeRemaining -= elapsed
        }

        if(this.timeRemaining <= 0){
            this.outOfTime()
        }
    }
}