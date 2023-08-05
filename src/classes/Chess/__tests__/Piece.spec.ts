import { describe, it, expect } from 'vitest'
import {Piece} from "@/classes/Chess/Piece";

describe('Piece', () => {
  it('it constructs itself', () => {

    const piece = new Piece('king','white')

    expect(piece).toBeInstanceOf(Piece)
    expect(piece.color).toEqual('white')
    expect(piece.type).toEqual('king')

  })

})
