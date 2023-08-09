import { describe, it, expect, vi } from 'vitest'
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {GamePosition} from "@/classes/Chess/Position/GamePosition";

vi.mock("@/classes/Chess/Move/MoveType/ChessMove")


describe('MoveHistory',()=>{

    const dummyPosition = function(fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){
        return new GamePosition(new ExtendedFen(fen))
    }

    const dummyMove = function(fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){
        return new MadeMove(new ChessMove(), new GamePosition(new ExtendedFen(fen)))
    }


    it('it constructs itself', () => {
        const startPosition = dummyPosition()
        const history = new MoveHistory(startPosition)
        expect(history.startPosition).toBe(startPosition)
    })

    it('it adds new move',() => {
        const history = new MoveHistory(dummyPosition())
        const item = dummyMove()
        history.add(item)
        expect(history.moves[0]).toBe(item)
    })

    it('it gets length',() => {

        const history = new MoveHistory(dummyPosition())
        expect(history.length).toEqual(0)

        history.add(dummyMove())
        history.add(dummyMove())
        expect(history.length).toEqual(2)
    })

    it('it gets made move', () => {
        const history = new MoveHistory(dummyPosition())
        expect(history.length).toEqual(0)
        const move1 = dummyMove()
        const move2 = dummyMove()
        const move3 = dummyMove()


        history.add(move1)
        history.add(move2)
        history.add(move3)
        expect(history.get(1)).toEqual(move1)
        expect(history.get(2)).toEqual(move2)
        expect(history.get(3)).toEqual(move3)

        expect(() => history.get(4)).toThrowError('Move at half step 4 does not exist')

    })

    it('it pops last move', () => {

        const history = new MoveHistory(dummyPosition())
        expect(history.length).toEqual(0)
        const move1 = dummyMove()
        const move2 = dummyMove()
        const move3 = dummyMove()

        history.add(move1)
        history.add(move2)
        history.add(move3)
        expect(history.pop()).toEqual(move3)
        expect(history.pop()).toEqual(move2)
        expect(history.pop()).toEqual(move1)

        expect(history).toHaveLength(0)

        expect(() => {history.pop()}).toThrowError('nothing to pop')

    })

    it('it gets fen before', () => {

        const startPosition = dummyPosition()
        const history = new MoveHistory(startPosition)
        expect(history.getPositionBefore(1)).toBe(startPosition)
        expect(history.getPositionBefore(123)).toBe(startPosition)

        const positionAfter1 = dummyPosition()
        const move1 = new MadeMove(
            new ChessMove(),
            positionAfter1,
        )
        history.add(move1)
        expect(history.getPositionBefore(1)).toEqual(startPosition)

        const positionAfter2 = dummyPosition()
        const move2 = new MadeMove(
            new ChessMove(),
            positionAfter2,
        )
        history.add(move2)

        expect(history.getPositionBefore(1)).toBe(startPosition)
        expect(history.getPositionBefore(2)).toBe(positionAfter1)

    })
})