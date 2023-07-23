import { describe, it, expect } from 'vitest'
import Piece from "../Piece";

describe('Piece', () => {
  it('it constructs itself', () => {

    const piece = new Piece('king','white' , 'e1')

    expect(piece).toBeInstanceOf(Piece)
    expect(piece.color).toEqual('white')
    expect(piece.type).toEqual('king')
    expect(piece.startingSquare).toEqual('e1')
    expect(piece.currentSquare).toEqual('e1')

  })
  it('it constructs itself with current square', () => {

    const piece = new Piece('knight','black' , 'b8','c6')

    expect(piece).toBeInstanceOf(Piece)
    expect(piece.color).toEqual('black')
    expect(piece.type).toEqual('knight')
    expect(piece.startingSquare).toEqual('b8')
    expect(piece.currentSquare).toEqual('c6')

  })



})
