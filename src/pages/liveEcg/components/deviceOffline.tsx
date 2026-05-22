import React, { memo, useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'
import styles from './deviceOffline.less'
import DayJS from 'dayjs'
import DeviceOfflineUserInfo from '@/pages/liveEcg/components/deviceOfflineUserInfo'

interface Props {
  isVisible?: boolean
  data?: any[]
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
let audioSrc = require('../../../assets/sound/yellowWarn.mp3')

const DeviceOffline: React.FC<Props> = memo((props) => {
  const { isVisible = false, data, handleOk, handleCancel } = props
  const [isVisibleDeviceOfflineUserInfo, setIsVisibleDeviceOfflineUserInfo] =
    useState(false)
  const [rowData, setRowData] = useState({})
  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [data])

  const onOpen = (value: any) => {
    setIsVisibleDeviceOfflineUserInfo(true)
    setRowData(value)
    console.log('选择的当前项', value)
  }

  const handleDeviceOfflineUserInfoCancel = () => {
    setIsVisibleDeviceOfflineUserInfo(false)
    console.log('关闭了')
  }

  return (
    <>
      {isVisible && (
        <div className={cn(styles.deviceOffline)}>
          <div className={cn(styles.header)}>
            <span>设备信号中断通知</span>
          </div>
          <div className={cn(styles.content)} ref={contentRef}>
            {data?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn(styles.item)}
                  onClick={() => onOpen(item)}
                >
                  <div className={cn(styles.itemContent)}>
                    <div className={cn(styles.time)}>
                      {DayJS(item.timestamp * 1000).format('HH:mm')}，
                    </div>
                    <div className={cn(styles.name)}>
                      {item.content?.username}，
                    </div>
                    <div className={cn(styles.type)}>信号丢失</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <DeviceOfflineUserInfo
        data={rowData}
        isVisible={isVisibleDeviceOfflineUserInfo}
        handleCancel={handleDeviceOfflineUserInfoCancel}
      />
    </>
  )
})

export default DeviceOffline
