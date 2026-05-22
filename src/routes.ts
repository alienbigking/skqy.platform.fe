export const routes = [
  {
    path: '/',
    component: '@/pages/main',
    routes: [
      // {
      //   name: '主页',
      //   path: '/home',
      //   component: '@/pages/home/components/home',
      //   customClass: 'home',
      //   wrappers: ['@/wrappers/auth']
      //   // access: 'home'
      // },
      {
        name: '工作台',
        path: '/workbench',
        component: '@/pages/workbench/components/workbench',
        customClass: 'workbench',
        wrappers: ['@/wrappers/auth']
        // access: 'home'
      },
      {
        name: '页面配置',
        path: '/menu',
        component: '@/pages/menu/components/menu',
        customClass: 'menu',
        wrappers: ['@/wrappers/auth']
        // access: 'menu'
      },
      {
        name: '角色管理',
        path: '/role',
        component: '@/pages/role/components/role',
        customClass: 'role',
        wrappers: ['@/wrappers/auth'],
        routes: [
          {
            name: '测试管理',
            path: '/role/organizationBusiness',
            component:
              '@/pages/organizationBusiness/components/organizationBusiness'
          }
        ]
        // access: 'menu'
      },
      {
        name: '用户管理',
        path: '/user',
        component: '@/pages/user/components/user',
        customClass: 'user',
        wrappers: ['@/wrappers/auth']
        // access: 'user'
      },
      {
        name: '机构管理',
        path: '/organization',
        component: '@/pages/organization/components/organization',
        customClass: 'organization',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '内部业务配置',
        path: '/internalBusiness',
        component: '@/pages/internalBusiness/components/internalBusiness',
        customClass: 'internalBusiness',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '机构业务配置',
        path: '/organizationBusiness',
        component:
          '@/pages/organizationBusiness/components/organizationBusiness',
        customClass: 'organizationBusiness',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '数据管理',
        path: '/dataManagement',
        component: '@/pages/dataManagement/components/dataManagement',
        customClass: 'dataManagement',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '报告分析',
        path: '/reportAnalysis',
        component: '@/pages/reportAnalysis/components/reportAnalysis',
        customClass: 'reportAnalysis',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '报告管理',
        path: '/reportManagement',
        component: '@/pages/reportManagement/components/reportManagement',
        customClass: 'reportManagement',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '实时活跃',
        path: '/liveActive',
        component: '@/pages/liveActive/components/liveActive',
        customClass: 'liveActive',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '监测用户管理',
        path: '/miniProgramUser',
        component: '@/pages/miniProgramUser/components/miniProgramUser',
        customClass: 'miniProgramUser',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '日志管理',
        path: '/log',
        component: '@/pages/log/components/log',
        customClass: 'log',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '个人设置',
        path: '/personalSet',
        component: '@/pages/personalSet/components/personalSet',
        customClass: 'personalSet',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '设备管理',
        path: '/deviceManagement',
        component: '@/pages/deviceManagement/components/deviceManagement',
        customClass: 'deviceManagement',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '报告与分析',
        path: '/reportAndAnalysis',
        component: '@/pages/reportAndAnalysis/components/reportAndAnalysis',
        customClass: 'reportAndAnalysis',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: 'app用户管理',
        path: '/appUser',
        component: '@/pages/appUser/components/appUser',
        customClass: 'appUser',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '应用配置管理',
        path: '/appConfig',
        component: '@/pages/appConfig/components/appConfig',
        customClass: 'appConfig',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '产品类别',
        path: '/productCategory',
        component: '@/pages/productCategory/components/productCategory',
        customClass: 'productCategory',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '商品管理',
        path: '/productManagement',
        component: '@/pages/productManagement/components/productManagement',
        customClass: 'productManagement',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '设备版本管理',
        path: '/deviceVersion',
        component: '@/pages/deviceVersion/components/deviceVersion',
        customClass: 'deviceVersion',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '机构数据统计',
        path: '/organizationDataStatistics',
        component:
          '@/pages/organizationDataStatistics/components/organizationDataStatistics',
        customClass: 'organizationDataStatistics',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '解读管理',
        path: '/interpretationManagement',
        component:
          '@/pages/interpretationManagement/components/interpretationManagement',
        customClass: 'interpretationManagement',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      },
      {
        name: '机构产品',
        path: '/internalProduct',
        component: '@/pages/internalProduct/components/internalProduct',
        customClass: 'internalProduct',
        wrappers: ['@/wrappers/auth']
        // access: 'organization'
      }
    ]
  },
  {
    name: '登录',
    path: '/login',
    component: '@/pages/login/components/login',
    customClass: 'login'
    // access: 'login'
  },
  { path: '/404', component: '@/pages/common/components/the404' },
  { path: '/403', component: '@/pages/common/components/the403' },
  { path: '/500', component: '@/pages/common/components/the500' },
  {
    name: '实时心电',
    path: '/liveEcg',
    // 新页面打开
    target: '_blank',
    component: '@/pages/liveEcg/components/liveEcg',
    customClass: 'liveEcg',
    wrappers: ['@/wrappers/auth']
    // access: 'organization'
  },
  {
    name: 'AI报告自动生成',
    path: '/aiReportAutoGeneration',
    // 新页面打开
    target: '_blank',
    component:
      '@/pages/aiReportAutoGeneration/components/aiReportAutoGeneration',
    customClass: 'aiReportAutoGeneration',
    wrappers: ['@/wrappers/auth']
    // access: 'organization'
  }
]
