import * as components from './components'

export default [
  {
    path: '/permission/list',
    component: components.Permission,
    name: '权限管理',
    wrappers: ['@/wrappers/auth']
  }
]
