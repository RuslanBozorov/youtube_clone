export class InternalServerError extends Error{
    constructor(message,status){
        super()
        this.status = status
        this.message = message
        this.name = "InternalServerError"
    }
}

export class BadRequestError extends Error{
    constructor(message,status){
        super()
        this.status = status
        this.message = message
        this.name = "BadRequestError"
    }
}


export class UnauthorizedError extends Error {
    constructor(message, status) {
        super()
        this.status = status
        this.message = message
        this.name = "UnauthorizedError"
    }
}


export class ForbiddenError extends Error {
    constructor(message, status) {
        super()
        this.status = status
        this.message = message
        this.name = "ForbiddenError"
    }
}


export class NotFoundError extends Error {
    constructor(message, status) {
        super()
        this.status = status
        this.message = message
        this.name = "NotFoundError"
    }
}


export class ConflictError extends Error {
    constructor(message, status) {
        super()
        this.status = status
        this.message = message
        this.name = "ConflictError"
    }
}
