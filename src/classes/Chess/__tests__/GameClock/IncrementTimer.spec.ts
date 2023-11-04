import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";

const advanceTime = (seconds) => {
    const ms = 1000 * seconds
    vi.advanceTimersByTime(ms)
}

describe('IncrementTimer', () => {

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(0))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    });

    it('errors if constructed without timeLimit', () => {
        expect(() => {new IncrementTimer()}).toThrowError('timeLimit must be a number.')
    })

    it('errors if constructed without increment', () => {
        expect(() => {new IncrementTimer(600)}).toThrowError('increment must be a number.')
    })

    it('constructs itself', () => {
        const timer = new IncrementTimer(600,5)
        expect(timer.timeRemaining).toEqual(600)
        expect(timer.timeLimit).toEqual(600)
        expect(timer.turnStartTimeRemaining).toEqual(600)
        expect(timer.increment).toEqual(5)
    })

    it('calculates time elapsed', () => {
        const timer = new IncrementTimer(600, 5)
        timer.start()
        advanceTime(4)
        expect(timer.timeElapsed()).toEqual(4)
    })

    it('decrements once per second', () => {
        const timer = new IncrementTimer(600, 5)
        timer.start()
        advanceTime(4)
        expect(timer.timeRemaining).toEqual(596)
        advanceTime(2)
        expect(timer.timeRemaining).toEqual(594)
        advanceTime(5)
        expect(timer.timeRemaining).toEqual(589)
    })

    it('starts and stops' , () => {
        const timer = new IncrementTimer(600, 5)
        timer.start()
        advanceTime(3)
        expect(timer.timeRemaining).toEqual(597)
        timer.stop()
        expect(timer.timeRemaining).toEqual(602)
        advanceTime(50)
        expect(timer.timeRemaining).toEqual(602)
        timer.start()
        advanceTime(100)
        expect(timer.timeRemaining).toEqual(502)
        timer.stop()
        expect(timer.timeRemaining).toEqual(507)
    })

    it('stops clock when time is expired', () => {
        const timer = new IncrementTimer(600, 5)
        timer.start()
        advanceTime(600)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()

        advanceTime(20)
        expect(timer.timeRemaining).toEqual(0)
        expect(timer.intervalId).toBeNull()
    })

    it('it calls timeOutCallback when set on time out', () => {
        const mockFn = vi.fn()
        const timer = new IncrementTimer(600, 5)
        timer.setTimeoutCallback(mockFn)
        timer.start()
        advanceTime(600)
        expect(mockFn).toHaveBeenCalledOnce()
    })

})
