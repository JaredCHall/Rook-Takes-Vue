
export class BasicTimer
{
    timeLimit: number // seconds

    timeRemaining: number // seconds

    intervalId: number|null = null

    startTimestamp: number|null = null // timestamp of the last time the timer was started (to stay sync'ed with system clock)

    constructor(timeLimit: number) {
        this.timeLimit = timeLimit
        this.timeRemaining = timeLimit
    }

    outOfTime(): void
    {
        this.stop()
    }

    start()
    {
        this.startTimestamp = new Date().getTime()
        this.intervalId = setInterval(this.decrementTime)
    }

    decrementTime(): void
    {
        this.timeRemaining -= this.timeElapsed()
        if(this.timeRemaining <= 0){
            this.outOfTime()
        }
    }

    timeElapsed(): number
    {
        // @ts-ignore
        return Math.floor(new Date().getTime() - this.startTimestamp / 1000)
    }



    stop(): void
    {
        if(!this.intervalId){
            return
        }

        clearInterval(this.intervalId)
        this.intervalId = null
    }


}