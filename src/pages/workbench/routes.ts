import * as components from './components'

export default [
  {
    path: '/Workbench/list',
    component: components.Workbench,
    name: '角色管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
