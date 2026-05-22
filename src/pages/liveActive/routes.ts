import * as components from './components'

export default [
  {
    path: '/liveActive/list',
    component: components.LiveActive,
    name: '实时用户',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
