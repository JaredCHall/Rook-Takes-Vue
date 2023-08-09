
export class GameOptions {

    draw_by_3fold_repetition: boolean = true

    draw_by_50move_rule: boolean = true

    count_material: boolean = true

    timer_type: null|'Basic'|'Increment'|'Delay' = null

    timer_duration: null|number = null

    timer_increment: null|number = null

    timer_delay: null|number = null

}