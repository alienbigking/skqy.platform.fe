import * as components from './components'

export default [
  {
    path: '/deviceManagement/list',
    component: components.DeviceManagement,
    name: '设备管理',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
