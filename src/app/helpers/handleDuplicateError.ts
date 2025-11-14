import { TGenericErrorResponse } from "../interfaces/error.types";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {

     const matchedArray = err.message.match(/"([^"]*)"/);

     return {
          statusCode: 409,
          message: matchedArray ? `Duplicate value for field: ${matchedArray[1]}` : "Duplicate field value",
          errorSources: matchedArray
               ? [
                    {
                         path: matchedArray[1],
                         message: `Duplicate value for field: ${matchedArray[1]}`
                    }
               ]
               : []
     }
}