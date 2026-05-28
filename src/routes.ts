export const routes = [
  {
    path: '/',
    component: '@/pages/main',
    routes: [
      {
        name: '工作台',
        path: '/workbench',
        component: '@/pages/workbench/components/workbench',
        customClass: 'workbench',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '菜单栏配置',
        path: '/menu/list',
        component: '@/pages/menu/components/menu',
        customClass: 'menu',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '角色管理',
        path: '/role',
        component: '@/pages/role/components/role',
        customClass: 'role',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '权限管理',
        path: '/permission',
        component: '@/pages/permission/components/permission',
        customClass: 'permission',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '用户管理',
        path: '/user',
        component: '@/pages/user/components/user',
        customClass: 'user',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '文件管理',
        path: '/file',
        component: '@/pages/file/components/file',
        customClass: 'file',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '邮件管理',
        path: '/email',
        component: '@/pages/email/components/email',
        customClass: 'email',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '授权客户端',
        path: '/oauth/client',
        component: '@/pages/oauthClient/components/oauthClient',
        customClass: 'oauthClient',
        wrappers: ['@/wrappers/auth']
      },
      {
        name: 'Discount Expert 首页配置',
        path: '/discountExpert/home',
        component: '@/pages/discountExpert/home/components/home',
        customClass: 'discountExpertHome',
        wrappers: ['@/wrappers/auth']
      }
    ]
  },
  {
    name: '登录',
    path: '/login',
    component: '@/pages/login/components/login',
    customClass: 'login'
  },
  { path: '/404', component: '@/pages/common/components/the404' },
  { path: '/403', component: '@/pages/common/components/the403' },
  { path: '/500', component: '@/pages/common/components/the500' }
]
