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


    createFromSanNotation(notation: SanNotation): ChessMove
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

    createMoveFromCoordinateNotation(notation: CoordinateNotation): ChessMove
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


    createMove(notation: SanNotation|CoordinateNotation)
    {
        if(notation instanceof SanNotation){
            return this.createFromSanNotation(notation)
        }

        return this.createMoveFromCoordinateNotation(notation)
    }

    getDisambiguation(move: ChessMove): string
    {
        if(move.movingPiece.color !== this.moveArbiter.fenNumber.sideToMove){
            throw new Error(`method must be called before move is made`)
        }

        const movingPiece = move.movingPiece
        const startSquare = move.oldSquare
        const targetSquare = move.newSquare
        const [startFile, startRank] = Square.getFileAndRank(startSquare)


        if(movingPiece.type === 'pawn'){
            if(move.capturedPiece){
                // pawn moves are always disambiguated when captures
                return startFile;
            }
            // never disambiguated otherwise
            return '';
        }

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
                if(possibleMove.newSquare === targetSquare){
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
            return startRank.toString()
        }

        return startSquare
    }

    // call after arbiter has made move for correct CheckMate token
    getSanNotation(move: ChessMove, disambiguation: string): SanNotation
    {
        if(move.movingPiece.color === this.moveArbiter.fenNumber.sideToMove){
            throw new Error(`method must be called after move is made`)
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
                this.#formatCheckMakeToken()
            )
        }

        const isCapture = !!move.capturedPiece
        const promotionType = move instanceof PawnPromotionMove ? move.promoteToType : null
        const startFile = disambiguation && disambiguation.length > 0 ? disambiguation.charAt(0) : null
        const startRank = disambiguation && disambiguation.length == 2 ? parseInt(disambiguation.charAt(1)) : null

        return new SanNotation(
            move.movingPiece,
            isCapture,
            move.newSquare,
            null,
            promotionType,
            startFile,
            startRank,
            this.#formatCheckMakeToken(),
        )
    }

    #formatCheckMakeToken(): '#'|'+'|null
    {
        if(this.moveArbiter.fenNumber.isMate){
            return '#'
        }
        if(this.moveArbiter.fenNumber.isCheck){
            return '+'
        }
        return null
    }

}