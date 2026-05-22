import * as components from './components'

export default [
  {
    path: '/personalSet/list',
    component: components.PersonalSet,
    name: '个人设置',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
