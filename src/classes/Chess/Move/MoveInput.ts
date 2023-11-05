import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";

export class MoveInput {

    input: string

    inputType: 'notation'|'squareNames'

    invalidInputMessage = 'Invalid Move: Expected Standard Algebraic Notation or starting and ending square separated by a space.'

    constructor(userInput: string) {
        this.input = userInput.trim()

        this.inputType = 'notation'
        if(this.input.indexOf(' ') !== -1){
            this.inputType = 'squareNames'
        }
    }

    validate(): void {
        if(this.inputType === 'squareNames'){
            if(null === this.input.match(/^[a-h][0-8] [a-h][0-8]$/i)){
                throw new Error(this.invalidInputMessage)
            }
        }

        let input = this.input.replace(/[+#]/,'')

        if(null === this.input.match(/^O-O(-O)?|([KQBNR]?[a-h]?[1-8]?x?[a-h][1-8](=[QBNR])?)$/)) {
            throw new Error(this.invalidInputMessage)
        }
    }

    createMove(moveArbiter: MoveArbiter): ChessMove
    {
        if(this.inputType === 'squareNames'){
            return this.#fromSquareNames(moveArbiter, this.input)
        }
        return this.#fromAlgebraicNotation(moveArbiter, this.input)
    }

    #fromSquareNames(moveArbiter: MoveArbiter, input: string): ChessMove
    {
        const [oldSquare, newSquare] = input.split(' ')

        //@ts-ignore
        const possibleMoves = moveArbiter.getLegalMoves(oldSquare)
        possibleMoves.filter((possibleMove: ChessMove) => {
            return possibleMove.newSquare === newSquare
        })
        if(possibleMoves.length > 0){
            return possibleMoves.first()
        }

        throw new Error(`Invalid Move. ${oldSquare} ${newSquare} is not possible.`)
    }

    #fromAlgebraicNotation(moveArbiter: MoveArbiter, input: string): ChessMove
    {
        throw new Error(`Invalid Move. ${input} is not possible.`)
    }

}