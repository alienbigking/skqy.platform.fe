export interface IAdminUserLite {
  id: string
  username?: string
  nickname?: string
  email?: string
  mobile?: string
  avatar?: string
}

export interface IAdminFeedback {
  id: string
  userId: string
  type: string
  title: string
  content: string
  contact: string
  attachments: string[]
  status: string
  adminRemark: string
  handledBy?: string
  handleDate?: number
  createDate: number
  updateDate?: number
  user?: IAdminUserLite | null
}

export interface IFeedbackListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: string
  status?: string
}
