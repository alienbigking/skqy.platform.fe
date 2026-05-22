import * as components from './components'

export default [
  {
    path: '/role/list',
    component: components.Role,
    name: '角色管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
