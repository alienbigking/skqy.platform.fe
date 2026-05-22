import * as components from './components'

export default [
  {
    path: '/organizationBusiness/list',
    component: components.OrganizationBusiness,
    name: '机构业务',
    // access: 'menu',
    wrappers: ['@/wrappers/auth']
  }
]
