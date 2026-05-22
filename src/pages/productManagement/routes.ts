import * as components from './components'

export default [
  {
    path: '/productManagement/list',
    component: components.ProductManagement,
    name: '商品管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
