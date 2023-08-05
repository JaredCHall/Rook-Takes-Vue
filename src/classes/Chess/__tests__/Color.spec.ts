import { describe, it, expect } from 'vitest'
import {Color} from "@/classes/Chess/Color";

describe('Color', () => {
  it('it sets correct static properties', () => {
    expect(Color.WHITE).toEqual('white')
    expect(Color.BLACK).toEqual('black')
  })
})
