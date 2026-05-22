import * as components from './components'

export default [
  {
    path: '/reportAnalysis/list',
    component: components.ReportAnalysis,
    name: '报告分析',
    // access: 'reportAnalysis',
    wrappers: ['@/wrappers/auth']
  }
]
