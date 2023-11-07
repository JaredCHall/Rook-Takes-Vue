import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import {Color} from "@/classes/Chess/Color";
import {MoveList} from "@/classes/Chess/Move/MoveList";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import {CastlingMove} from "@/classes/Chess/Move/MoveType/CastlingMove";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ColorType} from "@/classes/Chess/Color";
import {MoveNotary} from "@/classes/Chess/MoveNotary/MoveNotary";
import {Squares144} from "@/classes/Chess/Position/Squares144";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";

export class MoveArbiter {

    moveEngine: MoveEngine

    moveNotary: MoveNotary

    constructor(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine
        this.moveNotary = new MoveNotary(this)
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

    static fromFen(fen: ExtendedFen|string): MoveArbiter
    {
        return new MoveArbiter(new MoveEngine(new Squares144(fen)))
    }

    createMove(notation: SanNotation|CoordinateNotation): ChessMove
    {
        return this.moveNotary.createMove(notation)
    }


    makeMove(move: ChessMove): [moveNotation: string, fenAfter: ExtendedFen]
    {

        const disambiguation = this.moveNotary.getDisambiguation(move)

        this.squares144.makeMove(move)
        this.fenNumber.incrementTurn(move, this.squares64)

        const movingColor = move.movingPiece.color
        const enemyColor = Color.getOpposite(movingColor)
        const kingSquare = this.getKingSquare(enemyColor)
        const isCheck = !kingSquare ? false : this.moveEngine.isSquareThreatenedBy(kingSquare, movingColor)
        this.fenNumber.updateMoveResult(isCheck, !this.doesPlayerHaveLegalMoves(enemyColor))

        const fenAfter = this.fenNumber.clone()
        const sanNotation  = this.moveNotary.getSanNotation(move, disambiguation)

        return [sanNotation.serialize(), fenAfter]
    }

    unMakeMove(move: ChessMove, fenBefore: ExtendedFen): void
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
            const kingSquare = this.getKingSquare(movingColor)
            // when there is a king - a move is not legal if it puts the moving color's king in check
            // if there is no king (some hypothetical puzzle), this is check is skipped
            isMoveLegal = !kingSquare ? true : !this.moveEngine.isSquareThreatenedBy(kingSquare, enemyColor)

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

    getKingSquare(color: ColorType|null): SquareType|null
    {
        color ??= this.fenNumber.sideToMove

        //@ts-ignore
        return this.squares64.getKingSquare(color)?.name
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