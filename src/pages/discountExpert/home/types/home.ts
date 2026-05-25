import { IPagination } from '@/pages/common/types/common'

interface IHomePlatform {
  id: string
  name: string
  color: string
}

interface IHomeEntry {
  id: string
  appType?: string
  platformId: string
  platformName: string
  platformColor: string
  title: string
  deeplink: string
  webFallback?: string
  category: string
  icon?: string
  tag?: string
  appScheme?: string
  sortOrder?: number
  isActive?: boolean
  createdAt?: number
  updatedAt?: number
}

interface IHomeConfigResponse {
  platforms?: IHomePlatform[]
  entries?: IHomeEntry[]
}

interface IHomeEntryListParams extends IPagination {
  platformId?: string
  category?: string
  includeInactive?: boolean
}

interface ICreateHomeEntryParams {
  platformId: string
  platformName: string
  platformColor: string
  title: string
  deeplink: string
  webFallback?: string
  category?: string
  icon?: string
  tag?: string
  appScheme?: string
  sortOrder?: number
  isActive?: boolean
}

interface IUpdateHomeEntryParams extends Partial<ICreateHomeEntryParams> {
  id: string
}

export type {
  IHomePlatform,
  IHomeEntry,
  IHomeConfigResponse,
  IHomeEntryListParams,
  ICreateHomeEntryParams,
  IUpdateHomeEntryParams
}
