import * as components from './components'

export default [
  {
    path: '/appUser/list',
    component: components.AppUser,
    name: 'app用户管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
