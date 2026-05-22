const createPlaceholderItem = (id: number = 0) => ({
  isPlaceholder: true,
  type: 1,
  content: {
    id,
    userId: '',
    username: '',
    gender: 0,
    age: '',
    original: '',
    labels: [
      {
        labelId: '',
        name: ''
      }
    ],
    summary: [
      {
        detail: '',
        short: ''
      }
    ],
    metrics: {
      avgHr: '0'
    }
  },
  sender: {},
  recevier: {},
  timestamp: 1000,
  isRedWarn: false,
  isYellowWarn: false,
  ecgData: []
})
export { createPlaceholderItem }
