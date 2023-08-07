import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";

export class IncrementTimer extends BasicTimer
{
    increment: number //seconds

    constructor(timeLimit: number, increment: number) {
        super(timeLimit);
        this.increment = increment
    }

    stop() {
        this.timeRemaining += this.increment
        super.stop();
    }

}