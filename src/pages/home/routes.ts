import * as components from './components'

export default [
  {
    path: '/home/list',
    component: components.Home,
    name: '主页',
    // access: 'home',
    wrappers: ['@/wrappers/auth']
  }
]
