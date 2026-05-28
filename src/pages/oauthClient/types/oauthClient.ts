import { IPagination } from '@/pages/common/types/common'

interface IListParams extends IPagination {
  clientId?: string
  clientName?: string
  type?: string
  environment?: string
}

interface IClientParams {
  id?: string
  clientName: string
  type: string
  environment: string
  grants: string
  redirectUris: string
  clientSecret?: string
}

export { IListParams, IClientParams }
