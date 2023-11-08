import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {Square} from "@/classes/Chess/Square/Square";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";

export class MoveNotary {

    moveArbiter: MoveArbiter

    constructor(moveArbiter: MoveArbiter) {
        this.moveArbiter = moveArbiter
    }

    getNotation(move: ChessMove, notationType:'SAN'|'Coordinate')
    {
        switch(notationType){
            case 'SAN': return this.getSanNotation(move)
            case 'Coordinate': return this.getCoordinateNotation(move)
        }
    }

    getCoordinateNotation(move: ChessMove): CoordinateNotation
    {
        const promoteType = move instanceof PawnPromotionMove ? move.promoteToType : null
        return new CoordinateNotation(move.oldSquare, move.newSquare, promoteType)
    }

    // get the SAN notation for a move in the current position
    // does not compute check / check mate tokens, use ->setFenAfter() for that
    // call before move is made
    getSanNotation(move: ChessMove): SanNotation
    {
        if(move.movingPiece.color !== this.moveArbiter.fenNumber.sideToMove){
            throw new Error(`method must be called before move is made`)
        }

        if(move instanceof CastlingMove){
            return new SanNotation(
                move.movingPiece,
                false,
                move.castlesType.kingsNewSquare,
                move.castlesType,
                null,
                null,
                null,
                null
            )
        }

        const isCapture = !!move.capturedPiece
        const promotionType = move instanceof PawnPromotionMove ? move.promoteToType : null
        const [startFile, startRank] = this.#getDisambiguation(move)

        return new SanNotation(
            move.movingPiece,
            isCapture,
            move.newSquare,
            null,
            promotionType,
            startFile,
            startRank,
            null,
        )
    }

    #getDisambiguation(move: ChessMove): [startFile: string|null, startRank: number|null]
    {
        let isFileAmbiguous = false
        let isRankAmbiguous = false

        const movingPiece = move.movingPiece
        const startSquare = move.oldSquare
        const targetSquare = move.newSquare
        const [startFile, startRank] = Square.getFileAndRank(startSquare)

        if(movingPiece.type === 'pawn'){
            if(move.capturedPiece){
                // pawn moves are always disambiguated when captures
                return [startFile, null];
            }
            // never disambiguated otherwise
            return [null, null];
        }

        // get all squares containing a piece of the same type/color as moving piece
        const samePieceSquares = this.moveArbiter.squares64.getPieceSquares(
            movingPiece.color,
            movingPiece.type
        ).filter((square: Square) => square.name !== startSquare) // do not include startSquare

        // if no other pieces of the same type are on the board, no disambiguation is required
        if(samePieceSquares.length === 0){
            return [null, null];
        }

        // if there are multiple same pieces, we need to calculate possible moves
        samePieceSquares.forEach((square: Square) => {
            this.moveArbiter
                // only moves with the same target square
                .getLegalMoves(square.name, (possibleMove: ChessMove) => possibleMove.newSquare === targetSquare)
                .each((possibleMove: ChessMove) => {
                    const [file, rank] = Square.getFileAndRank(possibleMove.oldSquare)
                    if(file === startFile){
                        // move starts from same file as made move
                        isFileAmbiguous = true
                    }else if(rank === startRank){
                        // move starts from same rank as made move
                        isRankAmbiguous = true
                    }
                })
        })

        return [
            isRankAmbiguous ? startFile : null,
            isFileAmbiguous ? startRank : null,
        ]
    }
}