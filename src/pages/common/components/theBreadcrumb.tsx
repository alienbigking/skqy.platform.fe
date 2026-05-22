import React, { memo, useEffect, useState } from 'react'
import cn from 'classnames'
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import styles from './theBreadcrumb.less'
import { useLocation } from '@umijs/max'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/pages/common/stores'
import { isNullObject } from '@/utils'
import { routes } from '@/routes'
import { Link } from 'react-router-dom'

interface Props {}

const initBreadcrumbData = [
  {
    path: '/workbench',
    title: (
      <>
        <HomeOutlined style={{ marginRight: 4 }} />
        <span>主页</span>
      </>
    )
  }
]

const TheBreadcrumb: React.FC<Props> = memo((props) => {
  const [breadcrumb, setBreadcrumb] = useState<any>(initBreadcrumbData)
  const [routeInfoStore, setRouteInfoStore] = useRecoilState(
    commonStore.routeInfoStore
  )

  let currentRoute: any
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/') {
      // 如有主页直接显示初始面包屑
      setBreadcrumb(initBreadcrumbData)
    } else {
      handleCurrentRoute({ path: pathname })
    }
  }, [pathname])

  const handleCurrentRoute = (location: any) => {
    let data: any[] = []

    const route = findCurrentRoute(routes, location)
    console.log('当前路由匹配成功', route)

    const result = findParentObjects(routes, route)
    console.log('所有的父级路由对象', result)

    result.forEach((item: any) => {
      // 当前激活的只需要名称，上级需要给定路径
      if (item.path !== '/') {
        console.log('当前面包屑激活的路由对象', item)
        data.push({
          title: <Link to={item?.path}>{item?.name}</Link>
        })
      }
    })

    data.push({
      // path: route?.path,
      title: route?.name
    })
    console.log('当前面包屑', data)

    console.log('面包屑路由集合', [...initBreadcrumbData, ...data])
    setBreadcrumb([...initBreadcrumbData, ...data])
  }

  const findCurrentRoute = (allRoutes: any, location: any) => {
    for (let i = 0; i < allRoutes.length; i++) {
      if (allRoutes[i]?.routes?.length) {
        findCurrentRoute(allRoutes[i].routes, location)
      }
      if (allRoutes[i].path === location.path) {
        currentRoute = allRoutes[i]
      }
    }

    if (currentRoute && !isNullObject(currentRoute)) {
      return currentRoute
    }
  }

  const findParentObjects = (
    objArray: any[],
    targetObj: any,
    parentObjects: any[] = []
  ) => {
    for (let i = 0; i < objArray.length; i++) {
      const currentObj = objArray[i]

      // 如果当前对象是目标对象，返回父级对象数组
      if (currentObj === targetObj) {
        return parentObjects
      }

      // 如果当前对象是一个包含子对象的对象，继续递归查找
      if (currentObj.routes && Array.isArray(currentObj.routes)) {
        const result: any = findParentObjects(currentObj.routes, targetObj, [
          ...parentObjects,
          currentObj
        ])

        // 如果在子对象中找到了目标对象，返回父级对象数组
        if (result) {
          return result
        }
      }
    }

    // 如果在整个数组中都没有找到目标对象，返回空数组
    return []
  }

  return (
    <div className={cn(styles.theBreadcrumb)}>
      <Breadcrumb items={breadcrumb} />
    </div>
  )
})

export default TheBreadcrumb
