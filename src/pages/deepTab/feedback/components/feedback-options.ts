export const feedbackTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '功能建议', value: 'feature' },
  { label: '问题反馈', value: 'bug' },
  { label: '体验优化', value: 'experience' },
  { label: '其他', value: 'other' }
]

export const feedbackStatusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已解决', value: 'resolved' },
  { label: '已关闭', value: 'closed' }
]

export const statusColorMap: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  resolved: 'green',
  closed: 'default'
}

export const statusTextMap: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭'
}
