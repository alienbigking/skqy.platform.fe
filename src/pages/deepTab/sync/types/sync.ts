import type { IAdminUserLite } from '@/pages/deepTab/feedback/types/feedback'

export interface ISyncRecord {
  id: string
  userId: string
  version: number
  payload: Record<string, any>
  createDate: number
  updateDate: number
  user?: IAdminUserLite | null
}

export interface ISyncListParams {
  page?: number
  pageSize?: number
  keyword?: string
}
