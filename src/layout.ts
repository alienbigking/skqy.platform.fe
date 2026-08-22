import skyOriginLogo from '@/assets/images/sky-origin-logo-transparent.png'

export const layout = () => {
  return {
    title: '运营系统',
    logo: skyOriginLogo,
    menu: {
      locale: false
    },
    menuRender: false,
    hideInMenu: true,
    menuHeaderRender: false,
    headerRender: false
  }
}
