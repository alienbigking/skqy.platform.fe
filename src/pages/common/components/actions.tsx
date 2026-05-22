import React, { Fragment, useState } from 'react'
import cn from 'classnames'
import { Layout, Row, Button, Spin, Segmented, Tabs } from 'antd'
import styles from './actions.less'
import { TActionOptions } from '../types/common'

interface Props {}

const Actions: React.FC<Props> = (props) => {
  // @ts-ignore
  const options = [
    {
      label: '全局',
      value: 0,
      component: <Fragment></Fragment>
    },
    {
      label: '用户触发事件',
      value: 1
    },
    {
      label: '停搏',
      value: 2
    },
    {
      label: '室速',
      value: 3
    },
    {
      label: '房颤',
      value: 4
    },
    {
      label: '早搏',
      value: 5
    },
    {
      label: '漏跳',
      value: 6
    }
  ]

  const onChange = (value: string | number) => {
    console.log('滑块value', value)
  }

  return (
    <div className={cn(styles.actions)}>
      <Tabs
        onChange={onChange}
        type="line"
        items={options.map((item, i) => {
          const id = String(i + 1)
          return {
            label: item.label,
            key: id,
            children: item.component
          }
        })}
      />
    </div>
  )
}

export default Actions
