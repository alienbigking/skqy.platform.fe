import { EPageType, IPagination } from '@/pages/common/types/common'

interface IAddParams {
  pid: string
  name: string
  url: string
  type: number
  sort?: number
  permissions?: string
  icon?: string
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
}

interface IMenuListByType {
  type: EPageType
}

interface IMenuListParams extends IPagination {
  name?: string
}

export { IAddParams, IMenuListParams, IMenuListByType, IUpdateParams }
