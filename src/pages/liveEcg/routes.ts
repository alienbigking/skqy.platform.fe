import * as components from './components'

export default [
  {
    path: '/liveEcg/liveEcg',
    component: components.LiveEcg,
    name: '角色管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
