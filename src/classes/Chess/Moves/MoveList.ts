import ChessMove from "./ChessMove";

export default class MoveList {

    moves: ChessMove[] = []

    isEmpty(): boolean {
        return this.moves.length === 0
    }

    length(): number {
        return this.moves.length
    }

    all(): ChessMove[] {
        return this.moves
    }

    add(move: ChessMove): void {
        this.moves.push(move)
    }
    remove(move: ChessMove): void {
        this.each((loopMove: ChessMove, i: number) => {
            if(move === loopMove){
                this.moves.splice(i,1)
                return false
            }
        })
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
        this.each((move: ChessMove, i: number) => {
            const result = callback(move, i)
            if(result === false){
                this.moves.splice(i,1)
            }
        })
    }
}