import { IPagination } from '@/pages/common/types/common'

interface IUserAddParams {
  nickname: string
  userIdentifier: string
  password: string
  email?: string
  mobile?: string
  gender?: string
  status?: string
  active?: number
  remark?: string
  organizationId?: string
  roleIds?: string[]
}

interface IListParams extends IPagination {
  nickname?: string
  mobile?: string
  email?: string
  status?: string
}

interface IUpdateParams {
  id: string
  nickname?: string
  email?: string
  gender?: string
  mobile?: string
  status?: string
  active?: number
  remark?: string
  organizationId?: string
  roleIds?: string[]
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
