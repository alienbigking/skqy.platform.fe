import * as components from './components'

export default [
  {
    path: '/login',
    component: components.Login,
    name: '登录',
    // access: 'login',
    customClass: 'login',
    wrappers: ['@/wrappers/auth']
  }
]
