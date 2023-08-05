import { describe, it, expect, vi } from 'vitest'
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {FenNumber} from "@/classes/Chess/Board/FenNumber";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";

vi.mock( "@/classes/Chess/Board/FenNumber")
vi.mock("@/classes/Chess/Move/MoveType/ChessMove")

describe('MoveHistory',()=>{

    const dummyMove = function(){
        return new MadeMove(new ChessMove(), new FenNumber())
    }

    it('it constructs itself', () => {
        const startFen = new FenNumber()
        const list = new MoveHistory(startFen)
        expect(list.startFen).toBe(startFen)
    })

    it('it adds new move',() => {
        const list = new MoveHistory(new FenNumber())
        const item = dummyMove()
        list.add(item)
        expect(list.moves[0]).toBe(item)
    })

    it('it gets length',() => {

        const list = new MoveHistory(new FenNumber())
        expect(list.length).toEqual(0)

        list.add(dummyMove())
        list.add(dummyMove())
        expect(list.length).toEqual(2)
    })

    it('it gets made move', () => {
        const list = new MoveHistory(new FenNumber())
        expect(list.length).toEqual(0)
        const move1 = dummyMove()
        const move2 = dummyMove()
        const move3 = dummyMove()


        list.add(move1)
        list.add(move2)
        list.add(move3)
        expect(list.get(1)).toEqual(move1)
        expect(list.get(2)).toEqual(move2)
        expect(list.get(3)).toEqual(move3)

        expect(() => list.get(4)).toThrowError('Move at half step 4 does not exist')

    })

    it('it pops last move', () => {



        const list = new MoveHistory(new FenNumber())
        expect(list.length).toEqual(0)
        const move1 = dummyMove()
        const move2 = dummyMove()
        const move3 = dummyMove()

        list.add(move1)
        list.add(move2)
        list.add(move3)
        expect(list.pop()).toEqual(move3)
        expect(list.pop()).toEqual(move2)
        expect(list.pop()).toEqual(move1)

        expect(list).toHaveLength(0)

        expect(() => {list.pop()}).toThrowError('nothing to pop')

    })

    it('it gets fen before', () => {

        const startFen = new FenNumber()
        const list = new MoveHistory(startFen)
        expect(list.getFenBefore(1)).toBe(startFen)
        expect(list.getFenBefore(123)).toBe(startFen)

        const fenAfter1 = new FenNumber()
        const move1 = new MadeMove(
            new ChessMove(),
            fenAfter1,
        )
        list.add(move1)
        expect(list.getFenBefore(1)).toBe(startFen)

        const fenAfter2 = new FenNumber()
        const move2 = new MadeMove(
            new ChessMove(),
            fenAfter2,
        )
        list.add(move2)

        expect(list.getFenBefore(1)).toBe(startFen)
        expect(list.getFenBefore(2)).toBe(fenAfter1)

    })
})