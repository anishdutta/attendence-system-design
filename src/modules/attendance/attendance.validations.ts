import Joi from "joi";
import { ICheckInOrOutRequest, ICheckInOutType } from "./attendance.interface";

export const checkInAndOutInstructor: Record<keyof ICheckInOrOutRequest | 'token', any> = {
    token: Joi.string().required(),
    instructorId: Joi.string().required(),
    type: Joi.string().required().valid(...Object.values(ICheckInOutType))
};

export const getMonthlyAnalytics: Record<'token', any> = {
    token: Joi.string().required()
};