import type {ChessPieceType} from "@/classes/Chess/Piece";
import Piece from "@/classes/Chess/Piece";
import Squares144 from "@/classes/Chess/Board/Squares144";
import type {SquareType} from "@/classes/Chess/Square/Square";
import type FenNumber from "@/classes/Chess/Board/FenNumber";
import Square from "@/classes/Chess/Square/Square";
import MoveList from "@/classes/Chess/Moves/MoveList";
import ChessMove from "@/classes/Chess/Moves/ChessMove";
import EnPassantMove from "@/classes/Chess/Moves/EnPassantMove";
import DoublePawnMove from "@/classes/Chess/Moves/DoublePawnMove";
import PawnPromotionMove from "@/classes/Chess/Moves/PawnPromotionMove";
import CastlingMove from "@/classes/Chess/Moves/CastlingMove";
import CastlesType from "@/classes/Chess/Moves/CastlesType";

export default class MoveEngine {

    squares144: Squares144

    constructor(squares144: Squares144) {
        this.squares144 = squares144
    }

    traceRayVectors(square: Square, piece: Piece, vectors: number[][], maxRayLength: number=7): MoveList {

        const moves = new MoveList()
        for(let i = 0; i<vectors.length;i++) {
            const vector = vectors[i]

            // the maximum possible moves along a ray from any position is 7, except for the king who can only move 1
            for(let j=1;j<=maxRayLength;j++){
                const newIndex = square.index144 + j * (vector[0] + vector[1] * 12)

                if(Squares144.isIndexOutOfBounds(newIndex)){
                    break
                }


                // if occupied by a friendly piece, the ray is terminated
                const newSquare = this.squares144.getSquareByIndex(newIndex)
                if((newSquare.piece && newSquare.piece.color == piece.color)){
                    break
                }

                let capturedPiece = null
                if(newSquare.piece != null){
                    capturedPiece = newSquare.piece
                }

                moves.add(new ChessMove(square.name, newSquare.name, piece, capturedPiece))

                // if there's an enemy piece, the ray is terminated
                if(newSquare.piece){
                    break
                }
            }
        }

        return moves
    }

    getKnightMoves(square: Square): MoveList
    {
        const piece = this.#getMovingPiece(square, 'knight')

        const moves = new MoveList()
        const moveOffsets = [
            -23, // NNE
            -10, // ENE
            14,  // ESE
            25,  // SSE
            23,  // SSW
            10,  // WSW
            -14, // WNW
            -25  // NNW
        ]
        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = square.index144 + offset

            if(Squares144.isIndexOutOfBounds(newIndex)){
                continue
            }

            const newSquare: Square = this.squares144.getSquareByIndex(newIndex)
            let capturedPiece = null
            if(newSquare.piece != null){
                capturedPiece = newSquare.piece
            }

            // test if square is not out-of-bounds and is either empty or occupied by an enemy piece
            if(!newSquare.piece || newSquare.piece.color != piece.color ){
                moves.add(new ChessMove(square.name, newSquare.name, piece, capturedPiece))
            }
        }

        return moves
    }

    #getMovingPiece(square: Square, type: ChessPieceType): Piece
    {
        const piece = square.piece
        if(!piece || piece.type !== type){
            throw new Error('Expected '+type+' is not on square '+square.name)
        }
        return piece
    }

    getRookMoves(square: Square): MoveList
    {
        const piece= this.#getMovingPiece(square, 'rook')

        const rayVectors = [
            [0,-1], // N
            [1,0],  // E
            [0,1],  // S
            [-1,0], // W
        ]

        return this.traceRayVectors(square, piece, rayVectors)
    }

    getBishopMoves(square: Square): MoveList
    {
        const piece= this.#getMovingPiece(square, 'bishop')
        const rayVectors = [
            [1,-1],  // NE
            [1,1],   // SE
            [-1,1],  // SW
            [-1,-1], // NW
        ]

        return this.traceRayVectors(square, piece, rayVectors)
    }

    getQueenMoves(square: Square): MoveList
    {
        const piece= this.#getMovingPiece(square, 'queen')
        const rayVectors = [
            [0,-1],  // N
            [1,-1],  // NE
            [1,0],   // E
            [1,1],   // SE
            [0,1],   // S
            [-1,1],  // SW
            [-1,0],  // W
            [-1,-1], // NW
        ]

        return this.traceRayVectors(square, piece, rayVectors)
    }

    getPawnMoves(square: Square, enPassantTarget: null|string): MoveList
    {

        const piece = this.#getMovingPiece(square,'pawn')

        const moves = new MoveList()
        const isPieceWhite = piece.color == 'white'

        const moveOffsets = isPieceWhite ? [-12] : [12] // N or S
        const captureOffsets = isPieceWhite ? [-11, -13] : [11,13] // NE,NW or SW,SE

        // determine if pawn is on starting square
        const startingRank = square.rank
        const isOnStartingRank = (isPieceWhite && startingRank == 2) || (!isPieceWhite && startingRank == 7)
        if(isOnStartingRank){
            // pawns on the starting square can potentially move forward 2 squares
            moveOffsets.push(isPieceWhite ? -24 : 24) // N or S
        }

        // test if pawn can move forward
        for(const i in moveOffsets){
            const offset = moveOffsets[i]
            const newIndex = square.index144 + offset

            if(Squares144.isIndexOutOfBounds(newIndex)){
                break
            }

            const newSquare: Square = this.squares144.getSquareByIndex(newIndex)
            if(newSquare.piece){
                break
            }

            if(Math.abs(offset) === 24){
                moves.add(new DoublePawnMove(square.name, newSquare.name, piece));
            }else{
                moves.add(new ChessMove(square.name, newSquare.name, piece))
            }
        }


        // test if pawn can capture diagonally
        for(const i in captureOffsets){
            const offset = captureOffsets[i]
            const newIndex = square.index144 + offset

            if(Squares144.isIndexOutOfBounds(newIndex)){
                continue
            }

            const newSquare = this.squares144.getSquareByIndex(newIndex)
            const move = new ChessMove(square.name, newSquare.name, piece, newSquare.piece);

            // test if square has an enemy piece
            if(newSquare.piece && newSquare.piece.color != piece.color){
                moves.add(move)

            }else if(newSquare.name === enPassantTarget){

                // Handle En Passant
                const capturedSquare = EnPassantMove.getOpponentPawnSquare(move)
                const capturedPawn = this.squares144.getSquare(capturedSquare).piece
                if(capturedPawn !== null){
                    moves.add(new EnPassantMove(square.name, newSquare.name, piece, capturedPawn, capturedSquare))
                }
            }
        }



        // check for promoted pawns
        moves.map((move: ChessMove) => {
            if(PawnPromotionMove.squareIsOnFinalRank(move.newSquare, move.movingPiece)){
                return new PawnPromotionMove(move)
            }
            return move
        })

        return moves
    }

    getKingMoves(square: Square, castleRights: null|string): MoveList
    {
        const piece = this.#getMovingPiece(square, 'king')
        const rayVectors = [
            [0,-1],  // N
            [1,-1],  // NE
            [1,0],   // E
            [1,1],   // SE
            [0,1],   // S
            [-1,1],  // SW
            [-1,0],  // W
            [-1,-1], // NW
        ]
        let moves = this.traceRayVectors(square, piece, rayVectors, 1)
        if(castleRights === null){
            return moves // no castle rights, this is a full list of moves
        }

        // make sure king is on the required square
        if(
            (piece.color === 'white' && square.name !== 'e1')
            || (piece.color === 'black' && square.name !== 'e8')
        ){return moves}

        // evaluate possible castling moves
        const possibleTypes = CastlesType.forColor(piece.color, castleRights)
        for(const i in possibleTypes) {
            const castlesInfo = possibleTypes[i]

            const rookSquare = this.squares144.getSquare(castlesInfo.rooksOldSquare)
            const expectedEmptySquares = castlesInfo.squaresThatMustBeEmpty

            // determine if any of the empty squares are occupied
            const isAnyOccupied = expectedEmptySquares.reduce((isAnyOccupied, squareName) =>
                    isAnyOccupied || this.squares144.getSquare(squareName).piece !== null
                , false)

            if (
                rookSquare.piece && rookSquare.piece.type == 'rook' // rook must be in its proper place
                && !isAnyOccupied
            ) {
                moves.add(new CastlingMove(
                    square.name,
                    castlesInfo.kingsNewSquare,
                    piece,
                    rookSquare.piece,
                    castlesInfo
                ))
            }
        }

        return moves
    }

    getPseudoLegalMoves(squareName: SquareType, fenNumber: FenNumber|null = null): MoveList {

        fenNumber ??= this.squares144.fenNumber
        const square = this.squares144.getSquare(squareName)


        if(!square.piece){
            throw new Error("No piece on square "+square.name)
        }

        //@ts-ignore
        switch(square.piece.type){
            case 'pawn': return this.getPawnMoves(square, fenNumber.enPassantTarget)
            case 'rook': return this.getRookMoves(square)
            case 'knight': return this.getKnightMoves(square)
            case 'bishop': return this.getBishopMoves(square)
            case 'queen': return this.getQueenMoves(square)
            case 'king': return this.getKingMoves(square, fenNumber.castleRights)
        }
    }




}