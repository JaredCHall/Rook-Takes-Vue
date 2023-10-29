import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {Assert} from "@/classes/Assert";

export class IncrementTimer extends BasicTimer
{
    increment: number //seconds

    constructor(timeLimit: number, increment: number) {
        super(timeLimit);
        Assert.isNumber(increment,'increment')
        this.increment = increment
    }

    stop() {
        if(this.timeRemaining > 0) {
            this.timeRemaining += this.increment
        }
        super.stop();
    }

}