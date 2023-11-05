import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Square} from "@/classes/Chess/Square/Square";

export class MoveDisambiguator {

    moveArbiter: MoveArbiter

    move: ChessMove

    constructor(moveArbiter: MoveArbiter, move: ChessMove)
    {
        this.moveArbiter = moveArbiter
        this.move = move
    }

    getDisambiguationString(): string
    {
        const movingPiece = this.move.movingPiece
        const startSquare = this.move.oldSquare
        const [startFile, startRank] = Square.getFileAndRank(startSquare)

        // get all squares containing the same type of piece of the same color
        const samePieceSquares = this.moveArbiter.squares64.getPieceSquares(
            movingPiece.color,
            movingPiece.type
        ).filter((square: Square) => {
            return square.name !== startSquare
        })

        // if no other pieces of the same type are on the board, no disambiguation is required
        if(samePieceSquares.length === 0){
            return '';
        }

        // if there are multiple same pieces, we need to calculate possible moves
        // disambiguate on file first, and only on rank if necessary
        let isFileAmbiguous = false
        let isRankAmbiguous = false

        // calculate moves for each piece and check if they attack the same square as startingSquare
        samePieceSquares.forEach((square: Square) => {

            const possibleMoves = this.moveArbiter.getLegalMoves(square.name)
            possibleMoves.moves.forEach((possibleMove: ChessMove) => {
                if(possibleMove.newSquare === startSquare){
                    const [file, rank] = Square.getFileAndRank(possibleMove.oldSquare)

                    if(rank === startRank){
                        isRankAmbiguous = true
                    }
                    if(file === startFile){
                        isFileAmbiguous = true
                    }
                }
            })
        })

        if(!isRankAmbiguous && !isFileAmbiguous){
            return ''
        }

        if(!isFileAmbiguous){
            return startFile
        }

        if(!isRankAmbiguous){
            return startRank
        }

        return startSquare
    }
}