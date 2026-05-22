import * as components from './components'

export default [
  {
    path: '/organizationDataStatistics/list',
    component: components.OrganizationDataStatistics,
    name: '机构数据统计',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
