import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Form, Tag } from 'antd'
import cn from 'classnames'
import styles from './liveUser.less'
import { filterEventsType, storage } from '@/utils'
import DayJS from 'dayjs'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { env } from '@/config/env'
import { cloneDeep } from 'lodash'

interface Props {
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}

const LiveUser: React.FC<Props> = memo((props) => {
  const { handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [data, setData] = useState([])
  const [connectWebSocket, setConnectWebSocket] = useState(true)
  const [allMessageInfo, setAllMessageInfo] = useState<any[]>([])

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const eventTypeConfig = useMemo<any>(
    () => ({
      30: { color: '#278b78', status: 'success' },
      21: { color: '#9a000d', status: 'error' },
      28: { color: '#f98b50', status: 'warning' },
      31: { color: '#0a54a7', status: 'processing' },
      default: { color: '#0a54a7', status: 'processing' }
    }),
    []
  )

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(
    `${env.WSS_URL}backend/notifications/?token=${storage.getSession('token')}`,
    {
      share: true,
      reconnectInterval: 2000,
      reconnectAttempts: 3,
      onOpen: (event) => {
        console.log('WebSocket 打开了', event)
      },
      onMessage: (event) => {
        const values = JSON.parse(event.data)
        if (values.type === 5) {
          console.log('阳性结果', values)
          handleAllMessageInfo(values)
        }
      },
      onClose: (event) => {
        console.log('WebSocket 关闭了', event)
      },
      onError: (error) => {
        console.error('WebSocket 错误', error)
      },
      shouldReconnect: (event) => {
        console.log('应该自动重连', event)
        return true
      }
    },
    connectWebSocket
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
      console.log('自动滚动到底部', contentRef.current.scrollTop)
    }
  }, [allMessageInfo])
  const handleAllMessageInfo = (data: any) => {
    let allData = cloneDeep(allMessageInfo)
    if (allData.length < 50) {
      allData.push(data)
    } else {
      allData.splice(0, 1)
      allData.push(data)
    }
    setAllMessageInfo(allData)
  }

  const onOpen = (value: any) => {
    handleOk?.(value)
  }

  const handleNewOk = () => {
    console.log('操作成功')
    setIsVisibleHistory(false)
  }

  return (
    <div className={cn(styles.liveUser)}>
      <div className={cn(styles.header)}>
        <span>正在发生</span>
      </div>
      <div className={cn(styles.content)} ref={contentRef}>
        {allMessageInfo?.map((item: any, index) => {
          const eventType = Number(item.content?.metrics?.events[0].type)
          const { color, status } =
            eventTypeConfig[eventType] || eventTypeConfig.default

          return (
            <div
              key={index}
              className={cn(styles.item)}
              onClick={() => onOpen(item)}
            >
              <div className={cn(styles.itemContent)}>
                <div className={cn(styles.name)}>
                  <Badge color={color} />
                  <span className={cn(styles.value)} style={{ color }}>
                    {item.content?.username}
                  </span>
                </div>
                <div className={cn(styles.type)}>
                  <Tag color={color}>{filterEventsType(eventType)}</Tag>
                </div>
                <div className={cn(styles.time)}>
                  {DayJS(item.timestamp * 1000).format('HH:mm')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default LiveUser
