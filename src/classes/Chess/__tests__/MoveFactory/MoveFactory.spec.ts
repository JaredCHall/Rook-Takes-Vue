import { describe, it, expect, vi } from 'vitest'

import FenNumber from "@/classes/Chess/Board/FenNumber";
import Squares144 from "@/classes/Chess/Board/Squares144";

import MoveFactory from "@/classes/Chess/MoveFactory/MoveFactory";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import MoveArbiter from "@/classes/Chess/MoveFactory/MoveArbiter";

vi.mock("@/classes/Chess/MoveFactory/MoveEngine")
vi.mock( "@/classes/Chess/MoveFactory/MoveArbiter")

describe('MoveFactory', () => {
    it('it constructs itself', () => {
        const fenNumber = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const moveFactory = new MoveFactory(fenNumber)

        expect(moveFactory.squares144).toBeInstanceOf(Squares144)
        expect(moveFactory.moveEngine).toBeInstanceOf(MoveEngine)
        expect(moveFactory.moveArbiter).toBeInstanceOf(MoveArbiter)
    })
    it('it gets moves for square', () => {
        const fenNumber = new FenNumber('r1bqkb1r/pppp1p1p/2n2np1/8/3PP3/5Q2/PPP2PPP/RNB1KBNR w')
        const moveFactory = new MoveFactory(fenNumber)

        moveFactory.getMovesFromSquare('e4')

        expect(moveFactory.moveEngine.getPseudoLegalMoves)
            .toHaveBeenCalledWith('e4', fenNumber)

    })
})
