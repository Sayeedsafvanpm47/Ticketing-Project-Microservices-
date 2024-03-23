import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError{
          statusCode = 404 
          constructor()
          {
                    super('Route not found!')
                    Object.setPrototypeOf(this,NotFoundError.prototype)
          }
          serializeError(){
                    return [{
                              message:'Not found!'
                    }]
          }
}
//use this, where needed throw new NotFoundError(), then middleware will automatically capture and throw this error accordingly ! :) 