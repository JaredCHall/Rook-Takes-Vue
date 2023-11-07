import { describe, it, expect } from 'vitest'
import {PgnFile} from "@/classes/Chess/PgnFile/PgnFile";
import {Game} from "@/classes/Chess/Game/Game";

describe('PgnFile' , () => {

    it('constructs itself' , () => {
        const file = new PgnFile()
        expect(file.content).toEqual('')
    })


    it('it creates PGN file of a Scholars Mate' , () => {

        const game = Game.makeNewGame()
        game.gameOptions.input_type = 'Coordinate'

        game.setEventDate(new Date(0))

        game.makeMove('e2 e4')
        game.makeMove('e7 e5')

        game.makeMove('b1 c3')
        game.makeMove('d8 f6')

        game.makeMove('f1 c4')
        game.makeMove('f8 c5')

        game.makeMove('d2 d3')
        game.makeMove('f6 f2')

        const file = PgnFile.make(game)

        expect(file.content).toEqual(`[Event "Casual Game"]
[Site "Sol System"]
[Date "1969.12.31"]
[Round "1"]
[Result "0-1"]
[Termination "Normal"]
[White "White"]
[Black "Black"]
[WhiteElo "?"]
[BlackElo "?"]

1. e4 e5
2. Nc3 Qf6
3. Bc4 Bc5
4. d3 Qxf2#
`)



    })

    it('it creates PGN file of a Scholars Mate using SAN for moves' , () => {

        const game = Game.makeNewGame()
        game.setEventDate(new Date(0))

        game.makeMove('e4')
        game.makeMove('e5')

        game.makeMove('Nc3')
        game.makeMove('Qf6')

        game.makeMove('Bc4')
        game.makeMove('Bc5')

        game.makeMove('d3')
        game.makeMove('Qxf2')

        const file = PgnFile.make(game)

        expect(file.content).toEqual(`[Event "Casual Game"]
[Site "Sol System"]
[Date "1969.12.31"]
[Round "1"]
[Result "0-1"]
[Termination "Normal"]
[White "White"]
[Black "Black"]
[WhiteElo "?"]
[BlackElo "?"]

1. e4 e5
2. Nc3 Qf6
3. Bc4 Bc5
4. d3 Qxf2#
`)



    })


})