import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import {Piece} from "@/classes/Chess/Piece";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";
import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import type {ColorType} from "@/classes/Chess/Color";
import {Square} from "@/classes/Chess/Square/Square";
import {MoveDisambiguator} from "@/classes/Chess/MoveArbiter/MoveDisambiguator";

export class MoveNotary {

    moveArbiter: MoveArbiter

    constructor(moveArbiter: MoveArbiter) {
        this.moveArbiter = moveArbiter
    }

    createMove(notation: string)
    {
        const sanNotation = SanNotation.fromInput(notation, this.moveArbiter.fenNumber.sideToMove)
        const piece = sanNotation.movingPiece
        const moveArbiter = this.moveArbiter

        let possibleMoves: Array<ChessMove> = [];
        const candidateSquares = moveArbiter
            .squares64
            .getPieceSquares(piece.color, piece.type)
            .filter((square: Square) => {
                const moves = moveArbiter.getLegalMoves(square.name)
                moves.each((move: ChessMove) => {
                    if(move.newSquare === sanNotation.newSquare){
                        if(move instanceof PawnPromotionMove && sanNotation.promotionType) {
                            move.promoteToType = sanNotation.promotionType
                        }
                        possibleMoves.push(move)
                    }
                })
                // @ts-ignore
                return moves.has(sanNotation.newSquare)
            })

        if(possibleMoves.length === 0){
            throw new Error('Move is illegal.')
        }

        if(possibleMoves.length === 1){
            return possibleMoves[0]
        }

        possibleMoves = possibleMoves.filter((move: ChessMove) => {
            const [candidateStartFile, candidateStartRank] = Square.getFileAndRank(move.oldSquare)

            const matchesFile = sanNotation.startFile && (sanNotation.startFile === candidateStartFile)
            const matchesRank = sanNotation.startRank && (sanNotation.startRank === candidateStartRank)

            if(sanNotation.startFile && !sanNotation.startRank) {
                return matchesFile
            }else if(sanNotation.startRank && !sanNotation.startFile) {
                return matchesRank
            }else if(sanNotation.startFile && sanNotation.startRank){
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

    getDisambiguation(move: ChessMove): string
    {
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
        if(move instanceof CastlingMove){
            return new SanNotation(
                move.movingPiece.type,
                move.movingPiece.color,
                false,
                move.castlesType.notation,
                null,
                null,
                null,
                null,
                this.#formatCheckMakeToken()
            )
        }

        const type = move.movingPiece.type
        const color = move.movingPiece.color
        const isCapture = !!move.capturedPiece
        const promotionType = move instanceof PawnPromotionMove ? move.promoteToType : null

        const startFile = disambiguation && disambiguation.length > 0 ? disambiguation.charAt(0) : null
        const startRank = disambiguation && disambiguation.length == 2 ? parseInt(disambiguation.charAt(1)) : null

        return new SanNotation(
            type,
            color,
            isCapture,
            move.newSquare,
            null,
            promotionType,
            startFile,
            startRank,
            this.#formatCheckMakeToken(),
        )
    }

    #formatCheckMakeToken()
    {
        if(this.moveArbiter.fenNumber.isMate){
            return '#'
        }
        if(this.moveArbiter.fenNumber.isCheck){
            return '+'
        }
        return ''
    }

}