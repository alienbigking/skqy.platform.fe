export type Entity = 'applications' | 'comments' | 'reports'
export interface IWalletRecord {
  id: string
  userId: string
  targetUserId?: string
  comment?: { content: string; userId: string }
  nickname?: string
  userStatus?: string
  productName?: string
  amountCents?: number
  reason?: string
  content?: string
  images?: string[]
  alternative?: string
  alternativeNote?: string
  scope?: string
  approvalStatus?: string
  purchaseDecision?: string
  moderationStatus?: string
  status?: string
  adminRemark?: string
  createDate: number
  application?: {
    id: string
    productName: string
    reason: string
    images: string[]
    userId: string
  }
}
export interface IListParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}
