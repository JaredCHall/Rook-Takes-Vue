import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {Square} from "@/classes/Chess/Square/Square";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";

export class MoveFactory {

    moveArbiter: MoveArbiter

    constructor(moveArbiter: MoveArbiter) {
        this.moveArbiter = moveArbiter
    }

    fromInput(input: string, inputType: 'SAN'|'Coordinate'): ChessMove
    {
        switch(inputType){
            case 'SAN': return this.make(SanNotation.fromInput(input, this.moveArbiter.fenNumber.sideToMove))
            case 'Coordinate': return this.make(CoordinateNotation.fromInput(input))
        }

        throw new Error('Unrecognized input type: must be SAN or Coordinate')
    }

    make(notation: SanNotation|CoordinateNotation): ChessMove
    {
        if(notation instanceof SanNotation){
            return this.#fromSanNotation(notation)
        }

        return this.#fromCoordinateNotation(notation)
    }

    #fromSanNotation(notation: SanNotation): ChessMove
    {
        const piece = notation.movingPiece
        const moveArbiter = this.moveArbiter

        let possibleMoves: Array<ChessMove> = [];
        const candidateSquares = moveArbiter
            .squares64
            .getPieceSquares(piece.color, piece.type)
            .filter((square: Square) => {
                const moves = moveArbiter.getLegalMoves(square.name)
                moves.each((move: ChessMove) => {
                    if(move.newSquare === notation.newSquare){
                        if(move instanceof PawnPromotionMove && notation.promoteToType) {
                            move.promoteToType = notation.promoteToType
                        }
                        possibleMoves.push(move)
                    }
                })
                return moves.has(notation.newSquare)
            })

        if(possibleMoves.length === 0){
            throw new Error('Move is illegal.')
        }

        if(possibleMoves.length === 1){
            return possibleMoves[0]
        }

        possibleMoves = possibleMoves.filter((move: ChessMove) => {
            const [candidateStartFile, candidateStartRank] = Square.getFileAndRank(move.oldSquare)

            const matchesFile = notation.startFile && (notation.startFile === candidateStartFile)
            const matchesRank = notation.startRank && (notation.startRank === candidateStartRank)

            if(notation.startFile && !notation.startRank) {
                return matchesFile
            }else if(notation.startRank && !notation.startFile) {
                return matchesRank
            }else if(notation.startFile && notation.startRank){
                return matchesFile && matchesRank
            }
        })

        if(possibleMoves.length === 0){
            throw new Error('Move disambiguation invalid.')
        }

        if(possibleMoves.length === 1){
            return possibleMoves[0]
        }

        throw new Error('Move is ambiguous.')
    }

    #fromCoordinateNotation(notation: CoordinateNotation): ChessMove
    {
        const possibleMoves = this.moveArbiter
            .getLegalMoves(notation.oldSquare)
            .filter((possibleMove: ChessMove) => possibleMove.newSquare === notation.newSquare)
        if(possibleMoves.length > 0){
            const move = possibleMoves.first()
            if(move instanceof PawnPromotionMove && notation.promoteToType){
                move.promoteToType = notation.promoteToType
            }
            return move
        }

        throw new Error(`Invalid Move. ${notation.oldSquare} ${notation.newSquare} is not possible.`)
    }
}