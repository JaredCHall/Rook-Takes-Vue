import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";

const advanceTime = (seconds) => {
    const ms = 1000 * seconds
    vi.advanceTimersByTime(ms)
}

describe('BasicTimer', () => {

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(0))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    });

    it('errors if constructed without timeLimit', () => {
        expect(() => {new BasicTimer()}).toThrowError('timeLimit must be a number.')
    })

    it('constructs itself', () => {
        const timer = new BasicTimer(600)
        expect(timer.timeRemaining).toEqual(600)
        expect(timer.timeLimit).toEqual(600)
        expect(timer.turnStartTimeRemaining).toEqual(600)
    })

    it('calculates time elapsed', () => {
        const timer = new BasicTimer(600)
        timer.start()
        advanceTime(1)
        expect(timer.timeElapsed()).toEqual(1)
    })

    it('decrements once per second', () => {
        const timer = new BasicTimer(600)
        timer.start()
        advanceTime(3)
        expect(timer.timeRemaining).toEqual(597)
        advanceTime(3)
        expect(timer.timeRemaining).toEqual(594)
    })

    it('starts and stops' , () => {
        const timer = new BasicTimer(600)
        timer.start()
        advanceTime(3)
        expect(timer.timeRemaining).toEqual(597)
        timer.stop()
        advanceTime(50)
        expect(timer.timeRemaining).toEqual(597)
        timer.start()
        advanceTime(97)
        expect(timer.timeRemaining).toEqual(500)
    })

    it('stops clock when time is expired', () => {
        const timer = new BasicTimer(600)
        timer.start()
        advanceTime(600)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()

        advanceTime(20)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()
    })

})
