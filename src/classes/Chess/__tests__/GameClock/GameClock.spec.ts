import { describe, it, expect} from 'vitest'
import {GameClock} from "@/classes/Chess/GameClock/GameClock";
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {GameOptions} from "@/classes/Chess/Game/GameOptions";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";

describe('GameClock', () => {

    it('constructs itself', () => {

        expect(() => {new GameClock()})
            .toThrowError('timerWhite must be defined.')
        expect(() => {new GameClock(new BasicTimer(600))})
            .toThrowError('timerBlack must be defined.')

        const clock = new GameClock(
            new BasicTimer(600),
            new BasicTimer(1200)
        )

        expect(clock.timerBlack).toBeInstanceOf(BasicTimer)
        expect(clock.timerBlack.timeRemaining).toEqual(1200)
        expect(clock.timerWhite).toBeInstanceOf(BasicTimer)
        expect(clock.timerWhite.timeRemaining).toEqual(600)

    })

    it('errors when making clock from invalid options', () => {
        let options = new GameOptions()

        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timer_type = 'invalid'
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timer_type = 'Basic'
        options.timer_duration = null
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timer_type = 'Increment'
        options.timer_duration = 600
        options.timer_increment = null
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timer_type = 'Delay'
        options.timer_duration = 600
        options.timer_delay = null
        expect(() => {GameClock.make(options)}).toThrowError()

    })

    it('makes basic clock from options', () => {

        const options = new GameOptions()
        options.timer_type = 'Basic'
        options.timer_duration = 300

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(BasicTimer)
        expect(clock.timerBlack.timeRemaining).toEqual(300)
        expect(clock.timerWhite).toBeInstanceOf(BasicTimer)
        expect(clock.timerWhite.timeRemaining).toEqual(300)

    })

    it('makes delay clock from options', () => {

        const options = new GameOptions()
        options.timer_type = 'Delay'
        options.timer_duration = 300
        options.timer_delay = 3

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(DelayTimer)
        expect(clock.timerBlack.delay).toEqual(3)
        expect(clock.timerWhite).toBeInstanceOf(DelayTimer)
        expect(clock.timerWhite.delay).toEqual(3)

    })

    it('makes increment clock from options', () => {

        const options = new GameOptions()
        options.timer_type = 'Increment'
        options.timer_duration = 300
        options.timer_increment = 5

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(IncrementTimer)
        expect(clock.timerBlack.increment).toEqual(5)
        expect(clock.timerWhite).toBeInstanceOf(IncrementTimer)
        expect(clock.timerWhite.increment).toEqual(5)

    })

})