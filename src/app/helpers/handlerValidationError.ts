import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";


export const handlerValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {

     const errorSources: TErrorSources[] = [];

     const errors = Object.values(err.errors);

     errors.forEach((el: any) => errorSources.push({
          path: el.path,
          message: el.message
     }));

     return {
          statusCode: 400,
          message: "Validation error",
          errorSources
     }
}