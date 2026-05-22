import * as components from './components'

export default [
  {
    path: '/log/list',
    component: components.Log,
    name: '日志管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
