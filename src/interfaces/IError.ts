export interface validationError {
    type: string,
    value: undefined | string,
    msg: string,
    path: string,
    location: string
}