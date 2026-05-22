import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  userProfile: {
    organizationId?: string
    username?: string
    nickname?: string
    birthDate?: number
    gender?: string
    mobile?: string
    height?: number
    weight?: number
  }
  sn?: string
  boxSn?: string
}

interface IUpdateParams {
  id: string
  userProfile: {
    organizationId?: string
    username?: string
    nickname?: string
    birthDate?: number
    gender?: string
    mobile?: string
    height?: number
    weight?: number
  }
  sn?: string
  boxSn?: string
}

interface IParamsHistory extends IPagination {
  id: string
  startTime?: string
  endTime?: string
  conditions?: string
}

interface IListParams extends IPagination {
  name?: string
}

interface IHeartRateList {
  id?: string
  startTime?: string
  endTime?: string
}

interface ISetTimeParams {
  id: string
  startTime?: string
  endTime?: string
  recordId?: string
}

interface IUserInfoParams {
  id: string
}

interface IBindParams {
  id: string
}

interface IUnbindParams {
  id: string
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  IParamsHistory,
  IHeartRateList,
  ISetTimeParams,
  IUserInfoParams,
  IBindParams,
  IUnbindParams
}
