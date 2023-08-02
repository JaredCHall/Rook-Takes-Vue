import type ChessMove from "@/classes/Chess/Move/MoveType/ChessMove";
import type {ColorType} from "@/classes/Chess/Color";
import {Color} from "@/classes/Chess/Color";
import MoveEngine from "@/classes/Chess/MoveFactory/MoveEngine";
import type {SquareType} from "@/classes/Chess/Square/Square";
import MoveList from "@/classes/Chess/Move/MoveList";
import CastlingMove from "@/classes/Chess/Move/MoveType/CastlingMove";
import FenNumber from "@/classes/Chess/Board/FenNumber";
import MadeMove from "@/classes/Chess/Move/MadeMove";

export default class MoveArbiter {

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
        return MadeMove.make(this.squares144, move)
    }

    unMakeMove(move: ChessMove): void
    {
        this.squares144.unMakeMove(move)
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

    #isCastlingMoveLegal(move: CastlingMove): boolean {
        for(const i in move.castlesType.squaresThatMustBeSafe){
            const square = move.castlesType.squaresThatMustBeSafe[i]
            if(this.moveEngine.isSquareThreatenedBy(square, Color.getOpposite(move.movingPiece.color))){
                return false
            }
        }
        return true
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

}