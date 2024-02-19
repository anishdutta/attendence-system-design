import { HttpsStatusCode } from "../../utils/utils.interfaces";
import { Request, Response } from "express";
import { formErrorMessage, validateAuthToken } from "../../utils/utils";
import { AttendenceService } from "./attendance.service";


export const checkInAndOut = async (req: Request, res: Response) => {
    try {
      const request = req.body;
      validateAuthToken(request.token);
      const attendenceService = new AttendenceService();
      const message = await attendenceService.checkInAndOutInstructor(request);
      res.status(HttpsStatusCode.SUCCESS).send({ status: HttpsStatusCode.CREATED, success: message });
    } catch (err) {
      console.error("Error in checkInAndOut", err);
      res.status(HttpsStatusCode.SOMETHING_WENT_WRONG).send(formErrorMessage(err));
    }
  };

export const getMonthlyAnalytics = async (req: Request, res: Response) => {
    try {
      const request = req.body;
      validateAuthToken(request.token);
      const attendenceService = new AttendenceService();
      const message = await attendenceService.getMonthlyAnalytics();
      res.status(HttpsStatusCode.SUCCESS).send({ response:message });
    } catch (err) {
      console.error("Error in getMonthlyAnalytics", err);
      res.status(HttpsStatusCode.SOMETHING_WENT_WRONG).send(formErrorMessage(err));
    }
  };