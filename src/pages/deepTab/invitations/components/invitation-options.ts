export const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待接受', value: 'pending' },
  { label: '已注册', value: 'registered' },
  { label: '已订阅', value: 'subscribed' },
  { label: '已失效', value: 'expired' }
]

export const statusColorMap: Record<string, string> = {
  pending: 'gold',
  registered: 'blue',
  subscribed: 'green',
  expired: 'default'
}

export const statusTextMap: Record<string, string> = {
  pending: '待接受',
  registered: '已注册',
  subscribed: '已订阅',
  expired: '已失效'
}
