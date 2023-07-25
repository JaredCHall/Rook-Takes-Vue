import { describe, it, expect, vi } from 'vitest'

import PieceList from "@/classes/Chess/Board/PieceList";
import Piece from "@/classes/Chess/Piece";


describe('PieceList', () => {

    it('it constructs itself', () => {
        const pieceList = new PieceList()

        expect(pieceList).toHaveProperty('whitePieces',{
            king: [],
            queen: [],
            rook: [],
            knight: [],
            bishop: [],
            pawn: [],
        })

        expect(pieceList).toHaveProperty('blackPieces',{
            king: [],
            queen: [],
            rook: [],
            knight: [],
            bishop: [],
            pawn: [],
        })
    })

    it.each([
        ['king'],
        ['queen'],
        ['rook'],
        ['knight'],
        ['bishop'],
        ['pawn'],
    ])('it adds, gets & removes %s',(pieceType) => {

        const pieceList = new PieceList()
        const piece1  = new Piece(pieceType,'white','a2')
        const piece2 = new Piece(pieceType,'white','b2')
        const piece3 = new Piece(pieceType,'black','a7')
        const piece4 = new Piece(pieceType,'black','b7')
        pieceList.add(piece1)
        pieceList.add(piece2)
        pieceList.add(piece3)
        pieceList.add(piece4)

        expect(pieceList.getPieces('white',pieceType)).toBe(pieceList.whitePieces[pieceType])
        expect(pieceList.whitePieces[pieceType]).toHaveLength(2)
        expect(pieceList.whitePieces[pieceType][0]).toBe(piece1)
        expect(pieceList.whitePieces[pieceType][1]).toBe(piece2)

        expect(pieceList.getPieces('black',pieceType)).toBe(pieceList.blackPieces[pieceType])
        expect(pieceList.blackPieces[pieceType]).toHaveLength(2)
        expect(pieceList.blackPieces[pieceType][0]).toBe(piece3)
        expect(pieceList.blackPieces[pieceType][1]).toBe(piece4)

        pieceList.remove(piece1)
        expect(pieceList.whitePieces[pieceType]).toHaveLength(1)
        expect(pieceList.whitePieces[pieceType][0]).toBe(piece2)
        expect(pieceList.blackPieces[pieceType]).toHaveLength(2)

        pieceList.remove(piece3)
        pieceList.remove(piece4)

        expect(pieceList.blackPieces[pieceType]).toHaveLength(0)

    })


    it('it gets king',()=>{
        const pieceList = new PieceList()
        const king1  = new Piece('king','white','e1')
        const king2 = new Piece('king','black','e8')

        expect(pieceList.getKing('white')).toBeNull()
        expect(pieceList.getKing('black')).toBeNull()


        pieceList.add(king1)
        pieceList.add(king2)

        expect(pieceList.getKing('white')).toBe(king1)
        expect(pieceList.getKing('black')).toBe(king2)

    })

    it.each([
        'black',
        'white',
    ])('returns all pieces for color %s',(color) =>{
        const pieceList = new PieceList()
        expect(pieceList.getPieces(color)).toEqual([])

        const piece1 = new Piece('king', color,'a1')
        const piece2 = new Piece('king', color,'a1')
        const piece3 = new Piece('pawn', color,'a1')
        const piece4 = new Piece('pawn', color,'a1')
        const piece5 = new Piece('pawn', color,'a1')
        const piece6 = new Piece('pawn', color,'a1')
        const piece7 = new Piece('queen', color,'a1')
        const piece8 = new Piece('queen', color,'a1')
        const piece9 = new Piece('knight', color,'a1')
        const piece10 = new Piece('rook', color,'a1')

        pieceList.add(piece1)
        pieceList.add(piece2)
        pieceList.add(piece3)
        pieceList.add(piece4)
        pieceList.add(piece5)
        pieceList.add(piece6)
        pieceList.add(piece7)
        pieceList.add(piece8)
        pieceList.add(piece9)
        pieceList.add(piece10)

        const pieceSet = pieceList.getPieces(color)

        expect(pieceSet).toHaveLength(10)
        expect(pieceSet).toContain(piece1)
        expect(pieceSet).toContain(piece2)
        expect(pieceSet).toContain(piece3)
        expect(pieceSet).toContain(piece4)
        expect(pieceSet).toContain(piece5)
        expect(pieceSet).toContain(piece6)
        expect(pieceSet).toContain(piece7)
        expect(pieceSet).toContain(piece8)
        expect(pieceSet).toContain(piece9)
        expect(pieceSet).toContain(piece10)

    })
})