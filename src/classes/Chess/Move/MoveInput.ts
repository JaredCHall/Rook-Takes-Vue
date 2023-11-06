import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {ChessPieceType} from "@/classes/Chess/Piece";
import type {ColorType} from "@/classes/Chess/Color";
import {Piece} from "@/classes/Chess/Piece";
import type {SquareType} from "@/classes/Chess/Square/Square";
import {Square} from "@/classes/Chess/Square/Square";
import type {Squares64} from "@/classes/Chess/Position/Squares64";
import {MoveList} from "@/classes/Chess/Move/MoveList";
import {PawnPromotionMove} from "@/classes/Chess/Move/MoveType/PawnPromotionMove";

export class MoveInput {

    input: string

    inputType: 'notation'|'squareNames'

    invalidInputMessage = 'Invalid Move: Expected Standard Algebraic Notation or starting and ending square separated by a space.'

    constructor(userInput: string) {
        this.input = userInput.trim()

        this.inputType = 'notation'
        if(this.input.indexOf(' ') !== -1){
            this.inputType = 'squareNames'
        }
    }

    validate(): void {
        if(this.inputType === 'squareNames'){
            if(null === this.input.match(/^[a-h][1-8] [a-h][1-8]$/i)){
                throw new Error(this.invalidInputMessage)
            }
        }

        let input = this.input.replace(/[+#]/,'')

        if(null === this.input.match(/^O-O(-O)?|[KQBNR]?[a-h]?[1-8]?x?[a-h][1-8](=[QBNR])?$/)) {
            throw new Error(this.invalidInputMessage)
        }
    }

    createMove(moveArbiter: MoveArbiter): ChessMove
    {
        if(this.inputType === 'squareNames'){
            return this.#fromSquareNames(moveArbiter, this.input)
        }
        return this.#fromAlgebraicNotation(moveArbiter, this.input)
    }

    #fromSquareNames(moveArbiter: MoveArbiter, input: string): ChessMove
    {
        const [oldSquare, newSquare] = input.split(' ')

        //@ts-ignore
        const possibleMoves = moveArbiter.getLegalMoves(oldSquare)
        possibleMoves.filter((possibleMove: ChessMove) => possibleMove.newSquare === newSquare)
        if(possibleMoves.length > 0){
            return possibleMoves.first()
        }

        throw new Error(`Invalid Move. ${oldSquare} ${newSquare} is not possible.`)
    }



    #fromAlgebraicNotation(moveArbiter: MoveArbiter, input: string): ChessMove
    {
        const sideToMove = moveArbiter.fenNumber.sideToMove
        if(null !== input.match(/^O-O-O|O-O$/)){
            let castlesType = input === 'O-O-O' ? 'q' : 'k'
            if(sideToMove === 'white'){
                castlesType = castlesType.toUpperCase()
            }
            //@ts-ignore
            return CastlingMove.create(castlesType)
        }

        const parts = input.match(/([KQBNR])?([a-h])?([1-8])?x?([a-h][1-8])(=[QBNR])?/)
        if(parts === null){
            throw new Error('Unreadable move notation')
        }
        const pieceType = parts[1]
        const startFile = parts[2]
        const startRank = parts[3] ? parseInt(parts[2]) : null
        const newSquare = parts[4]
        const promotionType = parts[5] ? parts[5].replace(/=/,'') : null

        const piece = this.#getPieceFromNotationType(pieceType, sideToMove)

        if(!newSquare){
            throw new Error('Could not read target square from input.')
        }

        let possibleMoves: Array<ChessMove> = [];
        const candidateSquares = moveArbiter
            .squares64
            .getPieceSquares(piece.color, piece.type)
            .filter((square: Square) => {
                const moves = moveArbiter.getLegalMoves(square.name)
                moves.each((move: ChessMove) => {
                    if(move.newSquare === newSquare){
                        if(move instanceof PawnPromotionMove && promotionType) {
                            move.promoteToType = this.#getPieceFromNotationType(promotionType, sideToMove).type
                        }
                        possibleMoves.push(move)
                    }
                })
                // @ts-ignore
                return moves.has(newSquare)
            })

        if(possibleMoves.length === 0){
            throw new Error('Move is illegal.')
        }

        if(possibleMoves.length === 1){
            return possibleMoves[0]
        }

        possibleMoves = possibleMoves.filter((move: ChessMove) => {
            const [candidateStartFile, candidateStartRank] = Square.getFileAndRank(move.oldSquare)

            if(startFile && startRank) {
                return startFile === candidateStartFile && candidateStartRank === startRank
            }else if(startFile && !startRank) {
                return startFile === candidateStartFile
            }else if(!startFile && startRank) {
                return candidateStartRank === startRank
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

    #getPieceFromNotationType(pieceType: string, color: ColorType)
    {
        switch(pieceType){
            case 'K':
                return new Piece('king', color)
            case 'Q':
                return new Piece('queen', color)
            case 'R':
                return new Piece('rook', color)
            case 'N':
                return new Piece('knight', color)
            case 'B':
                return new Piece('bishop', color)
            default:
                return new Piece('pawn', color)
        }
    }
}