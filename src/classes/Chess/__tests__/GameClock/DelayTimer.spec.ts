import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";

const advanceTime = (seconds) => {
    const ms = 1000 * seconds
    vi.advanceTimersByTime(ms)
}

describe('DelayTimer', () => {

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(0))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    });

    it('errors if constructed without timeLimit', () => {
        expect(() => {new DelayTimer()}).toThrowError('timeLimit must be a number.')
    })

    it('errors if constructed without delay', () => {
        expect(() => {new DelayTimer(600)}).toThrowError('delay must be a number.')
    })

    it('constructs itself', () => {
        const timer = new DelayTimer(600,5)
        expect(timer.timeRemaining).toEqual(600)
        expect(timer.timeLimit).toEqual(600)
        expect(timer.turnStartTimeRemaining).toEqual(600)
        expect(timer.delay).toEqual(5)
    })

    it('calculates time elapsed', () => {
        const timer = new DelayTimer(600, 5)
        timer.start()
        advanceTime(4)
        expect(timer.timeElapsed()).toEqual(-1)
    })

    it('decrements once per second', () => {
        const timer = new DelayTimer(600, 5)
        timer.start()
        advanceTime(4)
        expect(timer.timeRemaining).toEqual(600)
        advanceTime(2)
        expect(timer.timeRemaining).toEqual(599)
        advanceTime(5)
        expect(timer.timeRemaining).toEqual(594)
    })

    it('starts and stops' , () => {
        const timer = new DelayTimer(600, 5)
        timer.start()
        advanceTime(3)
        expect(timer.timeRemaining).toEqual(600)
        timer.stop()
        advanceTime(50)
        expect(timer.timeRemaining).toEqual(600)
        timer.start()
        advanceTime(100)
        expect(timer.timeRemaining).toEqual(505)
    })

    it('stops clock when time is expired', () => {
        const timer = new DelayTimer(600, 5)
        timer.start()
        advanceTime(605)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()

        advanceTime(20)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()
    })

    it('it calls timeOutCallback when set on time out', () => {
        const mockFn = vi.fn()
        const timer = new DelayTimer(600, 5)
        timer.setTimeoutCallback(mockFn)
        timer.start()
        advanceTime(605)
        expect(mockFn).toHaveBeenCalledOnce()
    })

})
