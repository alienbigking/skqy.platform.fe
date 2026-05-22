import * as components from './components'

export default [
  {
    path: '/appConfig/list',
    component: components.AppConfig,
    name: '应用配置管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
