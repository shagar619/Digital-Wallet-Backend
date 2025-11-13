import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.types"


export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {

     return {
          statusCode: 400,
          message: `Invalid ${err.path}: ${err.value}`,
          errorSources: [
               {
                    path: err.path,
                    message: `Invalid ${err.path}: ${err.value}`
               }
          ]
     }
}