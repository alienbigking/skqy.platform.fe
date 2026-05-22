import * as components from './components'

export default [
  {
    path: '/internalProduct/list',
    component: components.InternalProduct,
    name: '机构产品',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
