import { describe, it, expect, vi } from 'vitest'
import {GameResult} from "@/classes/Chess/Board/GameResult";


describe('GameResult',() => {

    it('it constructs itself', () => {

        let gameResult
        gameResult = new GameResult('Draw',null,'3Fold')
        expect(gameResult.type).toEqual('Draw')
        expect(gameResult.winner).toBeNull()
        expect(gameResult.drawType).toEqual('3Fold')
        expect(gameResult.loser).toBeNull()

        gameResult = new GameResult('Mate','white')
        expect(gameResult.type).toEqual('Mate')
        expect(gameResult.winner).toEqual('white')
        expect(gameResult.drawType).toBeNull()
        expect(gameResult.loser).toEqual('black')

    })
})