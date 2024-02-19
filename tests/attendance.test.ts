import { ICheckInOutType } from "../src/modules/attendance/attendance.interface";
import { AttendenceService } from "../src/modules/attendance/attendance.service";
import { Sessions } from "../src/modules/attendance/sessions.model";

describe("attendance tests", () => {
  test("check-in", async () => {
    Sessions.prototype.getSessionsByInstructorId = jest
      .fn()
      .mockResolvedValue([]);

    Sessions.prototype.createSession = jest.fn().mockResolvedValue({
      instructorId: 89765,
      id: 1,
    });

    const attendanceService = new AttendenceService();

    const res = attendanceService.checkInAndOutInstructor({
      instructorId: 89765,
      type: ICheckInOutType.CHECK_IN,
    });

    expect(await res).toStrictEqual({
      id: 1,
      instructorId: 89765,
    });
  });

  test("check-in open sessions validations", async () => {
    Sessions.prototype.getSessionsByInstructorId = jest.fn().mockResolvedValue([
      {
        instructorId: 89765,
        id: 1,
      },
    ]);

    Sessions.prototype.createSession = jest.fn().mockResolvedValue({
      instructorId: 89765,
      id: 1,
    });

    const attendanceService = new AttendenceService();

    const res = await attendanceService
      .checkInAndOutInstructor({
        instructorId: 89765,
        type: ICheckInOutType.CHECK_IN,
      })
      .catch((error) => error.message);

    expect(res).toStrictEqual(
      "There is already an open session at this moment"
    );
  });

  test("check-out", async () => {
    Sessions.prototype.getSessionsByInstructorId = jest.fn().mockResolvedValue([
      {
        dataValues: {
          instructorId: 89765,
          checkInDate: new Date("12-12-2023"),
          id: 1,
        },
      },
    ]);

    Sessions.prototype.updateSession = jest.fn().mockResolvedValue({
      instructorId: 89765,
      id: 1,
    });

    const attendanceService = new AttendenceService();

    const res = attendanceService.checkInAndOutInstructor({
      instructorId: 89765,
      type: ICheckInOutType.CHECK_OUT,
    });

    expect(await res).toStrictEqual([
      {
        checkOutTime: expect.any(Date),
        status: "CLOSED",
        totalWorkingHours: NaN,
      },
    ]);
  });

  test("check-out open sessions validations", async () => {
    Sessions.prototype.getSessionsByInstructorId = jest
      .fn()
      .mockResolvedValue([]);

    Sessions.prototype.createSession = jest.fn().mockResolvedValue({
      instructorId: 89765,
      id: 1,
    });

    const attendanceService = new AttendenceService();

    const res = await attendanceService
      .checkInAndOutInstructor({
        instructorId: 89765,
        type: ICheckInOutType.CHECK_OUT,
      })
      .catch((error) => error.message);

    expect(res).toStrictEqual("There are no open sessions at this moment");
  });

  test("getMonthlyAnalytics", async () => {
    Sessions.prototype.getSessions = jest.fn().mockResolvedValue([
      {
        id: 1,
        instructorId: 2344,
        totalWorkingHours: 4,
      },
      {
        id: 2,
        instructorId: 2344,
        totalWorkingHours: 5,
      },
      {
        id: 3,
        instructorId: 23434,
        totalWorkingHours: 5,
      },
    ]);
    const attendanceService = new AttendenceService();
    const res = await attendanceService.getMonthlyAnalytics();
    expect(res).toStrictEqual([
      { instructorId: "2344", totalWorkingHours: 9 },
      { instructorId: "23434", totalWorkingHours: 5 },
    ]);
  });
});
