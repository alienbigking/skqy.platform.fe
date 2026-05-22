import * as components from './components'

export default [
  {
    path: '/interpretationManagement/list',
    component: components.InterpretationManagement,
    name: '解读管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
