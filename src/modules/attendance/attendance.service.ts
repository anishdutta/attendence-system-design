import { Transaction } from "sequelize";
import {
  ICheckInOrOutRequest,
  ICheckInOutType,
  IGetMonthlyAnalytics,
  ISession,
  ISessionStatus,
} from "./attendance.interface";
import { Sessions, calculateTotalWorkingHours } from "./sessions.model";

export class AttendenceService {
  sessions: Sessions;

  constructor() {
    this.sessions = new Sessions();
  };

  /**
   * Retrieves monthly analytics data for instructors.
   * @returns A promise that resolves to an array of objects containing instructor IDs and total working hours.
   */
  async getMonthlyAnalytics(): Promise<IGetMonthlyAnalytics[]> {
    const monthBackDate = new Date();
    monthBackDate.setMonth(monthBackDate.getMonth() - 1);

    const sessions = await this.sessions.getSessions(monthBackDate);

    const instructorIdSessionMap: { [key: string]: number } = {};

    sessions.map((session) => {
      instructorIdSessionMap[session.instructorId] =
        (instructorIdSessionMap?.[session.instructorId] || 0) +
        session.totalWorkingHours;
    });

    return Object.keys(instructorIdSessionMap).map(instructorId=>{
        return {
            instructorId,
            totalWorkingHours: instructorIdSessionMap[instructorId]
        } as IGetMonthlyAnalytics
    });
  }

  /**
   * Checks in or checks out an instructor based on the request type.
   * @param {ICheckInOrOutRequest} request - The request object containing the type of check-in or check-out.
   * @returns {Promise<ISession | ISession[]>} - A promise that resolves to the checked-in or checked-out session(s).
   * @throws {Error} - If there are no open sessions at the moment.
   */
  async checkInAndOutInstructor(
    request: ICheckInOrOutRequest
  ): Promise<ISession | ISession[]> {
    const t = await this.sessions.getTransactions();
    let response:ISession | ISession[];
    switch (request.type) {
      case ICheckInOutType.CHECK_IN:
        response =  await this.handleCheckInRequest(request,t);
        break;
      case ICheckInOutType.CHECK_OUT:
        response =  await this.handleCheckOutRequest(request,t);
        break;
      default:
        throw new Error("There are no open sessions at this moment");
    }
    await this.sessions.transaction.commit();
    return response;
  };


   /**
   * -----  Private Methods --------
   */

  private async handleCheckInRequest(
    request: ICheckInOrOutRequest,
    transaction: Transaction
  ): Promise<ISession> {
    const todayAt0Hours = new Date();
    todayAt0Hours.setHours(0);
    const openSessions = await this.sessions.getSessionsByInstructorId(
      request.instructorId,
      ISessionStatus.OPEN,
      todayAt0Hours,
      transaction
    );
    console.log(openSessions);
    if (openSessions && openSessions.length > 0) {
      throw new Error("There is already an open session at this moment");
    }
    const session = await this.sessions.createSession({
      checkInTime: new Date(),
      instructorId: request.instructorId,
      status: ISessionStatus.OPEN,
    },transaction);
    return session;
  };

  private async handleCheckOutRequest(
    request: ICheckInOrOutRequest,
    transaction: Transaction
  ): Promise<ISession[]> {
    const todayAt0Hours = new Date();
    todayAt0Hours.setHours(0);
    const openSessions = await this.sessions.getSessionsByInstructorId(
      request.instructorId,
      ISessionStatus.OPEN,
      todayAt0Hours,
      transaction
    );
    if (!openSessions || openSessions.length === 0) {
      throw new Error("There are no open sessions at this moment");
    }
    const checkOutTime = new Date();
    await this.sessions.updateSession({
      ids: openSessions.map((session) => session.id),
      status: ISessionStatus.CLOSED,
      checkOutTime: checkOutTime,
    },transaction);
    return this.constructCheckOutSessions(openSessions.map(session=>session['dataValues']),checkOutTime);
  };

  private constructCheckOutSessions(sessions:ISession[],checkOutTime:Date):ISession[]{
    return sessions.map(session=>{
        const finalSession= {
            ...session,
            status: ISessionStatus.CLOSED,
            checkOutTime: checkOutTime,
        }
        return {
            ...finalSession,
            totalWorkingHours: calculateTotalWorkingHours(new Date(finalSession.checkInTime).valueOf(),new Date(finalSession.checkOutTime).valueOf())
        } as ISession
    });
  };
}
