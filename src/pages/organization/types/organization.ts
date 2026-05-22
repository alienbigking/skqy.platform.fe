import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  name: string
  pid: string
  address?: string
  contact?: string
  mobile?: string
  remark?: string
  sort?: number
  uploadNotice?: number
}

interface IDetailParams {}

interface IUpdateParams {
  id: string
  name: string
  pid: string
  address?: string
  contact?: string
  mobile?: string
  remark?: string
  sort?: number
  uploadNotice?: number
  organizationId?: number
}

interface IListParams extends IPagination {
  name?: string
}

interface IAddPdfNumberParams {
  id: string
  delta: number
}

interface IReducePdfNumberParams {
  id: string
  delta: number
}

interface IPdfNumberListParams extends IPagination {
  id: string
}

interface IUpdatePdfNumberEnabledState {
  id: string
  enabled: boolean
}

interface IBatchAssignedDeviceListParams extends IPagination {
  organizationId?: string
}

interface IBatchAddAssignDeviceParams {
  organizationId: string
  productId: string
  serviceCount: number
  deviceIdList: string[]
}

interface IBatchAssignedDeviceIdsParams {}

interface IBatchUpdateAssignDeviceParams {
  id: string
  organizationId: string
  productId: string
  serviceCount: number
}

export {
  IAddParams,
  IDetailParams,
  IListParams,
  IUpdateParams,
  IAddPdfNumberParams,
  IReducePdfNumberParams,
  IPdfNumberListParams,
  IUpdatePdfNumberEnabledState,
  IBatchAssignedDeviceListParams,
  IBatchAddAssignDeviceParams,
  IBatchAssignedDeviceIdsParams,
  IBatchUpdateAssignDeviceParams
}
