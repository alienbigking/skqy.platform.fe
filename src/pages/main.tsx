import styles from './main.less'
import { Outlet, useAccess, useRoutes } from '@umijs/max'
import cn from 'classnames'
import { TheBreadcrumb, TheContent, TheHeader, TheSidebar } from './common'
import { App, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

// import { Route, Switch } from 'react-router-dom'

const Main: React.FC = () => {
  // const { name } = useModel('home.ts')
  const access = useAccess() //  access 值为 access.ts返回配置的权限对象
  const routes = useRoutes([])
  // console.log('组件获取的权限', access)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Menu: {
            itemSelectedBg: '#33A596', // 选中背景色
            itemSelectedColor: '#ffffff' // 选中文字颜色
          }
        },
        token: {
          lineHeight: 1.15 // 全局覆盖，默认行高 1.57以上，会导致高度太高，容易超出容器
        }
      }}
    >
      <App>
        <div className={styles.main}>
          <div className={styles.content}>
            <TheSidebar />
            <div className={cn(styles.contentRight)}>
              <TheHeader />
              <TheBreadcrumb />
              <TheContent>
                <Outlet />
              </TheContent>
              {/*底部信息*/}
              {/*<TheFooter />*/}
            </div>
          </div>
        </div>
      </App>
    </ConfigProvider>
  )
}

export default Main
