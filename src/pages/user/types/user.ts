import { EAccountStatus } from '@/pages/common/types/common'

interface IUserAddParams {}

interface IListParams {}

interface IUpdateParams {
  id: number
  nickname: string
  dataScopeIds?: string
  email?: string
  gender?: string
  mobile?: string
  status?: EAccountStatus
  remark?: string
}

interface IAssignParams {
  id: string
  assignIds?: string[]
}

interface IAssignedIds {
  id: string
}

export {
  IUserAddParams,
  IListParams,
  IUpdateParams,
  IAssignParams,
  IAssignedIds
}
