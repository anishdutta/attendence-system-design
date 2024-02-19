import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpsStatusCode } from '../../utils/utils.interfaces';

const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: 'key' } })
      .validate(req.body);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      _res.send({
        error: errorMessage,
        status: HttpsStatusCode.VALIDATION_FAILED
      })
      return;
    }
    Object.assign(req, value);
    return next();
  };

export default validate;