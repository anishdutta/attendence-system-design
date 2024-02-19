import { CreationOptional, DataTypes, Model, where } from "sequelize";
import { ICreateSessionsRequest, ISession, ISessionStatus, IUpdateSessionRequest } from "./attendance.interface";
import { sequelize } from "../../config/sequelize.config";
import { Op } from "sequelize";

 const bulkUpdateMethod = (session) => {
    if (session.changed('checkOutTime') || session.changed('checkInTime')) {
      const checkInTime = new Date(session.getDataValue('checkInTime')).valueOf();
      const checkOutTime = new Date(session.getDataValue('checkOutTime')).valueOf();
      const totalWorkingHours = calculateTotalWorkingHours(checkInTime,checkOutTime);
      session.setDataValue('totalWorkingHours', totalWorkingHours);
    }
  }

  export const calculateTotalWorkingHours = (checkInTime:number,checkOutTime:number):number=>{
    return Number(((checkOutTime - checkInTime) / (1000 * 60)).toFixed(2)); // Calculating minutes
  }

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
        }
    },{
    sequelize,
    tableName: "sessions",
    underscored: true,
    hooks: {
        beforeUpdate: bulkUpdateMethod
      }
  });



export class Sessions{

    async createSession(createSessionsRequest: ICreateSessionsRequest):Promise<ISession>{
        return await SessionsDb.create(createSessionsRequest);
    };

    async updateSession(updateSessionRequest: IUpdateSessionRequest):Promise<any>{
        const {ids, ...rest} = updateSessionRequest;
        return await SessionsDb.update({
                ...rest
            },{
            where:{
                id: ids.length==1 ? ids[0] : {
                    [Op.in]:ids
                },
                
            },
            individualHooks: true
        })
    }

    async getSessions(createdAt: Date):Promise<ISession[]>{
        return await SessionsDb.findAll(
            {
                where:{
                    createdAt:{
                        [Op.gte]: createdAt
                    }
                }
            }
        )
    }

    async getSessionsByInstructorId(instructorId:number,status:ISessionStatus,createdAt:Date):Promise<ISession[]>{
        return await SessionsDb.findAll({
            where:{
                instructorId: Number(instructorId),
                status,
                createdAt: {[Op.gte]: createdAt}
            }
        })
    }

    
}

