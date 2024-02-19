import {
  CreationOptional,
  DataTypes,
  Model,
  Transaction,
  where,
} from "sequelize";
import {
  ICreateSessionsRequest,
  ISession,
  ISessionStatus,
  IUpdateSessionRequest,
} from "./attendance.interface";
import { sequelize } from "../../config/sequelize.config";
import { Op } from "sequelize";

/**
 * Updates the total working hours in the session if the check-in time or check-out time has changed.
 * @param {Object} session - The session object to update.
 * @returns None
 */
const bulkUpdateMethod = (session) => {
  if (session.changed("checkOutTime") || session.changed("checkInTime")) {
    const checkInTime = new Date(session.getDataValue("checkInTime")).valueOf();
    const checkOutTime = new Date(
      session.getDataValue("checkOutTime")
    ).valueOf();
    const totalWorkingHours = calculateTotalWorkingHours(
      checkInTime,
      checkOutTime
    );
    session.setDataValue("totalWorkingHours", totalWorkingHours);
  }
};

/**
 * Calculates the total working hours based on the check-in and check-out times provided.
 * @param {number} checkInTime - The timestamp of the check-in time.
 * @param {number} checkOutTime - The timestamp of the check-out time.
 * @returns {number} The total working hours as a decimal number with two decimal places.
 */
export const calculateTotalWorkingHours = (
  checkInTime: number,
  checkOutTime: number
): number => {
  return Number(((checkOutTime - checkInTime) / (1000 * 60)).toFixed(2)); // Calculating minutes
};

class SessionsDb extends Model<ISession> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare instructorId: number;
  declare totalWorkingHours: number;
  declare checkInTime: Date;
  declare checkOutTime: Date;
  declare status: ISessionStatus;
}

SessionsDb.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    instructorId: {
      type: DataTypes.INTEGER,
    },
    totalWorkingHours: {
      type: DataTypes.INTEGER,
    },
    checkInTime: {
      type: DataTypes.DATE,
    },
    checkOutTime: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "sessions",
    underscored: true,
    hooks: {
      beforeUpdate: bulkUpdateMethod,
    },
  }
);

export class Sessions {
  transaction: Transaction;

  async createSession(
    createSessionsRequest: ICreateSessionsRequest
  ): Promise<ISession> {
    return await SessionsDb.create(createSessionsRequest, {
      transaction: this.transaction,
    });
  }

  async updateSession(
    updateSessionRequest: IUpdateSessionRequest
  ): Promise<any> {
    const { ids, ...rest } = updateSessionRequest;
    return await SessionsDb.update(
      {
        ...rest,
      },
      {
        where: {
          id:
            ids.length == 1
              ? ids[0]
              : {
                  [Op.in]: ids,
                },
        },
        individualHooks: true,
        transaction: this.transaction,
      }
    );
  }

  async getSessions(createdAt: Date): Promise<ISession[]> {
    return await SessionsDb.findAll({
      where: {
        createdAt: {
          [Op.gte]: createdAt,
        },
      },
      transaction: this.transaction,
    });
  }

  async getSessionsByInstructorId(
    instructorId: number,
    status: ISessionStatus,
    createdAt: Date
  ): Promise<ISession[]> {
    return await SessionsDb.findAll({
      where: {
        instructorId: Number(instructorId),
        status,
        createdAt: { [Op.gte]: createdAt },
      },
      transaction: this.transaction,
    });
  }

  async getTransactions() {
    this.transaction = await sequelize.transaction();
  }
}
