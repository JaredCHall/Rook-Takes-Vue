import { describe, it, expect, vi } from 'vitest'
import {Player} from "../Player";

describe('Player', () => {

    it('it constructs itself', () => {
        let player
        player = new Player('white','StockFish',3500,'GM')

        expect(player.color).toEqual('white')
        expect(player.name).toEqual('StockFish')
        expect(player.elo).toEqual(3500)
        expect(player.title).toEqual('GM')

        player = new Player('black','Player 550')
        expect(player.color).toEqual('black')
        expect(player.name).toEqual('Player 550')
        expect(player.elo).toBeNull()
        expect(player.title).toBeNull()
    })

    it('it makes default players', () => {

        const whiteDefault = Player.defaultWhite()
        expect(whiteDefault).toEqual(new Player('white','White'))

        const blackDefault = Player.defaultBlack()
        expect(blackDefault).toEqual(new Player('black','Black'))
    })

})