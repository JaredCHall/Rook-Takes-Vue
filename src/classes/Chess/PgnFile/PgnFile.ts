import type {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import type {Game} from "@/classes/Chess/Game/Game";
import type {GameResult} from "@/classes/Chess/Game/GameResult";
import type {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";

export class PgnFile
{

    content: string

    constructor() {
        this.content = ''
    }

    static make(game: Game): PgnFile
    {
        // if game was played in coordinate notation, SAN notations will need to be hydrated
        if(game.gameOptions.moveNotationType === 'Coordinate'){
            this.hydrateSanNotations(game)
        }

        const file = new PgnFile()

        // Header
        file.#addHeaderLine('Event', game.eventName)
        file.#addHeaderLine('Site', game.siteName)
        file.#addHeaderLine('Date', file.#formatDateHeader(game.startDate))
        file.#addHeaderLine('Round', game.eventRound.toString())
        file.#addHeaderLine('Result', file.#formatResultHeader(game.gameResult))
        if(game.gameResult){
            file.#addHeaderLine('Termination', file.#formatTerminationHeader(game.gameResult))
        }
        file.#addHeaderLine('White', game.playerWhite.name)
        file.#addHeaderLine('Black', game.playerBlack.name)
        file.#addHeaderLine('WhiteElo', game.playerWhite.elo?.toString() ?? '?')
        file.#addHeaderLine('BlackElo', game.playerBlack.elo?.toString() ?? '?')

        // Body (moves)
        file.content += '\n'
        file.content += file.#formatMoveList(game.moveHistory)

        return file
    }

    private static hydrateSanNotations(game: Game): void
    {
        console.log(game.moveHistory.startPosition.extendedFEN)
        const arbiter = MoveArbiter.fromFen(game.moveHistory.startPosition.extendedFEN)
        game.moveHistory.moves.forEach((move: MadeMove) => {
            const notation = arbiter.moveNotary.getNotation(move.move, 'SAN')
            arbiter.makeMove(move.move, notation)
            move.setSanNotation(notation.serialize())
        })
    }

    #formatMoveList(moveHistory: MoveHistory): string
    {
        let moveText = ''
        let fenBefore = moveHistory.startPosition.extendedFEN
        moveHistory.moves.forEach((move: MadeMove) => {
            if(move.movingColor == 'white'){
                moveText += fenBefore.fullMoveCounter.toString() + '.'
            }
            moveText += ' '
            moveText += move.getNotation('SAN')
            if(move.movingColor == 'black'){
                moveText += '\n'
            }
            fenBefore = move.fenAfter
        })

        return moveText
    }


    #formatResultHeader(result: GameResult|null): string
    {
        if(!result){
            return '*'
        }

        if(result.winner === 'white'){
            return '1-0'
        }
        if(result.winner === 'black'){
            return '0-1'
        }

        return '1/2-1/2'
    }

    #formatTerminationHeader(result: GameResult): string
    {
        if(result.type === 'OutOfTime'){
            return 'Time Forfeit'
        }

        return 'Normal'
    }

    #formatDateHeader(date: Date): string
    {
        const pad2 = (val: number) => {
            return val.toString().padStart(2, '0')
        }

        const yyyy = date.getFullYear()
        // increment month since index starts at zero for january
        const mm = pad2(date.getMonth() + 1)
        const dd = pad2(date.getDate())

        return `${yyyy}.${mm}.${dd}`
    }

    #addHeaderLine(key: string, value: string)
    {
        const escapedValue = value.replace(/"/g,'\\"')
        this.content += `[${key} "${escapedValue}"]\n`
    }
}