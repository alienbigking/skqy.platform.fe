import * as components from './components'

export default [
  {
    path: '/miniProgramUser/list',
    component: components.MiniProgramUser,
    name: '角色管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
