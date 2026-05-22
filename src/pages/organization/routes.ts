import * as components from './components'

export default [
  {
    path: '/organization/list',
    component: components.Organization,
    name: '机构管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
