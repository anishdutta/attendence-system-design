export type ApiHelper<K> = {
    error?: string,
    response?: K,
    status: HttpsStatusCode
}

export enum HttpsStatusCode {
    SUCCESS = 200,
    CREATED = 201,
    VALIDATION_FAILED = 404,
    SOMETHING_WENT_WRONG = 400,
    INTERNAL_SERVER_ERROR = 500
}

export interface ErrorMessage {
    message: string;
    field: string;
  }