import React, { memo, useRef, useState } from 'react'
import { FloatButton, Form } from 'antd'
import { BellOutlined, DisconnectOutlined } from '@ant-design/icons'
import MessageInfo from '@/pages/liveEcg/components/messageInfo'
import DeviceOffline from '@/pages/liveEcg/components/deviceOffline'

interface Props {
  data?: {
    messageInfo?: any[]
    deviceOfflineInfo?: any[]
  }
  handleCallback?: {
    handleMessageInfo?: (value: any) => void
    handleDeviceOffline?: (value?: any) => void
  }
  handleOk?: (value: any) => void
  handleCancel?: () => void
}

type FieldType = {
  name?: string
  remark?: string
}
const Toolbar: React.FC<Props> = memo((props) => {
  const { data, handleCallback, handleOk, handleCancel } = props
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [isVisibleHistory, setIsVisibleHistory] = useState(false)
  const [rowData, setRowData] = useState({})
  const [isVisibleMessageInfo, setIsVisibleMessageInfo] = useState(false)
  const [isVisibleDeviceOffline, setIsVisibleDeviceOffline] = useState(false)

  const [form] = Form.useForm()
  const inputRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const onMessage = () => {
    setIsVisibleMessageInfo(!isVisibleMessageInfo)
  }

  const onDeviceOffline = () => {
    setIsVisibleDeviceOffline(!isVisibleDeviceOffline)
  }

  const handleMessageInfoOk = (value: any) => {
    if (handleCallback?.handleMessageInfo) {
      handleCallback.handleMessageInfo(value)
    }
  }
  const handleDeviceOfflineOk = (value: any) => {
    if (handleCallback?.handleDeviceOffline) {
      handleCallback.handleDeviceOffline(value)
    }
  }

  return (
    <>
      <FloatButton.Group shape="square" style={{ right: 15 }}>
        <FloatButton icon={<BellOutlined />} onClick={onMessage} />
        <FloatButton icon={<DisconnectOutlined />} onClick={onDeviceOffline} />
      </FloatButton.Group>

      <MessageInfo
        isVisible={isVisibleMessageInfo}
        handleOk={(value) => handleMessageInfoOk(value)}
        data={data?.messageInfo}
      />

      <DeviceOffline
        isVisible={isVisibleDeviceOffline}
        handleOk={(value) => handleDeviceOfflineOk(value)}
        data={data?.deviceOfflineInfo}
      />
    </>
  )
})

export default Toolbar
