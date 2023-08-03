import type ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import type FenNumber from "@/classes/Chess/Board/FenNumber";
import MoveList from "@/classes/Chess/Move/MoveList";
import type MadeMove from "@/classes/Chess/Move/MadeMove";

export default class MoveHistory
{
    moves: MadeMove[] = []

    startFen: FenNumber // Game starting position

    get length(): number {
        return this.moves.length
    }

    constructor(startFen: FenNumber) {
        this.startFen = startFen
    }

    add(move: MadeMove): void {
        this.moves.push(move)
    }

    get(halfStepIndex: number): MadeMove {
        const move = this.moves[halfStepIndex] ?? null
        if(!move){
            throw new Error('Move at half step '+halfStepIndex+' does not exist')
        }

        return move
    }

    pop(): MadeMove {
        const move = this.moves.pop()
        if(move === undefined){
            throw new Error('nothing to pop')
        }
        return move
    }

    getFenBefore(halfStepIndex: number)
    {
        if(halfStepIndex === 0 || this.length === 0){
            return this.startFen
        }

        return this.get(halfStepIndex - 1).fenAfter
    }
}