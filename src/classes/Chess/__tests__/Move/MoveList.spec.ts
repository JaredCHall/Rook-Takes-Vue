import { describe, it, expect, vi } from 'vitest'
import MoveList from "@/classes/Chess/Move/MoveList";
import ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import PawnPromotionMove from "@/classes/Chess/Move/MoveType/PawnPromotionMove";

vi.mock("@/classes/Chess/Move/MoveType/ChessMove")
vi.mock("@/classes/Chess/Move/MoveType/PawnPromotionMove")


describe('MoveList',()=>{
    it('it adds new move',() => {
        const list = new MoveList()
        const item = new ChessMove()
        list.add(item)
        expect(list.moves[0]).toBe(item)
    })

    it('it gets length',() => {

        const list = new MoveList()
        expect(list.length).toEqual(0)

        list.add(new ChessMove())
        list.add(new ChessMove())
        expect(list.length).toEqual(2)
    })

    it('it loops with each', ()=> {

        const list = new MoveList()
        list.add(new ChessMove())
        list.add(new ChessMove())

        let i = 0
        list.each((move) => {
            expect(move).toBeInstanceOf(ChessMove)
            i++
        })
        expect(i).toEqual(2)
    })

    it('it loops with map', ()=> {
        const list = new MoveList()
        list.add(new ChessMove())
        list.add(new ChessMove())
        list.map((move) => {
            return new PawnPromotionMove(move)
        })
        expect(list.moves[0]).toBeInstanceOf(PawnPromotionMove)
        expect(list.moves[1]).toBeInstanceOf(PawnPromotionMove)
    })
})



