import * as components from './components'

export default [
  {
    path: '/dataManagement/list',
    component: components.DataManagement,
    name: '机构业务',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
