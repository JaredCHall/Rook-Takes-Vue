import { describe, it, expect, vi} from 'vitest'
import {GameClock} from "@/classes/Chess/GameClock/GameClock";
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";
import {GameOptions} from "@/classes/Chess/Game/GameOptions";
import {DelayTimer} from "@/classes/Chess/GameClock/DelayTimer";
import {IncrementTimer} from "@/classes/Chess/GameClock/IncrementTimer";



describe('GameClock', () => {

    it('constructs itself', () => {

        // errors
        expect(() => {new GameClock()})
            .toThrowError('timerWhite must be defined.')
        expect(() => {new GameClock(new BasicTimer(600))})
            .toThrowError('timerBlack must be defined.')

        // no game argument
        let clock = new GameClock(
            new BasicTimer(600),
            new BasicTimer(1200)
        )
        expect(clock.timerBlack).toBeInstanceOf(BasicTimer)
        expect(clock.timerBlack.timeRemaining).toEqual(1200)
        expect(clock.timerWhite).toBeInstanceOf(BasicTimer)
        expect(clock.timerWhite.timeRemaining).toEqual(600)

        // with game argument
        const game = {}
        clock = new GameClock(new BasicTimer(600),new BasicTimer(600), game)
        expect(clock.game).toBe(game)

    })

    it('errors when making clock from invalid options', () => {
        let options = new GameOptions()

        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timerType = 'invalid'
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timerType = 'Basic'
        options.timerDuration = null
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timerType = 'Increment'
        options.timerDuration = 600
        options.timerIncrement = null
        expect(() => {GameClock.make(options)}).toThrowError()

        options = new GameOptions()
        options.timerType = 'Delay'
        options.timerDuration = 600
        options.timerDelay = null
        expect(() => {GameClock.make(options)}).toThrowError()

    })

    it('makes basic clock from options', () => {

        const options = new GameOptions()
        options.timerType = 'Basic'
        options.timerDuration = 300

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(BasicTimer)
        expect(clock.timerBlack.timeRemaining).toEqual(300)
        expect(clock.timerWhite).toBeInstanceOf(BasicTimer)
        expect(clock.timerWhite.timeRemaining).toEqual(300)

    })

    it('makes delay clock from options', () => {

        const options = new GameOptions()
        options.timerType = 'Delay'
        options.timerDuration = 300
        options.timerDelay = 3

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(DelayTimer)
        expect(clock.timerBlack.delay).toEqual(3)
        expect(clock.timerWhite).toBeInstanceOf(DelayTimer)
        expect(clock.timerWhite.delay).toEqual(3)

    })

    it('makes increment clock from options', () => {

        const options = new GameOptions()
        options.timerType = 'Increment'
        options.timerDuration = 300
        options.timerIncrement = 5

        const clock = GameClock.make(options)
        expect(clock.timerBlack).toBeInstanceOf(IncrementTimer)
        expect(clock.timerBlack.increment).toEqual(5)
        expect(clock.timerWhite).toBeInstanceOf(IncrementTimer)
        expect(clock.timerWhite.increment).toEqual(5)

    })

    it('it calls outOfTime correctly' , () => {
        const options = new GameOptions()
        options.timerType = 'Increment'
        options.timerDuration = 300
        options.timerIncrement = 5

        const game = {
            setOutOfTime: vi.fn()
        }
        const clock = GameClock.make(options, game)

        clock.timerWhite.outOfTime()
        clock.timerBlack.outOfTime()

        expect(game.setOutOfTime).toHaveBeenNthCalledWith(1, 'white')
        expect(game.setOutOfTime).toHaveBeenNthCalledWith(2, 'black')
    })
})