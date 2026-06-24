import type { NotificationStatus, NotificationType } from '../types/notifications'

export const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '普通通知', value: 'info' },
  { label: '成功提醒', value: 'success' },
  { label: '重要提醒', value: 'warning' },
  { label: '异常提醒', value: 'error' }
]

export const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' }
]

export const typeColorMap: Record<NotificationType, string> = {
  info: 'blue',
  success: 'green',
  warning: 'gold',
  error: 'red'
}

export const typeTextMap: Record<NotificationType, string> = {
  info: '普通通知',
  success: '成功提醒',
  warning: '重要提醒',
  error: '异常提醒'
}

export const statusColorMap: Record<NotificationStatus, string> = {
  draft: 'default',
  published: 'green',
  offline: 'volcano'
}

export const statusTextMap: Record<NotificationStatus, string> = {
  draft: '草稿',
  published: '已发布',
  offline: '已下线'
}
