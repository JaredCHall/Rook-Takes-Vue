export class Assert {

    static isDefined(value: any, argName: string = '?'): boolean
    {
        if(typeof value === 'undefined'){
            throw new Error(`${argName} must be defined.`)
        }

        return true
    }

    static isNumber(value: any, argName: string = '?'): boolean
    {
        if(typeof value !== 'number'){
            throw new Error(`${argName} must be a number.`)
        }

        return true
    }

    static isString(value: any, argName: string = '?'): boolean
    {
        if(typeof value !== 'string'){
            throw new Error(`${argName} must be a string.`)
        }

        return true
    }

    static isEnum(value: any, enumArray: Array<any>, argName: string = '?'): boolean
    {
        if(enumArray.indexOf(value) === -1){
            throw new Error(`${argName} must be in enum values: ${enumArray.join(', ')}.`)
        }

        return true
    }

    static notNull(value: any, argName: string = '?'): boolean
    {
        if(typeof value === 'undefined' || value === null){
            throw new Error(`${argName} must not be null|undefined.`)
        }

        return true
    }

}