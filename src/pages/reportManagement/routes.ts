import * as components from './components'

export default [
  {
    path: '/reportManagement/list',
    component: components.ReportManagement,
    name: '报告管理',
    // access: 'reportAnalysis',
    wrappers: ['@/wrappers/auth']
  }
]
