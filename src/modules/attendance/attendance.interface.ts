export interface ISession {
    id: number,
    createdAt: Date,
    instructorId: number,
    checkInTime: Date,
    checkOutTime?: Date,
    status: ISessionStatus,
    totalWorkingHours?: number
}

export enum ISessionStatus  {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export type ICreateSessionsRequest = Omit<ISession,'id'|'createdAt'|'totalWorkingHours'>

export interface ICheckInOrOutRequest {
    instructorId: number,
    type: ICheckInOutType
}

export type IUpdateSessionRequest = {
    ids: number[]
} & Partial<ICreateSessionsRequest>

export enum ICheckInOutType {
    CHECK_IN = 'check-in',
    CHECK_OUT = 'check-out'
}

export interface IGetMonthlyAnalytics{
    instructorId: string,
    totalWorkingHours: number
}