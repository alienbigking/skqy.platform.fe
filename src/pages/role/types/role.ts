import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  name: string
  roleCode?: string
  remark?: string
  permissionIds?: string[]
  organizationIds?: string[]
}

interface IUpdateParams {
  id?: number
  name: string
  roleCode?: string
  remark: string
  permissionIds?: string[]
  organizationIds?: string[]
}

interface IListParams extends IPagination {
  name?: string
}

interface IAllListParams {}

export { IAddParams, IListParams, IUpdateParams, IAllListParams }
