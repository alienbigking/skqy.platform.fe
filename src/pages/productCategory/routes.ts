import * as components from './components'

export default [
  {
    path: '/productCategory/list',
    component: components.ProductCategory,
    name: '产品类别',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
