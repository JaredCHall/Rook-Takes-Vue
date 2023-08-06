import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {ExtendedFEN} from "@/classes/Chess/Board/ExtendedFEN";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {Color} from "@/classes/Chess/Color";
import {MoveList} from "@/classes/Chess/Move/MoveList";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ColorType} from "@/classes/Chess/Color";

export class MoveArbiter {

    moveEngine: MoveEngine

    constructor(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine
    }

    get squares144() {
        return this.moveEngine.squares144
    }

    get squares64() {
        return this.moveEngine.squares144.squares64
    }

    get fenNumber() {
        return this.squares144.fenNumber
    }

    makeMove(move: ChessMove): MadeMove
    {
        this.squares144.makeMove(move)
        this.fenNumber.incrementTurn(move, this.squares64)

        const movingColor = move.movingPiece.color
        const enemyColor = Color.getOpposite(movingColor)
        const isCheck = this.moveEngine.isSquareThreatenedBy(this.getKingSquare(enemyColor), movingColor)
        this.fenNumber.updateMoveResult(isCheck, !this.doesPlayerHaveLegalMoves(enemyColor))

        return new MadeMove(move, this.fenNumber.clone())
    }

    unMakeMove(move: ChessMove, fenBefore: ExtendedFEN): void
    {
        this.squares144.unMakeMove(move)
        this.squares144.fenNumber = fenBefore.clone()
    }

    isMoveLegal(move: ChessMove): boolean {

        if(move.capturedPiece?.type === 'king'){
            // kings cannot be captured
            return false
        }

        const movingColor = move.movingPiece.color
        const enemyColor = Color.getOpposite(movingColor)
        this.squares144.makeMove(move)

        let isMoveLegal
        if(move instanceof CastlingMove){
            isMoveLegal = this.#isCastlingMoveLegal(move)
        }else{
            isMoveLegal = !this.moveEngine.isSquareThreatenedBy(this.getKingSquare(movingColor), enemyColor)
        }

        this.squares144.unMakeMove(move)

        return isMoveLegal
    }

    getLegalMoves(squareName: SquareType): MoveList
    {
        const moves = this.moveEngine.getPseudoLegalMoves(squareName, this.fenNumber.enPassantTarget, this.fenNumber.castleRights)
        const legalMoves = new MoveList()
        moves.each((move: ChessMove) => {
            if(this.isMoveLegal(move)){
                legalMoves.add(move)
            }
        })
        return legalMoves
    }

    getKingSquare(color: ColorType|null): SquareType
    {
        color ??= this.fenNumber.sideToMove

        //@ts-ignore
        return this.squares64.getKingSquare(color).name
    }

    doesPlayerHaveLegalMoves(color: ColorType): boolean
    {
        const squares = this.squares64.getPieceSquares(color)
        for(const i in squares){
            const square = squares[i]
            if(this.getLegalMoves(square.name).length > 0){
                return true
            }
        }
        return false
    }

    doesMoveDrawBy3FoldRepetition(moveHistory: MoveHistory, move: MadeMove): boolean {
        return moveHistory.getPositionRepetitions(move) >= 3
    }

    doesMoveDrawBy50MoveRule(move: MadeMove): boolean {
        return move.fenAfter.halfMoveClock >= 50
    }

    #isCastlingMoveLegal(move: CastlingMove): boolean {
        for(const i in move.castlesType.squaresThatMustBeSafe){
            const square = move.castlesType.squaresThatMustBeSafe[i]
            if(this.moveEngine.isSquareThreatenedBy(square, Color.getOpposite(move.movingPiece.color))){
                return false
            }
        }
        return true
    }

}