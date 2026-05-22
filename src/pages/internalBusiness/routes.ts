import * as components from './components'

export default [
  {
    path: '/internalBusiness/list',
    component: components.InternalBusiness,
    name: '内部业务',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
