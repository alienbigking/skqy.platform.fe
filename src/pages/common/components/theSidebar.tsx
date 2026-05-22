import React, { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import styles from './theSidebar.less'
import cn from 'classnames'
import loginImageURl from '@/assets/images/login.png'
import logoShrinkImageURl from '@/assets/images/logoShrink.png'
import { history, useLocation } from '@umijs/max'
// useLocation
import {
  BuildOutlined,
  CalendarOutlined,
  ClusterOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  FireOutlined,
  FontColorsOutlined,
  FundProjectionScreenOutlined,
  GroupOutlined,
  HeatMapOutlined,
  HomeOutlined,
  InsertRowBelowOutlined,
  ProductOutlined,
  ProfileOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SlackOutlined,
  SlidersOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  WechatOutlined
} from '@ant-design/icons'
import { useRecoilState } from 'recoil'
import { commonStore } from '../stores'
import { storage } from '@/utils'
import { commonService } from '@/pages/common/services'
import { env } from '@/config/env'

interface Props {}

type MenuItem = Required<MenuProps>['items'][number]
const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    label,
    key,
    icon,
    children,
    type
  } as MenuItem
}
const TheSidebar: React.FC<Props> = (props) => {
  const [collapsed, setCollapsed] = useState(false)
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [defaultOpenKeys, setDefaultOpenKeys] = useRecoilState<string[]>(
    commonStore.defaultOpenKeys
  )
  const [routeInfoStore, setRouteInfoStore] = useRecoilState(
    commonStore.routeInfoStore
  )
  const [isExpandMenu, setIsExpandMenu] = useRecoilState(
    commonStore.isExpandMenu
  )

  const { pathname } = useLocation()

  useEffect(() => {
    setSelectedKeys([pathname])
    if (items.length === 0) {
      setDefaultOpenKeys(storage.getSession('defaultOpenKeys'))
      getList()
    }
  }, [pathname])

  useEffect(() => {
    setCollapsed(isExpandMenu)
  }, [isExpandMenu])

  const getList = async () => {
    const { data } = await commonService.getMenuBarList()
    console.log('获取的侧边栏菜单集合', data)
    handleMenuItem(data?.list, false)
  }

  const handleMenuItem = (data: any, isChildren = false) => {
    const result = data?.map((item: any) => {
      return getItem(
        item.name,
        item.url,
        handleMenuIcon(item, isChildren),
        item.children.length && [...handleMenuItem(item.children, true)]
      )
    })
    setItems(result)
    return result
  }

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('当前点击的菜单 ', e)
    console.log('环境', env)
    if (e.key === '/liveEcg') {
      window.open(`${env.HOST_STATIC_RESOURCE_URL}#/liveEcg`, '_blank') // 在新标签页中打开页面
    } else if (e.key === '/aiReportAutoGeneration') {
      window.open(
        `${env.HOST_STATIC_RESOURCE_URL}#/aiReportAutoGeneration`,
        '_blank'
      ) // 在新标签页中打开页面
    } else {
      history.push(e.key)
      // setRouteInfoStore({
      //   path: e.key
      // })
      setSelectedKeys([e.key])
    }
  }

  const handleMenuIcon = (item: any, isChildren: boolean) => {
    if (!isChildren) {
      switch (item.name) {
        case '工作台':
          return <HomeOutlined />
        case '用户管理':
          return <UserOutlined />
        case '系统配置':
          return <SettingOutlined />
        case '日志管理':
          return <CalendarOutlined />
        case '内部业务配置':
          return <GroupOutlined />
        case '机构业务配置':
          return <ClusterOutlined />
        case '数据管理':
          return <SlidersOutlined />
        case '报告分析':
          return <DeploymentUnitOutlined />
        case '报告管理':
          return <ProfileOutlined />
        case '实时活跃':
          return <SlackOutlined />
        case '监测用户管理':
          return <WechatOutlined />
        case '实时心电':
          return <FundProjectionScreenOutlined />
        case '个人信息':
          return <UserOutlined />
        case '设备管理':
          return <InsertRowBelowOutlined />
        case '报告与分析':
          return <ContainerOutlined />
        case 'app用户管理':
          return <UsergroupAddOutlined />
        case '产品类别':
          return <ProductOutlined />
        case '商品管理':
          return <ShoppingOutlined />
        case '设备版本管理':
          return <FireOutlined />
        case 'AI报告自动生成':
          return <FontColorsOutlined />
        case '应用配置':
          return <BuildOutlined />
        case '机构数据统计':
          return <HeatMapOutlined />
        case '解读管理':
          return <CreditCardOutlined />

        default:
          return <FileTextOutlined />
      }
    }

    return
  }

  const onOpenChange = (openKeys: string[]) => {
    console.log('展开子菜单项', openKeys)
    storage.setSession('defaultOpenKeys', openKeys)
    setOpenKeys(openKeys)
    setDefaultOpenKeys(openKeys)
  }

  return (
    <div
      className={cn([styles.theSidebar])}
      style={{ width: collapsed ? 80 : 208 }}
    >
      <div className={cn(styles.logo)}>
        <img
          alt="乐心平江logo"
          src={collapsed ? logoShrinkImageURl : loginImageURl}
          className={cn([
            collapsed ? styles.logoShrinkImage : styles.logoImage
          ])}
        />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={selectedKeys}
        // openKeys={openKeys}
        defaultOpenKeys={defaultOpenKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  )
}

export default TheSidebar
