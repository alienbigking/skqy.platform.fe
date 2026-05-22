import { IPagination } from '@/pages/common/types/common'

interface IAddParams {}

interface IUpdateParams {
  id: number
  name: string
  remark: string
}

interface IListParams extends IPagination {
  id?: string
  conditions?: string
}

interface ILiveUserListParams {
  username: string
}

interface ICustomClassName {
  show?: string
  none?: string
}

interface ISetThresholdParams {}

interface IUpdateSetThresholdParams {
  tachycardiaThreshold: number
  bradycardiaThreshold: number
  notifySignalInterrupt: boolean
  realtimeStatistics: boolean
  sidebarUserList: boolean
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  ICustomClassName,
  ILiveUserListParams,
  ISetThresholdParams,
  IUpdateSetThresholdParams
}
