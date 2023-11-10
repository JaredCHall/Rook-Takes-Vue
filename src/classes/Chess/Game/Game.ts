import {Square} from "@/classes/Chess/Square/Square";
import type {SquareType} from "@/classes/Chess/Square/Square";
import {Squares144} from "@/classes/Chess/Position/Squares144";
import {ExtendedFen} from "@/classes/Chess/Position/ExtendedFEN";
import {Squares64} from "@/classes/Chess/Position/Squares64";
import {MoveArbiter} from "@/classes/Chess/MoveArbiter/MoveArbiter";
import {MoveEngine} from "@/classes/Chess/MoveArbiter/MoveEngine";
import {MoveHistory} from "@/classes/Chess/Move/MoveHistory";
import type {MoveList} from "@/classes/Chess/Move/MoveList";
import {ChessMove} from "@/classes/Chess/Move/MoveType/ChessMove";
import {GameResult} from "@/classes/Chess/Game/GameResult";
import {MadeMove} from "@/classes/Chess/Move/MadeMove";
import type {ColorType} from "@/classes/Chess/Color";
import {Color} from "@/classes/Chess/Color";
import {Player} from "@/classes/Chess/Player";
import {MaterialScores} from "@/classes/Chess/Position/MaterialScores";
import {GamePosition} from "@/classes/Chess/Position/GamePosition";
import {GameOptions} from "@/classes/Chess/Game/GameOptions";
import {GameClock} from "@/classes/Chess/GameClock/GameClock";
import {MoveNotation} from "@/classes/Chess/MoveNotary/MoveNotation";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";

export class Game
{

    static makeNewGame(): Game
    {
        return new Game('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }

    static makeEmptyBoard(): Game
    {
        return new Game('8/8/8/8/8/8/8/8 w - -')
    }

    squares64: Squares64

    moveArbiter: MoveArbiter

    moveHistory: MoveHistory

    moveIndex: number = 0 // index of the currently displayed move

    gameOptions: GameOptions

    gamePosition: GamePosition

    gameResult: null|GameResult = null

    gameClock: null|GameClock = null

    playerWhite: Player

    playerBlack: Player

    material: null|MaterialScores = null

    materialWhite: number = 0

    materialBlack: number = 0

    eventName: string = 'Casual Game'

    siteName: string = 'Sol System'

    startDate: Date

    eventRound: number = 1

    constructor(fen: string, gameOptions: GameOptions|null = null) {

        this.gameOptions = gameOptions ?? new GameOptions()

        const extendedFen = new ExtendedFen(fen)
        this.squares64 = new Squares64(extendedFen)


        if(this.gameOptions.countMaterial){
            this.material = MaterialScores.make(this.squares64)
        }
        if(this.gameOptions.timerType) {
            this.gameClock = GameClock.make(this.gameOptions)
        }
        this.gamePosition = new GamePosition(extendedFen, this.material, this.gameClock)
        this.moveArbiter = new MoveArbiter(new MoveEngine(new Squares144(extendedFen)))
        this.moveHistory = new MoveHistory(this.gamePosition)
        this.playerWhite = Player.defaultWhite()
        this.playerBlack = Player.defaultBlack()
        this.startDate = new Date

    }

    get fenNumber(): ExtendedFen
    {
        return this.gamePosition.extendedFEN
    }


    get moveEngine(): MoveEngine {
        return this.moveArbiter.moveEngine
    }

    setEventDate(date: Date): void
    {
        this.startDate = date
    }

    setEventName(name: string) {
        this.eventName = name
    }

    setEventRound(round: number){
        this.eventRound = round
    }

    setSiteName(name: string) {
        this.siteName = name
    }

    setInputType(type: 'SAN'|'Coordinate'): void {
        this.gameOptions.moveNotationType = type
    }

    setPlayer(player: Player){
        if(player.color === 'white'){
            this.playerWhite = player
            return
        }
        this.playerBlack = player
    }

    getSquare(squareType: SquareType): Square
    {
        return this.squares64.get(squareType)
    }

    getMoves(squareType: SquareType): MoveList
    {
        return this.moveArbiter.getLegalMoves(squareType)
    }

    displayMadeMove(moveIndex: number){
        if(moveIndex === 0){
            this.gamePosition = this.moveHistory.startPosition
        }else{
            this.gamePosition = this.moveHistory.get(moveIndex).positionAfter
        }
        this.fenNumber.updateSquares64(this.squares64)
        this.moveIndex = moveIndex
    }

    seekMadeMove(moveIndex: number): void
    {
        this.gamePosition = this.moveHistory.getPositionBefore(moveIndex)
        this.fenNumber.updateSquares64(this.squares64)
        this.moveIndex = moveIndex - 1
    }

    makeMove(move: ChessMove|string): void {

        if(this.gameResult){
            throw new Error('Cannot make move. Game is over.')
        }

        // deal with overloaded argument
        // we need notation and move objects
        let notation: SanNotation|CoordinateNotation
        const notationType = this.gameOptions.moveNotationType
        if(typeof move === 'string'){
            notation = this.moveArbiter.moveFactory.makeNotation(move, notationType)
            move = this.moveArbiter.moveFactory.make(notation)
        }else{
            notation = this.moveArbiter.moveNotary.getNotation(move, this.gameOptions.moveNotationType)
        }

        // make the move
        const fenAfter = this.moveArbiter.makeMove(move, notation)
        // update material scores and game position
        this.material?.onMove(move)
        this.gamePosition = new GamePosition(fenAfter, this.material, this.gameClock)
        // update move history
        const madeMove = new MadeMove(move, this.gamePosition)
        if(notationType !== 'SAN'){
            madeMove.setCoordinateNotation(notation.serialize())
        }else{
            madeMove.setSanNotation(notation.serialize())
        }

        this.squares64.makeMove(madeMove.move)
        this.moveHistory.add(madeMove)
        this.moveIndex = madeMove.halfStepIndex

        this.#determineGameResult(madeMove)

    }

    undoLastMove(): void {
        const positionBefore = this.moveHistory.getPositionBefore(this.moveIndex)
        const lastMove = this.moveHistory.pop()
        this.moveArbiter.unMakeMove(lastMove.move, positionBefore.extendedFEN)
        this.material?.onUnMove(lastMove.move)
        this.gamePosition = new GamePosition(positionBefore.extendedFEN, this.material, this.gameClock)
        this.moveIndex--

    }

    setResigns(color: ColorType)
    {
        return this.gameResult = new GameResult('Resign', Color.getOpposite(color))
    }

    setDraw()
    {
        return this.gameResult = new GameResult('Draw', null, 'Agreed')
    }

    setOutOfTime(color: ColorType)
    {
        return this.gameResult = new GameResult('OutOfTime', Color.getOpposite(color))
    }

    #determineGameResult(move: MadeMove)
    {
        if(move.fenAfter.isMate){
            return this.gameResult = new GameResult('Mate', move.movingColor)
        }
        if(move.fenAfter.isStalemate){
            return this.gameResult = new GameResult('Draw', null, 'Stalemate')
        }

        if(this.moveArbiter.doesMoveDrawBy3FoldRepetition(this.moveHistory, move)){
            return this.gameResult = new GameResult('Draw',null, '3Fold');
        }
        if(this.moveArbiter.doesMoveDrawBy50MoveRule(move)){
            return this.gameResult = new GameResult('Draw',null, '50Move');
        }

        return null
    }

}