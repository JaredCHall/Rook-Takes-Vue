import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";

export class MoveList {

    moves: ChessMove[] = []

    get length(): number {
        return this.moves.length
    }

    first(): ChessMove
    {
        return this.moves[0]
    }

    add(move: ChessMove): void {
        this.moves.push(move)
    }

    each(callback: any) {
        for(let i = 0; i < this.moves.length; i++){
            const result = callback(this.moves[i], i)
            if(result === false){
                break;
            }
        }
    }

    map(callback: any) {
        this.each((move: ChessMove, i: number) => {
            this.moves[i] = callback(move, i)
        })
    }

    filter(callback: any) {
        this.moves = this.moves.filter((move: ChessMove) => {
            return callback(move)
        })
    }
}