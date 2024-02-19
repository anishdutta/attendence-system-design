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
  }

  async checkInAndOutInstructor(
    request: ICheckInOrOutRequest
  ): Promise<ISession | ISession[]> {
    switch (request.type) {
      case ICheckInOutType.CHECK_IN:
        return await this.handleCheckInRequest(request);
      case ICheckInOutType.CHECK_OUT:
        return await this.handleCheckOutRequest(request);
      default:
        throw new Error("There are no open sessions at this moment");
    }
  }

  private async handleCheckInRequest(
    request: ICheckInOrOutRequest
  ): Promise<ISession> {
    const todayAt0Hours = new Date();
    todayAt0Hours.setHours(0);
    const openSessions = await this.sessions.getSessionsByInstructorId(
      request.instructorId,
      ISessionStatus.OPEN,
      todayAt0Hours
    );
    console.log(openSessions);
    if (openSessions && openSessions.length > 0) {
      throw new Error("There is already an open session at this moment");
    }
    const session = await this.sessions.createSession({
      checkInTime: new Date(),
      instructorId: request.instructorId,
      status: ISessionStatus.OPEN,
    });
    return session;
  }

  private async handleCheckOutRequest(
    request: ICheckInOrOutRequest
  ): Promise<ISession[]> {
    const todayAt0Hours = new Date();
    todayAt0Hours.setHours(0);
    const openSessions = await this.sessions.getSessionsByInstructorId(
      request.instructorId,
      ISessionStatus.OPEN,
      todayAt0Hours
    );
    if (!openSessions || openSessions.length === 0) {
      throw new Error("There are no open sessions at this moment");
    }
    const checkOutTime = new Date();
    await this.sessions.updateSession({
      ids: openSessions.map((session) => session.id),
      status: ISessionStatus.CLOSED,
      checkOutTime: checkOutTime,
    });
    return this.constructCheckOutSessions(openSessions.map(session=>session['dataValues']),checkOutTime);
  }

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
  }

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
}
