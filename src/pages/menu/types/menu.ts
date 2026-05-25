import { EPageType, IPagination } from '@/pages/common/types/common'

interface IAddParams {
  pid: string
  name: string
  url: string
  type: number
  sort?: number
  permissions?: string
  icon?: string
  isActive?: boolean
}

interface IUpdateParams {
  id: string
  pid: string
  name: string
  url: string
  type: number
  sort?: number
  permissions?: string
  icon?: string
  isActive?: boolean
}

interface IMenuListByType {
  type: EPageType
}

interface IMenuListParams extends IPagination {
  name?: string
  tree?: boolean
}

export { IAddParams, IMenuListParams, IMenuListByType, IUpdateParams }
