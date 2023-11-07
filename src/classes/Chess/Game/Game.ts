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
import {SanNotation} from "@/classes/Chess/MoveNotary/SanNotation";
import {CoordinateNotation} from "@/classes/Chess/MoveNotary/CoordinateNotation";

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


        if(this.gameOptions.count_material){
            this.material = MaterialScores.make(this.squares64)
        }
        if(this.gameOptions.timer_type) {
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

    makeMove(move: ChessMove|string): void {

        if(typeof move === 'string'){
            const useSAN = this.gameOptions.input_type === 'SAN'
            const notation = useSAN ?
                SanNotation.fromInput(move, this.moveArbiter.fenNumber.sideToMove)
                : CoordinateNotation.fromInput(move)

            move = this.moveArbiter.createMove(notation)
        }

        if(this.gameResult){
            throw new Error('Cannot make move. Game is over.')
        }

        // make the move
        const [moveNotation, fenAfter] = this.moveArbiter.makeMove(move)
        // update material scores and game position
        this.material?.onMove(move)
        this.gamePosition = new GamePosition(fenAfter, this.material, this.gameClock)
        // update move history
        const madeMove = new MadeMove(move, moveNotation, this.gamePosition)
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