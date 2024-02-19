import { ValidationErrorItem } from "sequelize";
import { ErrorMessage, HttpsStatusCode } from "./utils.interfaces";
import { TokenService } from "../modules/token/token.service";
import { sequelize } from "../config/sequelize.config";


/**
 * Retrieves error messages from a list of validation errors.
 * @param {ValidationErrorItem[]} [errors] - The list of validation errors.
 * @returns {ErrorMessage[]} - An array of error messages.
 */
export const getErrorMessages = (
  errors?: ValidationErrorItem[]
): ErrorMessage[] => {
  if (!errors) {
    sequelize.sync();
    return;
  }
  const errorMessages: ErrorMessage[] = [];

  errors.forEach((error) => {
    let errorMessage = "";
    let fieldName = "";

    switch (error.type) {
      case "notnull violation":
        fieldName = error.path || "";
        errorMessage = `${fieldName} is required`;
        break;
      case "unique violation":
        fieldName = error.path || "";
        errorMessage = `${fieldName} must be unique`;
        break;
      default:
        errorMessage = error.message || "Validation error";
        break;
    }

    errorMessages.push({ message: errorMessage, field: fieldName });
  });

  return errorMessages;
};

/**
 * Validates the authenticity of an authentication token.
 * @param {string} token - The authentication token to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the token is valid or not.
 */
export const validateAuthToken = (token: string) => {
  const tokenService = new TokenService();
  return tokenService.verifyToken(token);
};

export const formErrorMessage =(err:any)=>{
  const message =  getErrorMessages(err?.['errors'])
  return {
    status: HttpsStatusCode.SOMETHING_WENT_WRONG,
    error: message || err['message'] || "Something Went Wrong, Please Try Again Later.",
  }
}
