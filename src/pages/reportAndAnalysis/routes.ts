import * as components from './components'

export default [
  {
    path: '/reportAndAnalysis/list',
    component: components.ReportAndAnalysis,
    name: '报告与分析',
    // access: 'reportAnalysis',
    wrappers: ['@/wrappers/auth']
  }
]
