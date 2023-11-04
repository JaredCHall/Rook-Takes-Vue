import { describe, it, expect } from 'vitest'
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {MaterialScores} from "@/classes/Chess/Position/MaterialScores";
import {GameClock} from "@/classes/Chess/GameClock/GameClock";
import {GamePosition} from "@/classes/Chess/Position/GamePosition";
import {BasicTimer} from "@/classes/Chess/GameClock/BasicTimer";

describe('GamePosition', () => {

    it('constructs itself', () => {

        const fen = new ExtendedFen('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w - - - - 1 1')
        const scores = new MaterialScores(15,25)
        const clock = new GameClock(new BasicTimer(50), new BasicTimer(100))

        // 1 argument
        let position = new GamePosition(fen)
        expect(position.extendedFEN).not.toBe(fen)
        expect(position.extendedFEN).toEqual(fen)
        expect(position.materialWhite).toBeNull()
        expect(position.materialBlack).toBeNull()
        expect(position.clockWhite).toBeNull()
        expect(position.clockBlack).toBeNull()

        // 2 arguments
        position = new GamePosition(fen, scores)
        expect(position.extendedFEN).not.toBe(fen)
        expect(position.extendedFEN).toEqual(fen)
        expect(position.materialWhite).toBe(15)
        expect(position.materialBlack).toBe(25)
        expect(position.clockWhite).toBeNull()
        expect(position.clockBlack).toBeNull()

        // 3 arguments
        position = new GamePosition(fen, scores, clock)
        expect(position.extendedFEN).not.toBe(fen)
        expect(position.extendedFEN).toEqual(fen)
        expect(position.materialWhite).toBe(15)
        expect(position.materialBlack).toBe(25)
        expect(position.clockWhite).toBe(50)
        expect(position.clockBlack).toBe(100)
    })
})