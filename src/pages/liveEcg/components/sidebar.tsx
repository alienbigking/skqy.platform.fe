import React, { memo, useEffect, useRef, useState } from 'react'
import { Badge, Form, Input } from 'antd'
import cn from 'classnames'
import styles from './sidebar.less'
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons'
import { liveEcgService } from '../services'
import { calculateAge, gender } from '@/utils'

interface Props {
  isVisible?: boolean
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
const Sidebar: React.FC<Props> = memo((props) => {
  const { isVisible = false, handleOk, handleCancel } = props
  const [dataList, setDataList] = useState([])

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  useEffect(() => {
    getList()

    const intervalId = setInterval(() => {
      getList()
    }, 30000) // 每30秒执行一次

    return () => clearInterval(intervalId) // 清除定时器
  }, [])

  const getList = async (params?: any) => {
    const { code, data } = await liveEcgService.getLiveUserList({
      username: params?.username
    })
    // console.log('获取实时在线的用户', data)
    if (code === '200') {
      // console.log('获取实时在线的用户数据', data)
      setDataList(data.list)
    }
  }

  const onSearch = (values: any) => {
    const value = inputRef.current.input.value

    console.log('搜索了', value)
    getList({
      username: value
    })
  }

  const onReset = () => {
    console.log('重置')
    // inputRef.current.input.value = ''
    getList({
      username: ''
    })
    // const result = data?.map((item: any) => {
    //   item.customClassName = ECustomClassName.showHeartRate
    //   return item
    // })
    // console.log('搜索内容及结果', result)
  }

  const onChangeUser = (value: any) => {
    console.log('点击时的用户信息', value)
    handleOk?.(value)
  }

  return (
    <div className={cn(styles.sidebar)}>
      <div className={cn(styles.header)}>
        <Input
          ref={inputRef}
          className={cn(styles.searchInput)}
          size="large"
          allowClear={{
            clearIcon: <CloseCircleFilled onClick={() => onReset()} />
          }}
          placeholder="请输入姓名"
          prefix={<SearchOutlined style={{ color: '#ffffff' }} />}
          onPressEnter={onSearch}
        />
      </div>
      <div className={cn(styles.content)}>
        {dataList?.map((item: any, index) => {
          return (
            <div
              key={index}
              className={cn(styles.item)}
              onClick={() => onChangeUser(item)}
            >
              {/*<Avatar size={64} icon={<UserOutlined />} />*/}
              <div className={cn(styles.itemContent)}>
                <div className={cn(styles.itemName)}>{item.username}</div>
                <div className={cn(styles.itemAge)}>
                  {calculateAge(item.birthDate)}
                </div>
                <div className={cn(styles.gender)}>{gender(item.gender)}</div>
              </div>
              {/*<div className={cn(styles.heart)}>BPM {item.avgHr}</div>*/}
              <div className={cn(styles.state)}>
                {item.online === 1 ? <Badge status="success" /> : ''}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Sidebar
