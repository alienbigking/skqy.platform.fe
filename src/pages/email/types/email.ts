import { IPagination } from '@/pages/common/types/common'

interface IListParams extends IPagination {
  to?: string
  subject?: string
  status?: string
}

interface ISendParams {
  to: string
  subject: string
  text?: string
  html?: string
  region?: string
}

export { IListParams, ISendParams }
