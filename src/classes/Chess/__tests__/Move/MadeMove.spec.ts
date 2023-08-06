import { describe, it, expect } from 'vitest'

import {FenNumber} from "@/classes/Chess/Board/FenNumber";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {Piece} from "@/classes/Chess/Piece";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";

describe('MadeMove', () => {
    it('it constructs itself', () => {

        const fenAfter = new FenNumber('r1b2rk1/pp3ppp/2n1p3/3pPn2/2Pp3N/3Q4/PqB2PPP/RN3RK1 b - - 1 13')
        const chessMove = new ChessMove('b6','b2',Piece.queenBlack(), Piece.pawnWhite())

        const madeMove = new MadeMove(chessMove, fenAfter)
        expect(madeMove.move).toBe(chessMove)
        expect(madeMove.fenAfter).toBe(fenAfter)
        expect(madeMove.halfStepIndex).toEqual(25)
        expect(madeMove.movingColor).toEqual('black')
    })
})
