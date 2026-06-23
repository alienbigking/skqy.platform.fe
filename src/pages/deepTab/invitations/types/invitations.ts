import type { IAdminUserLite } from '@/pages/deepTab/feedback/types/feedback'

export interface IAdminInvitation {
  id: string
  userId: string
  inviteCode: string
  inviteeEmail: string
  inviteeStatus: string
  inviteDate: number
  reward: number
  createDate: number
  updateDate: number
  user?: IAdminUserLite | null
}

export interface IInvitationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}
