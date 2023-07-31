import { describe, it, expect, vi } from 'vitest'
import CastlesType from "@/classes/Chess/Moves/CastlesType";


describe('CastlesType', () => {
    it('it constructs itself', () => {

        const castlesType = new CastlesType(
            'h8',
            'f8',
            'e8',
            'g8',
            ['f8','g8'],
            ['e8','f8','g8'],
            'k',
            'O-O');

        expect(castlesType).toHaveProperty('rooksOldSquare','h8')
        expect(castlesType).toHaveProperty('rooksNewSquare','f8')
        expect(castlesType).toHaveProperty('kingsOldSquare','e8')
        expect(castlesType).toHaveProperty('kingsNewSquare','g8')
        expect(castlesType).toHaveProperty('squaresThatMustBeEmpty',['f8','g8'])
        expect(castlesType).toHaveProperty('squaresThatMustBeSafe',['e8','f8','g8'])
        expect(castlesType).toHaveProperty('type','k')
        expect(castlesType).toHaveProperty('notation','O-O')
    })

    it('it creates correct castles types', () => {
        const castle_Q = new CastlesType(
            'a1',
            'd1',
            'e1',
            'c1',
            ['d1','c1','b1'],
            ['e1','d1','c1'],
            'Q',
            'O-O-O'
        )
        const castle_K = new CastlesType(
            'h1',
            'f1',
            'e1',
            'g1',
            ['f1','g1'],
            ['e1','f1','g1'],
            'K',
            'O-O',
        )
        const castle_q = new CastlesType(
            'a8',
            'd8',
            'e8',
            'c8',
            ['d8','c8','b8'],
            ['e8','d8','c8'],
            'q',
            'O-O-O'
        )
        const castle_k = new CastlesType(
            'h8',
            'f8',
            'e8',
            'g8',
            ['f8','g8'],
            ['e8','f8','g8'],
            'k',
            'O-O'
        )

        expect(CastlesType.create('K')).toEqual(castle_K)
        expect(CastlesType.create('Q')).toEqual(castle_Q)
        expect(CastlesType.create('k')).toEqual(castle_k)
        expect(CastlesType.create('q')).toEqual(castle_q)

    })

    it('gets correct types for color', () => {

        // empty sets
        expect(CastlesType.forColor('white')).toHaveLength(0)
        expect(CastlesType.forColor('black')).toHaveLength(0)
        expect(CastlesType.forColor('black','KQ')).toHaveLength(0)
        expect(CastlesType.forColor('white','kq')).toHaveLength(0)

        let castles

        castles = CastlesType.forColor('black','kq')
        expect(castles).toHaveLength(2)
        expect(castles[0].rooksOldSquare).toEqual('h8')
        expect(castles[1].rooksOldSquare).toEqual('a8')

        castles = CastlesType.forColor('white','KQ')
        expect(castles).toHaveLength(2)
        expect(castles[0].rooksOldSquare).toEqual('h1')
        expect(castles[1].rooksOldSquare).toEqual('a1')
    })
})
