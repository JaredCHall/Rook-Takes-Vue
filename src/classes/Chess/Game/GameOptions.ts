
export class GameOptions {

    /**
     * Move Notation Type:
     *
     * SAN - Standard Algebraic Notation, as in Nxe4
     *       This is most common, and best for user interfaces
     * Coordinate - [startSquare][newSquare], as in f6e4
     *      This is common with APIs and other chess applications
     *      It is faster than SAN because moves do not need to be disambiguated
     */
    moveNotationType: 'SAN'|'Coordinate' = 'SAN'

    /**
     * Count Material:
     *
     * When enabled, the value of material will be calculated in each position
     * disable if not needed for more speed
     */
    countMaterial: boolean = true

    /**
     * Allowed Stalemate Types
     */
    drawBy3foldRepetition: boolean = true

    drawBy50moveRule: boolean = true

    /**
     * Timer Type
     *
     * Basic: Clock counts down with no delay or increment, 15+0 or 3+0 type games
     * Increment: Clock timers gain increment
     * Delay: Clock timers have delay
     *
     * If left null, no timer will be used
     */
    timerType: null|'Basic'|'Increment'|'Delay' = null

    /**
     * Timer Duration
     *
     * Total clock time for each side, in seconds.
     */
    timerDuration: null|number = null


    /**
     * Timer Increment
     *
     * Increment time in seconds. Specified number of seconds will be added
     * back to the player's time after each move
     */
    timerIncrement: null|number = null

    /**
     * Timer Delay
     *
     * Delay time in seconds. Player's clock will not count down
     * for specified number of seconds after their turn starts
     */
    timerDelay: null|number = null
}