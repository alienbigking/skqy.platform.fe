import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  name: string
  header: string
  organizationId: number
  innerBusinessId: number
  sort: number
  remark: string
}

interface IUpdateParams {
  id: number
  name: string
  header: string
  organizationId: number
  innerBusinessId: number
  sort: number
  remark: string
}

interface IUpdateAssignDynamicDoctorParams {
  id: string
  dynamicAnalysisUserId: string
}

interface IUpdateAssignHealthDoctorParams {
  id: string
  healthAnalysisUserId: string
}

interface IListParams extends IPagination {
  name?: string
  organizationId?: number
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  IUpdateAssignDynamicDoctorParams,
  IUpdateAssignHealthDoctorParams
}
