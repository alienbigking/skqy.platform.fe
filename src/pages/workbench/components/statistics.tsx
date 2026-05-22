import React, { memo, useEffect, useRef, useState } from 'react'
import { Badge, Form } from 'antd'
import cn from 'classnames'
import styles from './statistics.less'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { workbenchService } from '@/pages/workbench/services'

interface Props {
  isVisible?: boolean
  dataSource?: any[]
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
const Statistics: React.FC<Props> = memo((props) => {
  const { isVisible = false, dataSource, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [data, setData] = useState<any>({})

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)

  let generalWarnData = useRef<any[]>([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const { data } = await workbenchService.getSummaryList()
    console.log('摘要信息', data)
    setData(data)
  }
  const onOpen = (value: any) => {
    handleOk?.(value)
  }

  const handleNewOk = () => {}

  return (
    <div className={cn(styles.statistics)}>
      <div className={cn(styles.content)}>
        {/*上线统计*/}
        <div className={cn(styles.block)}>
          <div className={cn(styles.left)}>
            <div className={cn(styles.text)}>
              <Badge status="success" />
              <span className={cn([styles.title, styles.leftTitle])}>
                当前上线人数
              </span>
            </div>
            <span className={cn(styles.describe)}>
              较昨日
              {data.onlineUser - data.onlineUserPreviousDay > 0
                ? data.onlineUser - data.onlineUserPreviousDay
                : data.onlineUserPreviousDay - data.onlineUser}
              {data.onlineUser - data.onlineUserPreviousDay > 0 ? (
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              ) : (
                <ArrowDownOutlined
                  style={{ color: '#4c9959', marginLeft: 4 }}
                />
              )}
            </span>
          </div>
          <div className={cn(styles.right)}>{data.onlineUser}</div>
        </div>

        <div className={cn(styles.block)}>
          <div className={cn(styles.left)}>
            <div className={cn(styles.text)}>
              <span className={cn(styles.title)}>今日预警阳性</span>
            </div>
            <span className={cn(styles.describe)}>
              较昨日
              {data.positiveUser - data.positiveUserPreviousDay > 0
                ? data.positiveUser - data.positiveUserPreviousDay
                : data.onlineUserPreviousDay - data.positiveUser}
              {data.positiveUser - data.positiveUserPreviousDay > 0 ? (
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              ) : (
                <ArrowDownOutlined
                  style={{ color: '#4c9959', marginLeft: 4 }}
                />
              )}
            </span>
          </div>
          <div className={cn(styles.right)}>{data.positiveUser}</div>
        </div>

        <div className={cn(styles.block)}>
          <div className={cn(styles.left)}>
            <div className={cn(styles.text)}>
              <span className={cn(styles.title)}>当前新增注册</span>
            </div>
            <span className={cn(styles.describe)}>
              较昨日
              {data.registerUser - data.registerUserPreviousDay > 0
                ? data.registerUser - data.registerUserPreviousDay
                : data.registerUserPreviousDay - data.registerUser}
              {data.registerUser - data.registerUserPreviousDay > 0 ? (
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              ) : (
                <ArrowDownOutlined
                  style={{ color: '#4c9959', marginLeft: 4 }}
                />
              )}
            </span>
          </div>
          <div className={cn(styles.right)}>{data.registerUser}</div>
        </div>

        <div className={cn(styles.block)}>
          <div className={cn(styles.left)}>
            <div className={cn(styles.text)}>
              <span className={cn(styles.title)}>房颤事件</span>
            </div>
            <span className={cn(styles.describe)}>
              较昨日
              {data.atrialFibrillationUser -
                data.atrialFibrillationUserPreviousDay >
              0
                ? data.atrialFibrillationUser -
                  data.atrialFibrillationUserPreviousDay
                : data.atrialFibrillationUserPreviousDay -
                  data.atrialFibrillationUser}
              {data.atrialFibrillationUser -
                data.atrialFibrillationUserPreviousDay >
              0 ? (
                <ArrowUpOutlined style={{ color: '#ff0000', marginLeft: 4 }} />
              ) : (
                <ArrowDownOutlined
                  style={{ color: '#4c9959', marginLeft: 4 }}
                />
              )}
            </span>
          </div>
          <div className={cn(styles.right)}>{data.atrialFibrillationUser}</div>
        </div>
      </div>
    </div>
  )
})

export default Statistics
