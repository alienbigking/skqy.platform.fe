export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationStatus = 'draft' | 'published' | 'offline'

export interface IDeepTabNotification {
  id: string
  title: string
  content: string
  type: NotificationType
  status: NotificationStatus
  actionText?: string
  actionUrl?: string
  priority: number
  durationSeconds: number
  startAt?: number
  endAt?: number
  publishedAt?: number
  createdBy?: string
  updatedBy?: string
  createDate: number
  updateDate: number
}

export interface INotificationListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: NotificationType | ''
  status?: NotificationStatus | ''
}
