import * as components from './components'

export default [
  {
    path: '/menu/list',
    component: components.Menu,
    name: '菜单管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
