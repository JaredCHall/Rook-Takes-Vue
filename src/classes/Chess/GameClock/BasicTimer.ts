import {Assert} from "@/classes/Assert";

export class BasicTimer
{
    timeLimit: number // seconds

    timeRemaining: number // seconds

    intervalId: number|null = null

    turnStartTimestamp: number|null = null // timestamp of the last time the timer was started (to stay sync'ed with system clock)

    turnStartTimeRemaining: number // seconds remaining at start of current turn

    onTimeOutCallback: () => void = () => {}

    constructor(timeLimit: number)
    {
        Assert.isNumber(timeLimit,'timeLimit')
        this.timeLimit = timeLimit
        this.timeRemaining = timeLimit
        this.turnStartTimeRemaining = timeLimit

    }

    setTimeoutCallback(onTimeOutCallback: () => void)
    {
        this.onTimeOutCallback = onTimeOutCallback
    }

    outOfTime(): void
    {
        this.timeRemaining = 0
        this.stop()
        this.onTimeOutCallback()
    }

    start()
    {
        this.turnStartTimestamp = new Date().getTime()
        this.turnStartTimeRemaining = this.timeRemaining
        this.intervalId = setInterval(() => {this.decrementTime()}, 1000)
    }

    decrementTime(): void
    {
        this.timeRemaining = this.turnStartTimeRemaining - this.timeElapsed()
        if(this.timeRemaining <= 0){
            this.outOfTime()
        }
    }

    timeElapsed(): number
    {
        // @ts-ignore
        return Math.floor(((new Date().getTime()) - this.turnStartTimestamp) / 1000)
    }

    stop(): void
    {
        if(this.intervalId){
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        this.turnStartTimestamp = null
    }
}