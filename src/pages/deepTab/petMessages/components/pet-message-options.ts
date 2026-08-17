export const languageOptions = [
  ['zh-CN', '简体中文'],
  ['en', '英语'],
  ['ja', '日语'],
  ['fr', '法语'],
  ['de', '德语'],
  ['ar', '阿拉伯语'],
  ['es', '西班牙语'],
  ['pt', '葡萄牙语'],
  ['ko', '韩语'],
  ['vi', '越南语'],
  ['th', '泰语'],
  ['my', '缅甸语'],
  ['lo', '老挝语'],
  ['nl', '荷兰语'],
  ['ru', '俄语']
].map(([value, label]) => ({ value, label }))

export const categoryOptions = [
  ['greeting', '时间问候'],
  ['encouragement', '每日鼓励'],
  ['wisdom', '智言智语'],
  ['break', '休息提醒'],
  ['weather', '天气关怀'],
  ['holiday', '节日问候'],
  ['focus', '专注提醒']
].map(([value, label]) => ({ value, label }))

export const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'offline', label: '已下线' }
]

export const optionText = (
  options: Array<{ value: string; label: string }>,
  value: string
) => options.find((item) => item.value === value)?.label || value
