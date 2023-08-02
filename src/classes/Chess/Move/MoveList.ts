import ChessMove from "./MoveType/ChessMove";

export default class MoveList {

    moves: ChessMove[] = []

    get length(): number {
        return this.moves.length
    }

    get last(): ChessMove|null {
        if(this.moves.length === 0){
            return null
        }

        return this.moves[this.moves.length - 1]
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
}