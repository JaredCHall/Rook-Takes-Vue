import type {GamePosition} from "@/classes/Chess/Board/GamePosition";
import type {MadeMove} from "@/classes/Chess/Move/MadeMove";

export class MoveHistory
{
    moves: MadeMove[] = []

    startPosition: GamePosition // Game starting position

    repetitionTracker: {[fenPartial: string]: number} = {} // for enforcing the 3-fold repetition rule

    get length(): number {
        return this.moves.length
    }

    constructor(startPosition: GamePosition) {
        this.startPosition = startPosition
        const fenPartial = startPosition.extendedFEN?.toString(false,false)
        this.repetitionTracker[fenPartial] = 1
    }

    add(move: MadeMove): void {
        this.moves.push(move)
        this.#incrementPositionRepetition(move)
    }

    get(moveIndex: number): MadeMove {
        const indexActual = moveIndex - 1
        const move = this.moves[indexActual] ?? null
        if(!move){
            throw new Error('Move at half step '+moveIndex+' does not exist')
        }

        return move
    }

    pop(): MadeMove {
        const move = this.moves.pop()
        if(move === undefined){
            throw new Error('nothing to pop')
        }
        this.#decrementPositionRepetition(move)
        return move
    }

    getPositionBefore(moveIndex: number)
    {
        const indexActual = moveIndex - 1
        if(indexActual <= 0 || this.length === 0) {
            return this.startPosition
        }
        return this.get(indexActual).positionAfter
    }

    getPositionRepetitions(move: MadeMove): number
    {
        const fenPartial = move.fenAfter.toString(false, false)
        return this.repetitionTracker[fenPartial]
    }

    #incrementPositionRepetition(move: MadeMove){
        const fenPartial = move.fenAfter.toString(false, false)
        if(!this.repetitionTracker.hasOwnProperty(fenPartial)){
            this.repetitionTracker[fenPartial] = 1
        }else{
            this.repetitionTracker[fenPartial]++
        }
    }
    #decrementPositionRepetition(move: MadeMove) {
        const fenPartial = move.fenAfter.toString(false, false)
        this.repetitionTracker[fenPartial]--;
    }
}