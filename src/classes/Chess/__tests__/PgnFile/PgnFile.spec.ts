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
[Date "2023.11.05"]
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